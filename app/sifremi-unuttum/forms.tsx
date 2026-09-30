"use client";

import { useActionState } from "react";
import { forgotPasswordAction, resetPasswordAction } from "@/lib/auth/actions";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="p-3 text-sm text-destructive-foreground bg-destructive rounded-lg">
          {state.error}
        </div>
      )}

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

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isPending ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
      </button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, null);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="token" value={token} />

      {state?.error && (
        <div className="p-3 text-sm text-destructive-foreground bg-destructive rounded-lg">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none" htmlFor="password1">
          Yeni Şifre
        </label>
        <input
          id="password1"
          name="password1"
          type="password"
          required
          minLength={6}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="••••••••"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none" htmlFor="password2">
          Yeni Şifre (Tekrar)
        </label>
        <input
          id="password2"
          name="password2"
          type="password"
          required
          minLength={6}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isPending ? "Güncelleniyor..." : "Şifreyi Güncelle"}
      </button>
    </form>
  );
}
