import Link from "next/link";

/**
 * Bağımsız dergi yayını için üst gezinme çubuğu.
 *
 * Yalnızca `NEXT_PUBLIC_MAGAZINE_SITE=1` olan derlemede (dergi.* alan adı)
 * kullanılır; ana sitede standart `Navbar` görünür.
 */
const LINKS = [
  { href: "/dergi", label: "Güncel Sayı" },
  { href: "/dergi#dergi-arsivi", label: "Arşiv" },
  { href: "/hakkinda", label: "Kulüp" },
  { href: "/yardim-destek", label: "İletişim" },
];

export function MagazineNavbar({ mainSiteUrl }: { mainSiteUrl: string }) {
  return (
    <header className="border-b border-gold/25 bg-ink text-accent-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dergi"
            className="group flex min-w-0 items-baseline gap-3"
            aria-label="Derği ana sayfası"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-accent-foreground sm:text-3xl">
              Tarih-i Kadim
            </span>
            <span className="hidden text-[0.62rem] uppercase tracking-[0.3em] text-gold sm:inline">
              Dijital Dergi
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={mainSiteUrl}
              className="whitespace-nowrap border border-accent-foreground/25 px-3 py-2 text-xs font-medium tracking-wide text-accent-foreground/80 transition-colors hover:border-gold hover:text-gold sm:text-sm"
            >
              Kulüp Sitesi
            </a>
            <Link
              href="/giris"
              className="whitespace-nowrap bg-gold-bright px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-accent-foreground sm:text-sm"
            >
              Oturum Aç
            </Link>
          </div>
        </div>

        <nav aria-label="Dergi menüsü">
          <ul className="flex items-center gap-6 overflow-x-auto border-t border-accent-foreground/10 pt-3 text-sm text-accent-foreground/70 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="whitespace-nowrap transition-colors hover:text-gold"
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
