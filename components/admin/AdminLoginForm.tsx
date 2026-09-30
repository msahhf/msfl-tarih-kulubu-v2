"use client";

import { useActionState } from "react";
import Link from "next/link";
import { adminLoginAction } from "@/lib/admin/auth";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLoginAction, null);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-xl border border-border shadow-sm">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Yönetim
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Admin Girişi</h1>
          <p className="text-muted text-sm">
            Yönetim paneline erişmek için admin kimlik bilgilerinizi girin.
          </p>
        </div>

        {state?.error && (
          <div className="p-3 text-sm text-destructive-foreground bg-destructive rounded-lg">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="username">
              Admin Kullanıcı Adı
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="admin"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">
              Admin Parolası
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? "Doğrulanıyor..." : "Admin Girişi"}
          </button>
        </form>

        <div className="text-center text-sm text-muted">
          <Link href="/" className="hover:underline">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
