import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
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
    <div>
      <PageHero
        eyebrow="Dijital Yayın"
        title="Tarih Kulübü Dergisi"
        description="Kulübümüzün araştırma ve editoryal çalışmalarını bir araya getiren dergi, sayfa çevirme deneyimiyle tarayıcıda okunur."
        image="/img/bg/arsiv.webp"
      />

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
    </div>
  );
}
