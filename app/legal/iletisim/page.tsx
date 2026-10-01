import { LegalDocument } from "@/components/legal/LegalDocument";
import { MailLink } from "@/components/legal/MailLink";

export const metadata = {
  title: "İletişim",
  description: "MSFL Tarih Kulübü iletişim bilgileri.",
};

export default function IletisimPage() {
  return (
    <LegalDocument
      title="İletişim"
      subtitle="Tarih Kulübü ile iletişime geçmek istersen aşağıdaki bilgilerden bize ulaşabilirsin."
      effectiveDate="2026"
      lastUpdated="Ekim 2026"
    >
      <div className="space-y-6 not-prose">
        <div className="p-6 bg-background border-l-2 border-accent rounded-sm space-y-2">
          <h2 className="font-display font-bold text-foreground text-lg">Kulüp E-postası</h2>
          <p>
            Soru, öneri ve destek talepleriniz için: <MailLink />
          </p>
        </div>

        <div className="p-6 bg-background border-l-2 border-gold rounded-sm space-y-2">
          <h2 className="font-display font-bold text-foreground text-lg">Okul</h2>
          <p>Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi</p>
          <p>Çamlık Mahallesi, 34912 Pendik / İstanbul</p>
        </div>

        <div className="p-6 bg-background border-l-2 border-gold rounded-sm space-y-3">
          <h2 className="font-display font-bold text-foreground text-lg">Danışman Öğretmenler</h2>
          <p>Ruhi Sarıkaya — Tarih Öğretmeni &amp; Kulüp Danışmanı</p>
          <p>Ramazan Mürşit Sarıoğlu — Tarih Öğretmeni &amp; Kulüp Danışmanı</p>
        </div>

        <div className="p-6 bg-background border-l-2 border-gold rounded-sm space-y-3">
          <h2 className="font-display font-bold text-foreground text-lg">
            Tarih Kulübü &amp; Site Yönetimi
          </h2>
          <p>İzzet Furkan Sucuoğlu — Tarih Kulübü Başkanı</p>
          <p>Muhammedşah Fidan — Web Yönetimi &amp; Teknik Sorumlu</p>
        </div>
      </div>
    </LegalDocument>
  );
}
