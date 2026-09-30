"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/lib/auth/actions";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="w-full max-w-lg space-y-8 bg-surface p-8 rounded-xl border border-border shadow-sm">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Kayıt Ol</h1>
        <p className="text-muted text-sm">
          MSFL Tarih Kulübü topluluğuna katılın
        </p>
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-destructive-foreground bg-destructive rounded-lg">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="name">
              Ad
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Adınız"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="surname">
              Soyad
            </label>
            <input
              id="surname"
              name="surname"
              type="text"
              required
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Soyadınız"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="username">
            Kullanıcı Adı
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="kullaniciadi"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="email">
            E-posta Adresi
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="ornek@email.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="password">
            Şifre (en az 8 karakter, bir büyük harf ve bir rakam)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="passwordConfirm">
            Şifre (Tekrar)
          </label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-3 pt-2 border-t border-border text-sm text-muted">
          <p className="font-medium text-foreground">Yasal Onaylar</p>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" name="kvkk" required className="rounded accent-accent mt-1" />
            <span>
              <Link href="/legal/acik-riza-metni" className="text-accent hover:underline">
                Açık rıza metni
              </Link>
              {" "}nı okudum, kabul ediyorum
            </span>
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" name="privacy" required className="rounded accent-accent mt-1" />
            <span>
              <Link href="/legal/gizlilik-politikasi" className="text-accent hover:underline">
                Gizlilik politikası
              </Link>
              {" "}nı okudum, kabul ediyorum
            </span>
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" name="terms" required className="rounded accent-accent mt-1" />
            <span>
              <Link href="/legal/kullanim-sartlari" className="text-accent hover:underline">
                Kullanım şartları
              </Link>
              {" "}nı okudum, kabul ediyorum
            </span>
          </label>
        </div>

        <div className="space-y-3 pt-2 border-t border-border text-sm text-muted">
          <p className="font-medium text-foreground">Tercihler ve İzinler</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="analyticsCookies" defaultChecked className="rounded accent-accent" />
            <span>Analitik çerezleri kullanımına izin ver</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="personalizationCookies" defaultChecked className="rounded accent-accent" />
            <span>Kişiselleştirme çerezlerine izin ver</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="serviceDataUsage" defaultChecked className="rounded accent-accent" />
            <span>Hizmet verilerinin kullanımını onaylıyorum</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="personalizedContent" defaultChecked className="rounded accent-accent" />
            <span>Kişiselleştirilmiş içerik gösterilmesini istiyorum</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isPending ? "Kayıt yapılıyor..." : "Kayıt Ol"}
        </button>
      </form>

      <div className="text-center text-sm text-muted space-y-2">
        <p>
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="text-accent font-medium hover:underline">
            Giriş Yapın
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
