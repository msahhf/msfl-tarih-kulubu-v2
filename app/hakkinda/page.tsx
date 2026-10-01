import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

const TEAM = [
  {
    role: "Başkan",
    people: ["İzzet Furkan Sucuoğlu"],
  },
  {
    role: "Başkan Yardımcısı",
    people: ["Ahmet Kıvanç Eryaşar"],
  },
  {
    role: "Sosyal Medya – Web",
    people: ["Muhammedşah Fidan", "Ömer Taha Mildan"],
  },
  {
    role: "Danışman Öğretmenler",
    people: ["Ruhi Sarıkaya", "Ramazan Mürşit Sarıoğlu"],
  },
  {
    role: "Üye Temsilcileri",
    people: ["Yiğit Usta", "Zeyneddin Emir Tabak"],
  },
  {
    role: "Sayman – Sekreter",
    people: ["Buse Yaren Doğan"],
  },
];

export const metadata = {
  title: "Hakkında",
  description: "MSFL Tarih Kulübü vizyonu, misyonu ve yönetim ekibi.",
};

export default function HakkindaPage() {
  return (
    <div>
      <PageHero
        eyebrow="Hakkımızda"
        title="MSFL Tarih Kulübü"
        description="Tarihi yalnızca geçmişin birikimi değil, geleceği şekillendiren bir rehber olarak görüyoruz."
        image="/img/bg/hakkinda.webp"
      />

      <Container className="py-16">
        <div className="mx-auto max-w-4xl space-y-14">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-surface p-8 rounded-md border border-border border-t-2 border-t-accent space-y-4 shadow-sm">
              <h2 className="text-2xl font-display font-bold text-accent">Vizyonumuz</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mustafa Saffet Fen Lisesi Tarih Kulübü olarak, tarihi yalnızca
                geçmişin birikimi değil, geleceği şekillendiren bir rehber olarak
                görüyoruz. Öğrencilerimizin tarih bilinciyle düşünen, sorgulayan ve
                kültürel mirasına sahip çıkan bireyler olmalarını hedefliyoruz.
              </p>
            </div>

            <div className="bg-surface p-8 rounded-md border border-border border-t-2 border-t-gold space-y-4 shadow-sm">
              <h2 className="text-2xl font-display font-bold text-accent">Misyonumuz</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tarihsel olayları araştırmak, anlamak ve bu bilgileri paylaşarak
                tarih sevgisini yaymak için çalışıyoruz. Atatürk&apos;ün
                &quot;Tarih yazmak, tarih yapmak kadar mühimdir.&quot; sözüyle yol
                alıyor, geçmişi bugüne taşıyoruz.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Yönetim ekibi */}
      <section className="bg-surface border-y border-border py-16">
        <Container>
          <div className="mx-auto max-w-4xl space-y-10">
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Ekibimiz
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight">
                Yönetim Ekibimiz
              </h2>
              <div aria-hidden="true" className="rule-double mx-auto w-24" />
              <p className="text-muted-foreground text-sm">
                2025 - 2026 Eğitim Öğretim Yılı Kulüp Yönetimi
              </p>
            </div>

            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {TEAM.map((item) => (
                <div
                  key={item.role}
                  className="bg-background p-6 rounded-md border border-border border-l-2 border-l-gold space-y-2"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {item.role}
                  </dt>
                  <dd className="text-lg font-medium text-foreground leading-snug">
                    {item.people.map((p) => (
                      <span key={p} className="block">
                        {p}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>
    </div>
  );
}
