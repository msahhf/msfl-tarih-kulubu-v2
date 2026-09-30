import type { TarihEvent } from "../../types/tarihte-bugun";

export interface GeminiTarihteBugunResponse {
  events: TarihEvent[];
}

export async function generateTarihteBugunFromGemini(dateStr: string): Promise<{ events: TarihEvent[]; rawText: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined");
  }

  const prompt = `Sen uzman bir tarihçisin. Türkiye ve dünya tarihi konusunda son derece bilgilisin.
Bugünün tarihi (${dateStr}, Ay-Gün) tarihinde geçmişte gerçekleşmiş tam olarak 3 adet GERÇEK ve DOĞRULANABİLİR tarihî olay seç.
Seçtiğin olaylar dünya veya Türk tarihinden (siyaset, savaşlar, antlaşmalar, bilim, keşif, sanat, kültür, önemli kişiler veya dönüm noktaları) olmalıdır.
KESİNLİKLE güncel haberlerden, günlük siyasi gelişmelerden veya modern siyasi partilerden kaçın. Yalnızca geçmişte o gün yaşanmış tarihî olayları seç.

Çıktıyı SADECE ve SADECE geçerli bir JSON formatında ver. Hiçbir ek açıklama, markdown önek veya metin ekleme.
JSON yapısı tam olarak şu şekilde olmalıdır:
{
  "events": [
    {
      "year": 1923,
      "title": "Olay Başlığı",
      "description": "Olayın kısa, doğru ve akıcı Türkçe açıklaması."
    },
    {
      "year": 1950,
      "title": "Olay Başlığı 2",
      "description": "Olayın kısa, doğru ve akıcı Türkçe açıklaması."
    },
    {
      "year": 1960,
      "title": "Olay Başlığı 3",
      "description": "Olayın kısa, doğru ve akıcı Türkçe açıklaması."
    }
  ]
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Fail fast instead of hanging cron/admin requests indefinitely.
      signal: AbortSignal.timeout(60000),
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!rawText) {
    throw new Error("Gemini API returned empty response");
  }

  let parsed: GeminiTarihteBugunResponse;
  try {
    // Clean potential markdown blocks
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }

    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse Gemini JSON response: ${err}. Raw text: ${rawText}`);
  }

  if (!parsed.events || !Array.isArray(parsed.events) || parsed.events.length === 0) {
    throw new Error("Gemini response did not contain valid events array");
  }

  return {
    events: parsed.events.slice(0, 3), // Ensure exactly 3 events
    rawText,
  };
}
