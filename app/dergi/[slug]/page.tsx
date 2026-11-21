import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { MagazineReader } from "@/components/magazine/MagazineReader";
import { magazineIssues } from "@/content/magazine";

type MagazineIssuePageProps = {
  params: Promise<{ slug: string }>;
};

function findIssue(slug: string) {
  return magazineIssues.find((issue) => issue.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: MagazineIssuePageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = findIssue(slug);
  if (!issue) return { title: "Sayı Bulunamadı" };

  return {
    title: `${issue.title} · Sayı ${issue.issueNumber}`,
    description: issue.description,
    alternates: { canonical: `/dergi/${issue.slug}` },
  };
}

export default async function MagazineIssuePage({
  params,
}: MagazineIssuePageProps) {
  const { slug } = await params;
  const issue = findIssue(slug);

  if (!issue) notFound();

  return (
    <div className="bg-surface/50 min-h-screen flex flex-col">
      {/* Redesigned header for individual issue pages */}
      <header className="border-b border-border/60 bg-black/80/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/dergi"
              className="font-display text-lg font-bold text-foreground transition-colors hover:text-gold"
            >
              ← Dergiye Dön
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="line-through opacity-50">
                {issue.title}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Container className="py-12 sm:py-16">
          <PageHero
            eyebrow={`Dijital Yayın · Sayı ${issue.issueNumber}`}
            title={issue.title}
            description={`${issue.period} · ${issue.description}`}
            image="/img/bg/arsiv.webp"
          />

          <div className="mb-8">
            <Link
              href="/dergi"
              className="text-sm font-semibold text-accent underline underline-offset-4 decoration-gold/50 transition-colors hover:decoration-accent"
            >
              ← Dergi sayfasına dön
            </Link>
          </div>

          <MagazineReader issue={issue} />
        </Container>
      </main>

      <footer className="mt-auto border-t border-border/60 py-6 text-xs text-muted-foreground text-center">
        © 2026 MSFL Tarih Kulübü — Tüm Haklı Saklıdır.
      </footer>
    </div>
  );
}