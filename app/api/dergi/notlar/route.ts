import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { magazineNoteRepository } from "@/lib/db/repositories";
import {
  findMagazineIssue,
  isKnownMagazineIssue,
  listMagazineNotes,
} from "@/lib/magazine/notes";
import {
  MAGAZINE_NOTE_MIN_LENGTH,
  magazineNoteSchema,
  normalizeNoteBody,
  normalizeNoteName,
} from "@/lib/validation/magazine-note";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8 * 1024;
const TEN_MINUTES = 10 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

/**
 * Basit bellek içi sınırlama. Sunucusuz ortamda her örnek kendi sayacını
 * tutar; kalıcı kötüye kullanım denetimi ayrıca e-posta bazlı olarak
 * veritabanından yapılır (aşağıda).
 */
const recentHits = new Map<string, number[]>();

function registerHit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (recentHits.get(key) ?? []).filter((time) => now - time < windowMs);

  if (hits.length >= limit) {
    recentHits.set(key, hits);
    return false;
  }

  hits.push(now);
  recentHits.set(key, hits);

  if (recentHits.size > 5000) {
    for (const [entryKey, times] of recentHits) {
      if (!times.some((time) => now - time < ONE_HOUR)) {
        recentHits.delete(entryKey);
      }
    }
  }

  return true;
}

function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`dergi-not:${ip}`).digest("hex").slice(0, 32);
}

function errorResponse(
  message: string,
  status: number,
  fieldErrors?: Record<string, string[]>
) {
  return NextResponse.json(
    { ok: false, message, ...(fieldErrors ? { fieldErrors } : {}) },
    { status }
  );
}

/** Bir sayının notlarını listeler: GET /api/dergi/notlar?issue=<slug> */
export async function GET(request: Request) {
  const issueSlug = new URL(request.url).searchParams.get("issue")?.trim() ?? "";

  if (!isKnownMagazineIssue(issueSlug)) {
    return errorResponse("Sayı bulunamadı.", 404);
  }

  const notes = await listMagazineNotes(issueSlug);
  return NextResponse.json({ ok: true, notes });
}

/** Okuyucu notu bırakır: POST /api/dergi/notlar */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return errorResponse("Geçersiz istek.", 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return errorResponse("Gönderilen veri çok büyük.", 413);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Gönderilen veri okunamadı.", 400);
  }

  const parsed = magazineNoteSchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse(
      parsed.error.issues[0]?.message ?? "Form bilgileri geçersiz.",
      400,
      parsed.error.flatten().fieldErrors
    );
  }

  const data = parsed.data;

  // Bot tuzağı doldurulmuşsa sessizce reddet.
  if (data.website) {
    return errorResponse("Gönderim reddedildi.", 400);
  }

  if (!findMagazineIssue(data.issueSlug)) {
    return errorResponse("Sayı bulunamadı.", 404);
  }

  const body = normalizeNoteBody(data.body);
  if (body.length < MAGAZINE_NOTE_MIN_LENGTH) {
    return errorResponse(
      `Yorum en az ${MAGAZINE_NOTE_MIN_LENGTH} karakter olmalıdır.`,
      400,
      { body: [`Yorum en az ${MAGAZINE_NOTE_MIN_LENGTH} karakter olmalıdır.`] }
    );
  }

  if (!registerHit(getClientKey(request), 8, TEN_MINUTES)) {
    return errorResponse(
      "Çok fazla not gönderdiniz. Lütfen birkaç dakika sonra tekrar deneyin.",
      429
    );
  }

  try {
    const recent = await magazineNoteRepository.findRecentByEmail(data.email, new Date(Date.now() - ONE_HOUR));

    const lastTenMinutes = recent.filter(
      (createdAt) => Date.now() - createdAt.getTime() < TEN_MINUTES
    );

    if (lastTenMinutes.length >= 3 || recent.length >= 8) {
      return errorResponse(
        "Bu e-posta adresiyle kısa sürede çok fazla not gönderildi. Lütfen daha sonra tekrar deneyin.",
        429
      );
    }

    const created = await magazineNoteRepository.createNote({
      issueSlug: data.issueSlug,
      page: data.page,
      anchor: data.anchor
        ? {
            x: Math.min(1, Math.max(0, Number(data.anchor.x.toFixed(4)))),
            y: Math.min(1, Math.max(0, Number(data.anchor.y.toFixed(4)))),
          }
        : null,
      body,
      name: normalizeNoteName(data.name),
      email: data.email,
    });

    return NextResponse.json(
      { ok: true, note: magazineNoteRepository.toPublicNote(created) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Dergi notu kaydedilemedi:", error);
    return errorResponse("Notunuz kaydedilemedi. Lütfen tekrar deneyin.", 500);
  }
}
