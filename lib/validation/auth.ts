import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Kullanıcı adı veya e-posta gerekli"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Kullanıcı adı 3-24 karakter olmalıdır")
      .max(24, "Kullanıcı adı 3-24 karakter olmalıdır")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Kullanıcı adı sadece harf, rakam ve _ içerebilir"
      ),
    email: z.string().trim().toLowerCase().email("Geçerli bir e-posta adresi giriniz"),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)/,
        "Şifre bir büyük harf ve bir rakam içermelidir"
      ),
    passwordConfirm: z.string(),
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
    kvkk: z.literal("on", {
      message: "Açık rıza metni kabul edilmelidir",
    }),
    privacy: z.literal("on", {
      message: "Gizlilik politikası kabul edilmelidir",
    }),
    terms: z.literal("on", {
      message: "Kullanım şartları kabul edilmelidir",
    }),
    analyticsCookies: z.boolean().optional().default(true),
    personalizationCookies: z.boolean().optional().default(true),
    serviceDataUsage: z.boolean().optional().default(true),
    personalizedContent: z.boolean().optional().default(true),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Şifreler eşleşmiyor",
    path: ["passwordConfirm"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token gereklidir"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
