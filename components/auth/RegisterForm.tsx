"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/lib/auth/actions";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="w-full max-w-lg">
      <div className="bg-surface border border-border border-t-2 border-t-accent rounded-md shadow-md">
        <div className="px-8 pt-8 pb-6 sm:px-10 text-center space-y-3 border-b border-border">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gold">
            Kulüp Arşivi • Yeni Üye Kaydı
          </p>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
            Kayıt Ol
          </h1>
          <p className="text-muted-foreground text-sm">
            MSFL Tarih Kulübü topluluğuna katılın
          </p>
        </div>

        <div className="px-8 py-8 sm:px-10 space-y-6">
          {state?.error && (
            <div
              id="register-error"
              role="alert"
              aria-live="assertive"
              className="p-3 text-sm bg-destructive/10 border-l-2 border-destructive text-destructive rounded-sm"
            >
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="field-label" htmlFor="name">
                  Ad
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="given-name"
                  className="field-input"
                  placeholder="Adınız"
                  aria-describedby={state?.error ? "register-error" : undefined}
                />
              </div>
              <div className="space-y-2">
                <label className="field-label" htmlFor="surname">
                  Soyad
                </label>
                <input
                  id="surname"
                  name="surname"
                  type="text"
                  required
                  autoComplete="family-name"
                  className="field-input"
                  placeholder="Soyadınız"
                  aria-describedby={state?.error ? "register-error" : undefined}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="field-label" htmlFor="username">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="field-input"
                placeholder="kullaniciadi"
                aria-describedby={state?.error ? "register-error" : undefined}
              />
            </div>

            <div className="space-y-2">
              <label className="field-label" htmlFor="email">
                E-posta Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="field-input"
                placeholder="ornek@email.com"
                aria-describedby={state?.error ? "register-error" : undefined}
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
                minLength={8}
                autoComplete="new-password"
                className="field-input"
                placeholder="••••••••"
                aria-describedby="password-hint"
              />
              <p id="password-hint" className="text-xs text-muted-foreground">
                En az 8 karakter, bir büyük harf ve bir rakam içermelidir.
              </p>
            </div>

            <div className="space-y-2">
              <label className="field-label" htmlFor="passwordConfirm">
                Şifre (Tekrar)
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="field-input"
                placeholder="••••••••"
                aria-describedby={state?.error ? "register-error" : undefined}
              />
            </div>

            <div className="rule-double pt-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Yasal Onaylar
              </p>
              <label className="flex items-start gap-3 cursor-pointer text-sm text-muted-foreground">
                <input type="checkbox" name="kvkk" required className="mt-0.5 accent-accent" />
                <span>
                  <Link
                    href="/legal/acik-riza-metni"
                    className="text-accent underline-offset-4 decoration-gold/60 hover:decoration-accent"
                  >
                    Açık rıza metni
                  </Link>
                  ni okudum, kabul ediyorum
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer text-sm text-muted-foreground">
                <input type="checkbox" name="privacy" required className="mt-0.5 accent-accent" />
                <span>
                  <Link
                    href="/legal/gizlilik-politikasi"
                    className="text-accent underline-offset-4 decoration-gold/60 hover:decoration-accent"
                  >
                    Gizlilik politikası
                  </Link>
                  nı okudum, kabul ediyorum
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer text-sm text-muted-foreground">
                <input type="checkbox" name="terms" required className="mt-0.5 accent-accent" />
                <span>
                  <Link
                    href="/legal/kullanim-sartlari"
                    className="text-accent underline-offset-4 decoration-gold/60 hover:decoration-accent"
                  >
                    Kullanım şartları
                  </Link>
                  nı okudum, kabul ediyorum
                </span>
              </label>
            </div>

            <div className="rule-double pt-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Tercihler ve İzinler
              </p>
              <p className="text-xs text-muted-foreground">
                Bu tercihlere şimdi ya da daha sonra hesap ayarlarından karar
                verebilirsiniz.
              </p>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-muted-foreground">
                <input type="checkbox" name="analyticsCookies" className="accent-accent" />
                <span>Analitik çerezleri kullanımına izin ver</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-muted-foreground">
                <input type="checkbox" name="personalizationCookies" className="accent-accent" />
                <span>Kişiselleştirme çerezlerine izin ver</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-muted-foreground">
                <input type="checkbox" name="serviceDataUsage" className="accent-accent" />
                <span>Hizmet verilerinin kullanımını onaylıyorum</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-muted-foreground">
                <input type="checkbox" name="personalizedContent" className="accent-accent" />
                <span>Kişiselleştirilmiş içerik gösterilmesini istiyorum</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-accent text-accent-foreground font-semibold border border-accent rounded-sm hover:bg-accent-strong hover:border-accent-strong transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </button>
          </form>

          <div aria-hidden="true" className="rule-double" />

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              Zaten hesabınız var mı?{" "}
              <Link
                href="/giris"
                className="text-accent font-medium underline-offset-4 decoration-gold/60 hover:decoration-accent"
              >
                Giriş Yapın
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
