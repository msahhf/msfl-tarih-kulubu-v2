import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MagazineEmptyState } from "@/components/magazine/MagazineEmptyState";
import { MagazineReader } from "@/components/magazine/MagazineReader";
import { getCurrentMagazineIssue, magazineIssues } from "@/content/magazine";

export const metadata: Metadata = {
  title: "Dergi",
  description:
    "Tarih Kulübü dergisinin dijital sayıları: sayfa çevirme, yakınlaştırma, tam ekran ve sayfa küçük resimleriyle tarayıcıda okuyun.",
};

export default function DergiPage() {
  const currentIssue = getCurrentMagazineIssue();
  const archive = magazineIssues.slice(1);

  return (
    <Container className="py-10 sm:py-14">
      {currentIssue ? (
        <div className="space-y-12">
          <header className="border-b border-border pb-8">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-gold">
              Dijital Yayın · {currentIssue.period}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              {currentIssue.title}
            </h1>
            <p className="mt-4 max-w-2xl text-[1.025rem] leading-relaxed text-muted-foreground">
              {currentIssue.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span>Sayı {currentIssue.issueNumber}</span>
              <span className="hidden sm:inline">·</span>
              <span>{currentIssue.period}</span>
              <span className="hidden sm:inline">·</span>
              <span>{magazineIssues.length} sayı arşivde</span>
            </div>
          </header>

          <MagazineReader issue={currentIssue} />

          {archive.length > 0 && (
            <section aria-labelledby="dergi-arsivi" className="space-y-5 pt-4">
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

          <p className="max-w-3xl border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
            Dergi görüntüleyici yalnızca görünen sayfaları hazırlar; büyük
            dosyalarda bile tüm sayfalar aynı anda yüklenmez. Klavye ile
            ilerlemek için ok tuşlarını, yakınlaştırmak için{" "}
            <kbd className="border border-border-strong bg-surface px-1.5 py-0.5 text-xs">
              +
            </kbd>{" "}
            ve{" "}
            <kbd className="border border-border-strong bg-surface px-1.5 py-0.5 text-xs">
              −
            </kbd>{" "}
            tuşlarını kullanabilirsiniz.
          </p>
        </div>
      ) : (
        <MagazineEmptyState />
      )}
    </Container>
  );
}
