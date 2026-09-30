"use server";

import { redirect } from "next/navigation";
import crypto from "crypto";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { getSession } from "@/lib/auth/session";

function getAdminCredentials(): { password: string; username: string | null } {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD environment variable is not defined");
  }
  return { password, username: process.env.ADMIN_USERNAME || null };
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function isAdminSession(): Promise<boolean> {
  const session = await getSession();
  return !!session && session.role === "admin";
}

/** Page-level guard. Redirects non-admins to the admin login. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdminSession())) {
    redirect("/admin/giris");
  }
}

export async function adminLoginAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const username = formData.get("username")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  let credentials: { password: string; username: string | null };
  try {
    credentials = getAdminCredentials();
  } catch {
    console.error("Admin login attempted without ADMIN_PASSWORD configured");
    return { error: "Admin girişi yapılandırılmamış" };
  }

  // Optional username check (only enforced when ADMIN_USERNAME is set).
  // Generic error either way: no enumeration, no hints.
  const usernameOk =
    credentials.username === null || timingSafeEqual(username, credentials.username);
  const passwordOk =
    password.length > 0 && timingSafeEqual(password, credentials.password);

  if (!usernameOk || !passwordOk) {
    return { error: "Geçersiz admin kimlik bilgileri" };
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("Admin login failed: JWT_SECRET missing");
    return { error: "Admin girişi yapılandırılmamış" };
  }

  const token = await new SignJWT({
    userId: "admin",
    username: credentials.username ?? "admin",
    email: "",
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("6h")
    .sign(new TextEncoder().encode(secret));

  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 6 * 60 * 60,
    sameSite: "lax",
    path: "/",
  });

  redirect("/admin/dashboard");
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/");
}
