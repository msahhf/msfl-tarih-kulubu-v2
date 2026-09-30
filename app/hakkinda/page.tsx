import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function HakkindaPage() {
  return (
    <div className="space-y-20 py-16">
      {/* Vision & Mission */}
      <Container>
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-4 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Hakkımızda
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight">
              MSFL Tarih Kulübü
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="p-8 bg-surface rounded-xl border border-border space-y-4 shadow-sm">
              <h2 className="text-2xl font-display font-bold text-accent">Vizyonumuz</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mustafa Saffet Fen Lisesi Tarih Kulübü olarak, tarihi yalnızca geçmişin birikimi değil, geleceği şekillendiren bir rehber olarak görüyoruz. Öğrencilerimizin tarih bilinciyle düşünen, sorgulayan ve kültürel mirasına sahip çıkan bireyler olmalarını hedefliyoruz.
              </p>
            </div>

            <div className="p-8 bg-surface rounded-xl border border-border space-y-4 shadow-sm">
              <h2 className="text-2xl font-display font-bold text-accent">Misyonumuz</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tarihsel olayları araştırmak, anlamak ve bu bilgileri paylaşarak tarih sevgisini yaymak için çalışıyoruz. Atatürk&apos;ün &quot;Tarih yazmak, tarih yapmak kadar mühimdir.&quot; sözüyle yol alıyor, geçmişi bugüne taşıyoruz.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Management Team */}
      <section className="bg-surface border-y border-border py-16">
        <Container>
          <div className="max-w-4xl mx-auto space-y-12">
            <SectionHeader
              title="Yönetim Ekibimiz"
              description="2025 - 2026 Eğitim Öğretim Yılı Kulüp Yönetimi"
              className="text-center"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-6 bg-background rounded-xl border border-border space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Başkan</h3>
                  <p className="text-lg font-medium text-foreground mt-1">İzzet Furkan Sucuoğlu</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Başkan Yardımcısı</h3>
                  <p className="text-lg font-medium text-foreground mt-1">Ahmet Kıvanç Eryaşar</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sosyal Medya – Web</h3>
                  <p className="text-lg font-medium text-foreground mt-1">Muhammedşah Fidan<br />Ömer Taha Mildan</p>
                </div>
              </div>

              <div className="p-6 bg-background rounded-xl border border-border space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Danışman Öğretmenler</h3>
                  <p className="text-lg font-medium text-foreground mt-1">Ruhi Sarıkaya<br />Ramazan Mürşit Sarıoğlu</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Üye Temsilcileri</h3>
                  <p className="text-lg font-medium text-foreground mt-1">Yiğit Usta<br />Zeyneddin Emir Tabak</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sayman – Sekreter</h3>
                  <p className="text-lg font-medium text-foreground mt-1">Buse Yaren Doğan</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
