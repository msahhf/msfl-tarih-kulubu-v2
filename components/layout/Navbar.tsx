import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";

export async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display font-bold text-xl tracking-tight">
            MSFL Tarih Kulübü
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Arşiv / Blog
            </Link>
            <Link href="/etkinlikler" className="hover:text-foreground transition-colors">
              Etkinlikler
            </Link>
            <Link href="/tarihte-bugun" className="hover:text-foreground transition-colors">
              Tarihte Bugün
            </Link>
            <Link href="/hakkinda" className="hover:text-foreground transition-colors">
              Hakkında
            </Link>
            <Link href="/yardim-destek" className="hover:text-foreground transition-colors">
              İletişim & Destek
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/hesap"
                className="text-sm font-medium hover:text-accent transition-colors"
              >
                @{session.username}
              </Link>
              {session.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="text-xs px-2.5 py-1 bg-accent/10 text-accent font-semibold rounded-md hover:bg-accent/20 transition-colors"
                >
                  Admin
                </Link>
              )}
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-sm text-destructive hover:underline font-medium"
                >
                  Çıkış
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/giris"
                className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-surface border border-border transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
