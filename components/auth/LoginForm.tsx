"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/auth/actions";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface border border-border border-t-2 border-t-accent rounded-md shadow-md">
        <div className="px-8 pt-8 pb-6 sm:px-10 text-center space-y-3 border-b border-border">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gold">
            Kulüp Arşivi • Üye Girişi
          </p>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
            Oturum Aç
          </h1>
          <p className="text-muted-foreground text-sm">
            MSFL Tarih Kulübü hesabınıza giriş yapın
          </p>
        </div>

        <div className="px-8 py-8 sm:px-10 space-y-6">
          {state?.error && (
            <div
              id="login-error"
              role="alert"
              aria-live="assertive"
              className="p-3 text-sm bg-destructive/10 border-l-2 border-destructive text-destructive rounded-sm"
            >
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <label className="field-label" htmlFor="identifier">
                Kullanıcı Adı veya E-posta
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                autoComplete="username"
                className="field-input"
                placeholder="kullaniciadi veya ornek@email.com"
                aria-describedby={state?.error ? "login-error" : undefined}
              />
            </div>

            <div className="space-y-2">
              <label className="field-label" htmlFor="password">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="field-input"
                placeholder="••••••••"
                aria-describedby={state?.error ? "login-error" : undefined}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-accent text-accent-foreground font-semibold border border-accent rounded-sm hover:bg-accent-strong hover:border-accent-strong transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div aria-hidden="true" className="rule-double" />

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              <Link
                href="/sifremi-unuttum"
                className="text-accent font-medium underline-offset-4 decoration-gold/60 hover:decoration-accent"
              >
                Şifremi Unuttum
              </Link>
            </p>
            <p>
              Hesabınız yok mu?{" "}
              <Link
                href="/kayit"
                className="text-accent font-medium underline-offset-4 decoration-gold/60 hover:decoration-accent"
              >
                Kayıt Olun
              </Link>
            </p>
            <p>
              <Link href="/" className="underline-offset-4 decoration-border-strong hover:decoration-foreground">
                ← Ana Sayfaya Dön
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
