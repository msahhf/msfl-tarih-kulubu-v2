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
    <div>
      <PageHero
        eyebrow={`Dijital Yayın · Sayı ${issue.issueNumber}`}
        title={issue.title}
        description={`${issue.period} · ${issue.description}`}
        image="/img/bg/arsiv.webp"
      />

      <Container className="py-12 sm:py-16">
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
    </div>
  );
}
