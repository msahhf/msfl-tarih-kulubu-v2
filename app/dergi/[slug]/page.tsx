import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
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
    <Container className="py-10 sm:py-14">
      <header className="border-b border-border pb-8">
        <Link
          href="/dergi"
          className="text-xs font-semibold uppercase tracking-[0.22em] text-gold transition-colors hover:text-accent"
        >
          ← Tüm sayılar
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          {issue.title}
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Sayı {issue.issueNumber} · {issue.period}
        </p>
        <p className="mt-4 max-w-2xl text-[1.025rem] leading-relaxed text-muted-foreground">
          {issue.description}
        </p>
      </header>

      <div className="mt-10">
        <MagazineReader issue={issue} />
      </div>
    </Container>
  );
}
