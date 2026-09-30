"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/auth/actions";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-xl border border-border shadow-sm">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Oturum Aç</h1>
        <p className="text-muted text-sm">
          MSFL Tarih Kulübü hesabınıza giriş yapın
        </p>
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-destructive-foreground bg-destructive rounded-lg">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="identifier">
            Kullanıcı Adı veya E-posta
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            required
            autoComplete="username"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="kullaniciadi veya ornek@email.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="password">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <div className="text-center text-sm text-muted space-y-2">
        <p>
          <Link href="/sifremi-unuttum" className="text-accent font-medium hover:underline">
            Şifremi Unuttum
          </Link>
        </p>
        <p>
          Hesabınız yok mu?{" "}
          <Link href="/kayit" className="text-accent font-medium hover:underline">
            Kayıt Olun
          </Link>
        </p>
        <p>
          <Link href="/" className="hover:underline">
            ← Ana Sayfaya Dön
          </Link>
        </p>
      </div>
    </div>
  );
}
