import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata = {
  title: "Etkinlikler",
  description: "MSFL Tarih Kulübü 2025 - 2026 eğitim öğretim yılı etkinlik planı.",
};

const eventsPlan = [
  { month: "2025 - Eylül", description: "Kulüp vizyonu, görevler, dönem hedeflerinin belirlenmesi" },
  { month: "2025 - Ekim", description: "Sene boyu devam edecek sosyal medya paylaşımlarının başlatılması" },
  { month: "2025 - Kasım", description: "Tarih Kulübü için dinamik bir web site hazırlanması ve yayınlanması" },
  { month: "2025 - Aralık", description: "Tarih ve genel kültür kapsamında okul genelinde bilgi yarışması hazırlanması. Aktif kulüp üyeleriyle gezi etkinliği" },
  { month: "2026 - Ocak", description: "Tarih ve genel kültür kapsamında hazırlıklı münazara yarışması. Fen Lisesi Öğrencileri için Arkeogenetik: DNA ile Tarihi Yeniden Yazmak (Seminer)" },
  { month: "2026 - Şubat", description: "Yapay zeka aracılığıyla “İpek Yolu” simülasyonu. Tarih kulübü dergisini tamamlamak ve basım faaliyetleri" },
  { month: "2026 - Mart", description: "Çanakkale Şehitlik gezisi. Gaziler Derneği ile röportaj çalışması. İstiklal Marşı’nın kabulü ile ilgili belgesel ve filmlerin okul öğrencilerine sunulması" },
  { month: "2026 - Nisan", description: "Tarih dergisini fiziki ve dijital mecralarda yayma çalışması. Tarihte kadın bilim insanları portre sergisi" },
  { month: "2026 - Mayıs", description: "Okul Çapında Tarih Günü Sergisi ve Mini Konferanslar. “Yıl boyunca ne yaptık?” adlı sunum ve video çalışması" },
  { month: "2026 - Haziran", description: "Dönem değerlendirmesi ve gelecek yıl hazırlık planlaması" },
];

export default function EtkinliklerPage() {
  return (
    <div>
      <PageHero
        eyebrow="Etkinlikler"
        title="2025 - 2026 Yıllık Planımız"
        description="MSFL Tarih Kulübü'nün akademik yıl boyunca gerçekleştireceği etkinlik ve projeler takvimi."
        image="/img/bg/plan.webp"
      />

      <Container className="py-16">
        <ol className="mx-auto max-w-3xl">
          {eventsPlan.map((item, index) => (
            <li key={item.month} className="relative flex gap-6 pb-10 last:pb-0">
              {/* Zaman çizgisi */}
              <div className="relative flex flex-col items-center" aria-hidden="true">
                <span className="flex h-4 w-4 shrink-0 rounded-full border-2 border-accent bg-surface" />
                {index < eventsPlan.length - 1 && (
                  <span className="w-px flex-1 bg-border-strong" />
                )}
              </div>

              <div className="paper-panel -mt-1 flex-1 p-5 space-y-1">
                <p className="font-display text-lg font-bold text-accent">
                  {item.month}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  );
}
