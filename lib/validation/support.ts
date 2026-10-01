import { z } from "zod";

/** Destek formu konuları — legacy /yardim-destek formu ile aynı değerler. */
export const SUPPORT_TOPICS = [
  "Teknik Hata",
  "İçerik Önerisi",
  "İş Birliği",
  "Diğer",
] as const;

export const supportMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ad Soyad en az 2 karakter olmalıdır")
    .max(100, "Ad Soyad en fazla 100 karakter olabilir"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Geçerli bir e-posta adresi giriniz")
    .max(254, "E-posta adresi çok uzun"),
  topic: z.enum(SUPPORT_TOPICS, { error: "Geçersiz konu seçimi" }).default("Diğer"),
  message: z
    .string()
    .trim()
    .min(10, "Mesaj en az 10 karakter olmalıdır")
    .max(2000, "Mesaj en fazla 2000 karakter olabilir"),
});

export type SupportMessageInput = z.infer<typeof supportMessageSchema>;
