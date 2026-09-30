import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { tarihteBugunRepository } from "@/lib/db/repositories";
import { generateTarihteBugunFromGemini } from "@/lib/services/gemini";

export async function GET(request: NextRequest) {
  try {
    // Verify cron authorization if CRON_SECRET is configured
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Also check Vercel cron header if present
      const isVercelCron = request.headers.get("x-vercel-cron") === "1";
      if (!isVercelCron) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateKey = `${month}-${day}`;

    // Check if entry already exists for today
    const existing = await tarihteBugunRepository.findByDateKey(dateKey);
    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Tarihte bugün içeriği zaten mevcut.",
        dateKey,
        eventsCount: existing.events.length,
      });
    }

    const dateStr = now.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Generate via Gemini API
    const { events, rawText } = await generateTarihteBugunFromGemini(dateStr);

    // Save to MongoDB
    const created = await tarihteBugunRepository.createOrUpsertEntry({
      dateKey,
      events,
      originalAIContent: rawText,
      generatedBy: "gemini",
    });

    return NextResponse.json({
      success: true,
      message: "Tarihte bugün içeriği başarıyla üretildi ve kaydedildi.",
      dateKey,
      events: created.events,
    });
  } catch (error) {
    console.error("Cron tarihte-bugun error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu" },
      { status: 500 }
    );
  }
}
