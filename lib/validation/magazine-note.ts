import { z } from "zod";

export const MAGAZINE_NOTE_MIN_LENGTH = 3;
export const MAGAZINE_NOTE_MAX_LENGTH = 800;
export const MAGAZINE_NOTE_MAX_PAGE = 999;

/**
 * Dergi okuyucu notları — dışa açık (anonim) yorumlar.
 *
 * Ad alanı isteğe bağlıdır; e-posta zorunludur ve yalnızca güvenlik
 * (spam/kötüye kullanım) amacıyla saklanır, hiçbir yerde yayımlanmaz.
 */
export const magazineNoteSchema = z.object({
  issueSlug: z
    .string()
    .trim()
    .min(1, "Sayı belirtilmedi")
    .max(80, "Geçersiz sayı"),
  page: z
    .number({ error: "Sayfa numarası geçersiz" })
    .int("Sayfa numarası tam sayı olmalıdır")
    .min(1, "Sayfa numarası geçersiz")
    .max(MAGAZINE_NOTE_MAX_PAGE, "Sayfa numarası geçersiz"),
  anchor: z
    .object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
    .nullish(),
  body: z
    .string()
    .trim()
    .min(
      MAGAZINE_NOTE_MIN_LENGTH,
      `Yorum en az ${MAGAZINE_NOTE_MIN_LENGTH} karakter olmalıdır`
    )
    .max(
      MAGAZINE_NOTE_MAX_LENGTH,
      `Yorum en fazla ${MAGAZINE_NOTE_MAX_LENGTH} karakter olabilir`
    ),
  name: z
    .string()
    .trim()
    .max(40, "İsim en fazla 40 karakter olabilir")
    .optional()
    .nullable(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Geçerli bir e-posta adresi giriniz")
    .max(254, "E-posta adresi çok uzun"),
  /** Bot tuzağı: normal kullanıcıda boş kalır. */
  website: z.string().max(0).optional(),
});

export type MagazineNoteFormInput = z.infer<typeof magazineNoteSchema>;

/** Kontrol karakterlerini temizler, satır sonlarını ve boşlukları düzenler. */
export function normalizeNoteBody(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** İsim alanını güvenli biçime getirir; boşsa `null` döner. */
export function normalizeNoteName(value: string | null | undefined): string | null {
  if (!value) return null;
  const cleaned = value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
  return cleaned.length >= 2 ? cleaned : null;
}
