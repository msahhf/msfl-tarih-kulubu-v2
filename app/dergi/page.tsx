import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { MagazineEmptyState } from "@/components/magazine/MagazineEmptyState";
import { MagazineReader } from "@/components/magazine/MagazineReader";
import { getCurrentMagazineIssue, magazineIssues } from "@/content/magazine";

export const metadata: Metadata = {
  title: "Dergi – MSFL Tarih Kulübü",
  description:
    "Tarih Kulübü dergisinin dijital sayıları: sayfa çevirme, yakınlaştırma, tam ekran ve sayfa küçük resimleriyle tarayıcıda okuyun. Yeni tasarımla dergi arşivine erişim.",
};

export default function DergiPage() {
  const currentIssue = getCurrentMagazineIssue();
  const archive = magazineIssues.slice(1);

  return (
    <div className="bg-surface/50 min-h-screen flex flex-col">
      {/* Redesigned hero section with different navbar */}
      <header className="border-b border-border/60 bg-black/80/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="font-display text-lg font-bold text-foreground transition-colors hover:text-gold"
            >
              MSFL Tarih Kulübü
            </Link>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                href="/blog"
                className={("hover:text-accent transition-colors")}
              >
                Blog
              </Link>
              <Link
                href="/dergi"
                className="font-medium text-gold underline underline-offset-2 decoration-gold/50 transition-colors hover:decoration-accent"
              >
                Dergi
              </Link>
              <Link
                href="/etkinlikler"
                className={("hover:text-accent transition-colors")}
              >
                Etkinlikler
              </Link>
              <Link
                href="/tarihte-bugun"
                className={("hover:text-accent transition-colors")}
              >
                Tarihte Bugün
              </Link>
              <Link
                href="/hakkinda"
                className={("hover:text-accent transition-colors")}
              >
                Hakkında
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/giris"
                className="whitespace-nowrap text-sm font-medium px-3 py-2 border border-accent-foreground/40 rounded-sm hover:border-accent-foreground hover:bg-accent-foreground/10 transition-colors"
              >
                Giriş
              </Link>
              <Link
                href="/kayit"
                className="whitespace-nowrap text-sm font-semibold px-3 py-2 bg-gold-bright text-ink border border-gold-bright rounded-sm hover:bg-transparent hover:text-gold transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Container className="py-12 sm:py-16">
          {currentIssue ? (
            <div className="space-y-12">
              <div className="max-w-3xl space-y-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-gold">
                  Güncel Sayı · {currentIssue.period}
                </p>
                <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
                  {currentIssue.title}
                </h2>
                <p className="text-[0.975rem] leading-relaxed text-muted-foreground">
                  {currentIssue.description}
                </p>
              </div>

              <MagazineReader issue={currentIssue} />

              {archive.length > 0 && (
                <section aria-labelledby="dergi-arsivi" className="space-y-5">
                  <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
                    <h2
                      id="dergi-arsivi"
                      className="font-display text-2xl font-bold text-foreground"
                    >
                      Dergi Arşivi
                    </h2>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {archive.length} sayı
                    </span>
                  </div>

                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {archive.map((issue) => (
                      <li
                        key={issue.slug}
                        className="border border-border border-l-2 border-l-gold bg-surface p-5"
                      >
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-gold">
                          Sayı {issue.issueNumber} · {issue.period}
                        </p>
                        <p className="mt-1 font-display text-lg font-bold text-foreground">
                          {issue.title}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {issue.description}
                        </p>
                        <Link
                          href={`/dergi/${issue.slug}`}
                          className="mt-4 inline-flex text-sm font-semibold text-accent underline underline-offset-4 decoration-gold/50 transition-colors hover:decoration-accent"
                        >
                          Sayıyı aç
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Dergi görüntüleyici yalnızca görünen sayfaları hazırlar; büyük
                dosyalarda bile tüm sayfalar aynı anda yüklenmez. Klavye ile
                ilerlemek için ok tuşlarını, yakınlaştırmak için
                <kbd className="border border-border-strong bg-surface px-1.5 py-0.5 text-xs">
                  +
                </kbd>
                ve
                <kbd className="border border-border-strong bg-surface px-1.5 py-0.5 text-xs">
                  −
                </kbd>
                tuşlarını kullanabilirsiniz.
              </p>
            </div>
          ) : (
            <MagazineEmptyState />
          )}
        </Container>
      </main>

      {/* Footer-like attribution at bottom */}
      <footer className="mt-auto border-t border-border/60 py-6 text-xs text-muted-foreground text-center">
        © 2026 MSFL Tarih Kulübü — Tüm Haklı Saklıdır.
      </footer>
    </div>
  );
}