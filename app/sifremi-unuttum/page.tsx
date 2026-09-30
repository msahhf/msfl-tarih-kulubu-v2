import Link from "next/link";
import { ForgotPasswordForm, ResetPasswordForm } from "./forms";

interface SifremiUnuttumPageProps {
  searchParams: Promise<{ token?: string; showNewPass?: string; success?: string; error?: string }>;
}

export default async function SifremiUnuttumPage({ searchParams }: SifremiUnuttumPageProps) {
  const params = await searchParams;
  const showNewPass = params.showNewPass === "1" && !!params.token;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-xl border border-border shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {showNewPass ? "Yeni Şifre Belirle" : "Şifremi Unuttum"}
          </h1>
          <p className="text-muted text-sm">
            {showNewPass
              ? "Hesabınız için yeni bir şifre belirleyin."
              : "E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim."}
          </p>
        </div>

        {params.success && (
          <div className="p-3 text-sm text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            {params.success}
          </div>
        )}

        {params.error && (
          <div className="p-3 text-sm text-destructive-foreground bg-destructive rounded-lg">
            {params.error}
          </div>
        )}

        {showNewPass ? (
          <ResetPasswordForm token={params.token!} />
        ) : (
          <ForgotPasswordForm />
        )}

        <div className="text-center text-sm text-muted">
          <Link href="/giris" className="text-accent font-medium hover:underline">
            ← Giriş Sayfasına Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
