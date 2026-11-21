import Link from "next/link";

/**
 * Bağımsız dergi yayınının alt bilgisi. Yalnızca `NEXT_PUBLIC_MAGAZINE_SITE=1`
 * olan derlemede kullanılır.
 */
export function MagazineFooter({ mainSiteUrl }: { mainSiteUrl: string }) {
  return (
    <footer className="border-t border-gold/25 bg-ink text-accent-foreground/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-1">
          <p className="font-display text-lg font-bold text-accent-foreground">
            Tarih-i Kadim
          </p>
          <p className="text-xs leading-relaxed">
            MSFL Tarih Kulübü dijital dergisi · Mustafa Saffet Fen Lisesi
          </p>
        </div>

        <nav aria-label="Dergi alt menüsü" className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <Link href="/dergi" className="transition-colors hover:text-gold">
            Güncel Sayı
          </Link>
          <Link href="/dergi#dergi-arsivi" className="transition-colors hover:text-gold">
            Arşiv
          </Link>
          <a href={mainSiteUrl} className="transition-colors hover:text-gold">
            Kulüp Sitesi
          </a>
          <Link href="/yardim-destek" className="transition-colors hover:text-gold">
            İletişim
          </Link>
        </nav>
      </div>

      <div className="border-t border-accent-foreground/10 py-4 text-center text-[0.68rem] uppercase tracking-[0.2em] text-accent-foreground/40">
        © 2026 MSFL Tarih Kulübü
      </div>
    </footer>
  );
}
