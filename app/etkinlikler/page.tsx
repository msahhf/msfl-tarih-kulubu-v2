import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

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
    <div className="space-y-16 py-16">
      <Container>
        <div className="max-w-4xl mx-auto space-y-12">
          <SectionHeader
            title="2025 - 2026 Yıllık Planımız"
            description="MSFL Tarih Kulübü'nün akademik yıl boyunca gerçekleştireceği etkinlik ve projeler takvimi."
            className="text-center"
          />

          <div className="space-y-6">
            {eventsPlan.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-surface rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="font-display font-bold text-accent min-w-[160px]">
                  {item.month}
                </div>
                <div className="text-muted-foreground text-sm sm:text-base flex-1">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
