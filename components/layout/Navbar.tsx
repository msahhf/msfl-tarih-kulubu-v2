import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";

const NAV_LINKS = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkinda", label: "Hakkında" },
  { href: "/blog", label: "Blog" },
  { href: "/etkinlikler", label: "Etkinlikler" },
  { href: "/tarihte-bugun", label: "Tarihte Bugün" },
  { href: "/yardim-destek", label: "Yardım & Destek" },
];

export async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 bg-accent text-accent-foreground border-t-2 border-t-gold-bright shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Üst sıra: logolar + başlık + oturum */}
        <div className="h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            aria-label="MSFL Tarih Kulübü ana sayfa"
          >
            <Image
              src="/img/logo-kulup.webp"
              alt="MSFL Tarih Kulübü logosu"
              width={48}
              height={48}
              className="h-11 w-11 shrink-0 rounded-full object-contain"
              priority
            />
            <Image
              src="/img/logo-msfl.webp"
              alt="Mustafa Saffet Fen Lisesi logosu"
              width={44}
              height={44}
              className="hidden h-10 w-10 shrink-0 rounded-full object-contain sm:block"
              priority
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-lg font-bold tracking-wide sm:text-xl">
                <span className="hidden sm:inline">Mustafa Saffet Fen Lisesi </span>
                Tarih Kulübü
              </span>
              <span className="hidden text-[0.65rem] uppercase tracking-[0.28em] text-accent-foreground/70 md:block">
                Geçmişin İzinde, Geleceğin Peşinde
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/hesap"
                  className="text-sm font-medium underline-offset-4 decoration-gold-bright/50 hover:decoration-gold-bright hover:text-white transition-colors"
                >
                  @{session.username}
                </Link>
                {session.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="hidden text-xs px-2 py-1 border border-gold-bright/60 text-gold-bright font-semibold rounded-sm hover:bg-gold-bright/10 transition-colors sm:inline-block"
                  >
                    Admin
                  </Link>
                )}
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-sm text-accent-foreground/85 hover:text-white underline underline-offset-4 decoration-accent-foreground/40 hover:decoration-white font-medium transition-colors"
                  >
                    Çıkış
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/giris"
                  className="whitespace-nowrap text-sm font-medium px-3 py-2 sm:px-4 border border-accent-foreground/40 rounded-sm hover:border-accent-foreground hover:bg-accent-foreground/10 transition-colors"
                >
                  <span className="sm:hidden">Giriş</span>
                  <span className="hidden sm:inline">Oturum Aç</span>
                </Link>
                <Link
                  href="/kayit"
                  className="whitespace-nowrap text-sm font-semibold px-3 py-2 sm:px-4 bg-gold-bright text-ink border border-gold-bright rounded-sm hover:bg-accent-foreground hover:text-accent-foreground hover:border-accent-foreground transition-colors"
                >
                  <span className="sm:hidden">Kayıt</span>
                  <span className="hidden sm:inline">Kayıt Ol</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Alt sıra: bölüm bağlantıları — mobilde yatay kaydırılabilir */}
        <nav aria-label="Ana menü">
          <ul className="flex items-center gap-5 sm:gap-6 overflow-x-auto whitespace-nowrap border-t border-accent-foreground/15 py-2.5 -mx-4 px-4 sm:mx-0 sm:px-0 text-sm font-medium text-accent-foreground/80 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="underline-offset-8 decoration-gold-bright decoration-2 hover:text-white hover:decoration-gold-bright focus-visible:decoration-gold-bright transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
