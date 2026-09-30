import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ad en az 2 karakter olmalıdır")
    .max(50, "Ad en fazla 50 karakter olmalıdır"),
  surname: z
    .string()
    .trim()
    .min(2, "Soyad en az 2 karakter olmalıdır")
    .max(50, "Soyad en fazla 50 karakter olmalıdır"),
  username: z
    .string()
    .trim()
    .min(3, "Geçersiz kullanıcı adı")
    .max(20, "Geçersiz kullanıcı adı")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Kullanıcı adı sadece harf, rakam, nokta ve alt çizgi içerebilir"
    ),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta adresi giriniz"),
  bio: z
    .string()
    .trim()
    .max(500, "Biyografi en fazla 500 karakter olmalıdır")
    .default(""),
});

export const socialSchema = z.object({
  instagram: z.string().trim().max(100).default(""),
  x: z.string().trim().max(100).default(""),
  github: z.string().trim().max(100).default(""),
  youtube: z.string().trim().max(100).default(""),
  website: z.string().trim().max(200).default(""),
});

export const preferencesSchema = z.object({
  analyticsCookies: z.boolean().default(false),
  personalizationCookies: z.boolean().default(false),
  serviceDataUsage: z.boolean().default(false),
  personalizedContent: z.boolean().default(false),
});

const newPasswordSchema = z
  .string()
  .min(8, "Yeni şifre en az 8 karakter olmalıdır")
  .regex(
    /^(?=.*[A-Z])(?=.*\d)/,
    "Yeni şifre bir büyük harf ve bir rakam içermelidir"
  );

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre gerekli"),
    newPassword: newPasswordSchema,
    newPasswordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Yeni şifreler eşleşmiyor",
    path: ["newPasswordConfirm"],
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Onay için şifrenizi girin"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type SocialInput = z.infer<typeof socialSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
