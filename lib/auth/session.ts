import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.JWT_SECRET) {
  // No insecure fallback: fail lazily at first use so builds without
  // env don't crash at module evaluation time.
  console.warn("JWT_SECRET environment variable is not defined");
}

function getEncodedKey(): Uint8Array | null {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    return null;
  }
  return new TextEncoder().encode(secretKey);
}

export interface SessionPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  const key = getEncodedKey();
  if (!key) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
  if (!session) return null;
  const key = getEncodedKey();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (_error) {
    return null;
  }
}

export async function createSession(user: { _id: string; username: string; email: string; role: string }): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set("auth_token", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    return decrypt(token);
  } catch (_error) {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}
