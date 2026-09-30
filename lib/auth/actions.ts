"use server";

import { redirect } from "next/navigation";
import crypto from "crypto";
import { loginSchema, registerSchema } from "@/lib/validation/auth";
import {
  findByEmail,
  findByUsername,
  createUser,
  setPasswordReset,
  clearPasswordReset,
  findByResetCode,
  updatePasswordAndClearReset,
} from "@/lib/db/repositories/user.repository";
import { hashPassword, verifyPassword } from "@/lib/auth/bcrypt";
import { createSession, deleteSession } from "@/lib/auth/session";
import { sendPasswordResetEmail } from "@/lib/services/mail";

export async function loginAction(_prevState: { error?: string } | null, formData: FormData) {
  const identifier = formData.get("identifier");
  const password = formData.get("password");

  const validated = loginSchema.safeParse({ identifier, password });
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || "Geçersiz form verisi" };
  }

  const { identifier: rawIdentifier, password: validatedPassword } = validated.data;
  const normalized = rawIdentifier.trim();

  try {
    // Legacy login is username-based; also accept e-mail (no enumeration).
    const user =
      (await findByUsername(normalized)) ??
      (await findByEmail(normalized.toLowerCase()));
    if (!user) {
      return { error: "Kullanıcı adı veya şifre hatalı" };
    }

    const isValidPassword = await verifyPassword(validatedPassword, user.password);
    if (!isValidPassword) {
      return { error: "Kullanıcı adı veya şifre hatalı" };
    }

    await createSession({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Giriş yapılırken bir hata oluştu" };
  }

  redirect("/hesap");
}

export async function registerAction(_prevState: { error?: string } | null, formData: FormData) {
  const rawData = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    name: formData.get("name"),
    surname: formData.get("surname"),
    kvkk: formData.get("kvkk"),
    privacy: formData.get("privacy"),
    terms: formData.get("terms"),
    analyticsCookies: formData.get("analyticsCookies") === "on",
    personalizationCookies: formData.get("personalizationCookies") === "on",
    serviceDataUsage: formData.get("serviceDataUsage") === "on",
    personalizedContent: formData.get("personalizedContent") === "on",
  };

  const validated = registerSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || "Geçersiz form verisi" };
  }

  const data = validated.data;

  try {
    const existingEmail = await findByEmail(data.email);
    if (existingEmail) {
      return { error: "Bu email veya kullanıcı adı zaten kayıtlı" };
    }

    const existingUsername = await findByUsername(data.username);
    if (existingUsername) {
      return { error: "Bu email veya kullanıcı adı zaten kayıtlı" };
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await createUser({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      name: data.name,
      surname: data.surname,
      analyticsCookies: data.analyticsCookies,
      personalizationCookies: data.personalizationCookies,
      serviceDataUsage: data.serviceDataUsage,
      personalizedContent: data.personalizedContent,
    });

    await createSession({
      _id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Register error:", error);
    return { error: "Kayıt olurken bir hata oluştu" };
  }

  redirect("/hesap");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/giris");
}

export async function forgotPasswordAction(_prevState: { error?: string; success?: string } | null, formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();

  if (!email) {
    return { error: "E-posta adresi gerekli" };
  }

  try {
    const user = await findByEmail(email);
    if (!user) {
      return { success: "Eğer e-posta adresi kayıtlıysa, sıfırlama bağlantısı gönderildi." };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await setPasswordReset(user._id.toString(), {
      resetCode: hashedToken,
      resetCodeExpires: Date.now() + 60 * 60 * 1000,
    });

    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/sifremi-unuttum?token=${resetToken}&showNewPass=1`;

    const mailSent = await sendPasswordResetEmail(user.email, resetLink);
    if (!mailSent) {
      await clearPasswordReset(user._id.toString());
      return { error: "Mail gönderilemedi, lütfen daha sonra tekrar deneyin" };
    }

    return { success: "Eğer e-posta adresi kayıtlıysa, sıfırlama bağlantısı gönderildi." };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { error: "Bir hata oluştu, lütfen tekrar deneyin" };
  }
}

export async function resetPasswordAction(_prevState: { error?: string; success?: string } | null, formData: FormData) {
  const token = formData.get("token")?.toString();
  const password1 = formData.get("password1")?.toString();
  const password2 = formData.get("password2")?.toString();

  if (!token) {
    return { error: "Geçersiz işlem" };
  }

  if (!password1 || !password2) {
    return { error: "Şifre alanları gerekli" };
  }

  if (password1 !== password2) {
    return { error: "Şifreler eşleşmiyor" };
  }

  if (password1.length < 6) {
    return { error: "Şifre en az 6 karakter olmalı" };
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const userDoc = await findByResetCode(hashedToken);
    if (!userDoc) {
      return { error: "Geçersiz veya süresi dolmuş bağlantı" };
    }

    const hashedPassword = await hashPassword(password1);
    await updatePasswordAndClearReset(userDoc._id.toString(), hashedPassword);

    redirect("/giris?success=Şifreniz+başarıyla+güncellendi");
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "Şifre güncellenemedi" };
  }
}
