import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { tarihteBugunRepository } from "@/lib/db/repositories";

export const dynamic = "force-dynamic";

export default async function TarihteBugunPage() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateKey = `${month}-${day}`;

  const formattedDate = now.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
  });

  let entry = null;
  try {
    entry = await tarihteBugunRepository.findByDateKey(dateKey);
  } catch (error) {
    console.error("Failed to fetch Tarihte Bugün entry:", error);
  }

  return (
    <div className="space-y-16 py-16">
      <Container>
        <div className="max-w-4xl mx-auto space-y-12">
          <SectionHeader
            title="Geçmişin Sayfalarında Bugün"
            description="Tarih arşivimizden seçilmiş önemli olaylar ve dönem dönüm noktaları."
            className="text-center"
          />

          <div className="p-8 bg-surface rounded-xl border border-border space-y-8 shadow-sm">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="px-4 py-2 bg-accent text-accent-foreground font-display font-bold rounded-lg text-lg">
                {formattedDate}
              </div>
              <span className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">
                Tarihte Bu Gün Yaşananlar
              </span>
            </div>

            {!entry || !entry.events || entry.events.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground space-y-3">
                <p className="text-lg font-medium">Bu tarih için henüz arşiv içeriği oluşturulmadı.</p>
                <p className="text-sm">Günlük arşiv içerikleri otomatik olarak güncellenmektedir. Lütfen daha sonra tekrar ziyaret edin.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {entry.events.map((item, index) => (
                  <div key={index} className="flex gap-6 items-start pb-6 border-b border-border last:border-b-0 last:pb-0">
                    <span className="font-display font-bold text-2xl text-accent min-w-[80px]">
                      {item.year}
                    </span>
                    <div className="space-y-2 pt-1">
                      <h3 className="font-display font-bold text-xl text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
