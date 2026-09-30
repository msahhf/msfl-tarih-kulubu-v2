import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function YardimDestekPage() {
  return (
    <div className="space-y-16 py-16">
      <Container>
        <div className="max-w-3xl mx-auto space-y-12 bg-surface p-8 sm:p-12 rounded-xl border border-border">
          <SectionHeader
            title="Yardım & Destek"
            description="MSFL Tarih Kulübü web platformu yardım, destek ve iletişim merkezi."
          />

          <div className="space-y-6 text-muted-foreground text-sm sm:text-base leading-relaxed">
            <div className="p-6 bg-background rounded-lg border border-border space-y-3">
              <h3 className="font-display font-bold text-foreground text-lg">Bize Ulaşın</h3>
              <p>
                Kulübümüz faaliyetleri, web sitemiz veya içeriklerimiz hakkında soru, öneri ve destek talepleriniz için doğrudan bize e-posta gönderebilirsiniz:
              </p>
              <p>
                <a href="mailto:msfltarihkulubu@outlook.com" className="text-accent hover:underline font-medium">
                  msfltarihkulubu@outlook.com
                </a>
              </p>
            </div>

            <div className="p-6 bg-background rounded-lg border border-border space-y-3">
              <h3 className="font-display font-bold text-foreground text-lg">Okul ve Kulüp İletişim Bilgileri</h3>
              <p><strong>Kurum:</strong> Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi</p>
              <p><strong>Adres:</strong> Çamlık Mahallesi, 34912 Pendik/İstanbul</p>
              <p><strong>Danışman Öğretmenler:</strong> Sn. Ruhi Sarıkaya & Sn. Ramazan Mürşit Sarıoğlu</p>
            </div>

            <div className="pt-4">
              <Link href="/" className="text-sm font-semibold text-accent hover:underline">
                ← Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
