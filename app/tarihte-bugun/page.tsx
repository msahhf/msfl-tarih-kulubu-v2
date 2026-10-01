import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { tarihteBugunRepository } from "@/lib/db/repositories";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tarihte Bugün",
  description: "MSFL Tarih Kulübü arşivinden bugünün tarihinde yaşanmış önemli olaylar.",
};

export default async function TarihteBugunPage() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateKey = `${month}-${day}`;

  const formattedDate = now.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  let entry = null;
  try {
    entry = await tarihteBugunRepository.findByDateKey(dateKey);
  } catch (error) {
    console.error("Failed to fetch Tarihte Bugün entry:", error);
  }

  return (
    <div>
      <PageHero
        eyebrow="Arşiv"
        title="Tarihte Bugün"
        description="Bugün geçmişte neler yaşandı, bir bak."
        image="/img/bg/tarihte-bugun.webp"
      />

      <Container className="py-16">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* Tarih plakası */}
          <div className="flex items-center gap-4 border-b-2 border-foreground/80 pb-6">
            <div className="bg-accent text-accent-foreground font-display font-bold rounded-sm px-5 py-3 text-lg leading-none">
              {formattedDate}
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Tarihte Bu Gün Yaşananlar
            </span>
          </div>

          {!entry || !entry.events || entry.events.length === 0 ? (
            <div className="paper-panel p-10 text-center space-y-3">
              <p className="font-display text-lg font-medium text-foreground">
                Bu tarih için henüz arşiv içeriği oluşturulmadı.
              </p>
              <p className="text-sm text-muted-foreground">
                Günlük arşiv içerikleri otomatik olarak güncellenmektedir. Lütfen
                daha sonra tekrar ziyaret edin.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {entry.events.map((item, index) => (
                <article
                  key={index}
                  className="bg-surface p-6 sm:p-8 rounded-md border border-border border-l-4 border-l-accent flex flex-col gap-4 sm:flex-row sm:gap-8"
                >
                  <span className="font-display text-3xl font-bold text-accent sm:min-w-[110px]">
                    {item.year}
                  </span>
                  <div className="space-y-2">
                    <h2 className="font-display text-xl font-bold text-foreground">
                      {item.title}
                    </h2>
                    <p className="text-foreground/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
