import { Container } from "@/components/ui/Container";

/**
 * Yasal sayfalar için ortak belge çerçevesi — arşiv belgesi görünümü.
 * Eski sitenin "4px bordo sol çizgili başlık" motifi korunarak
 * yeniden yorumlanmıştır.
 */
export function LegalDocument({
  title,
  subtitle,
  effectiveDate,
  lastUpdated,
  children,
}: {
  title: string;
  subtitle: string;
  effectiveDate: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-surface rounded-md border border-border border-t-2 border-t-accent shadow-sm p-8 sm:p-12 space-y-10">
          <header className="space-y-4 border-b-2 border-foreground/80 pb-6">
            <span className="inline-block px-3 py-1 border border-gold/60 text-gold font-semibold text-[0.65rem] uppercase tracking-[0.22em] rounded-sm">
              Resmî Metin
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
              {title}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {subtitle}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.1em]">
              Yürürlük Tarihi: <strong className="text-foreground">{effectiveDate}</strong>
              {" · "}Son Güncelleme: <strong className="text-foreground">{lastUpdated}</strong>
            </p>
          </header>

          <article className="space-y-8 text-muted-foreground text-sm sm:text-base leading-relaxed">
            {children}
          </article>
        </div>
      </div>
    </Container>
  );
}

/** Bordo sol çizgili bölüm başlığı — eski legal.css referansı. */
export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-display font-bold text-foreground border-l-4 border-accent pl-3 leading-snug">
        {title}
      </h2>
      {children}
    </section>
  );
}
