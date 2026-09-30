import { Container } from "@/components/ui/Container";

export default function IletisimPage() {
  return (
    <Container className="py-16">
      <div className="max-w-3xl mx-auto space-y-8 bg-surface p-8 sm:p-12 rounded-xl border border-border">
        <header className="space-y-4 border-b border-border pb-6">
          <h1 className="text-3xl sm:text-4xl font-display font-bold">İletişim</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Tarih Kulübü ile iletişime geçmek istersen aşağıdaki bilgilerden bize ulaşabilirsin.
          </p>
        </header>

        <div className="space-y-6 text-muted-foreground text-sm sm:text-base leading-relaxed">
          {/* KULÜP E-POSTA */}
          <div className="p-6 bg-background rounded-lg border border-border space-y-2">
            <h3 className="font-display font-bold text-foreground text-lg">Kulüp E-posta</h3>
            <p>
              <a href="mailto:msfltarihkulubu@outlook.com" className="text-accent hover:underline font-medium">
                msfltarihkulubu@outlook.com
              </a>
            </p>
          </div>

          {/* OKUL BİLGİLERİ */}
          <div className="p-6 bg-background rounded-lg border border-border space-y-2">
            <h3 className="font-display font-bold text-foreground text-lg">Okul Adı</h3>
            <p>Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi</p>
          </div>

          <div className="p-6 bg-background rounded-lg border border-border space-y-2">
            <h3 className="font-display font-bold text-foreground text-lg">Adres</h3>
            <p>Çamlık Mahallesi, 34912 Pendik/İstanbul Pendik / İstanbul</p>
          </div>

          {/* OKUL YÖNETİMİ */}
          <div className="p-6 bg-background rounded-lg border border-border space-y-3">
            <h3 className="font-display font-bold text-foreground text-lg">Resmî Okul Yönetimi</h3>
            <p><b>Sn. Ruhi Sarıkaya</b> — Tarih Öğretmeni & Kulüp Danışmanı</p>
            <p><b>Sn. Ramazan Mürşit Sarıoğlu</b> — Tarih Öğretmeni & Kulüp Danışmanı</p>
          </div>

          {/* KULÜP + SİTE YÖNETİMİ */}
          <div className="p-6 bg-background rounded-lg border border-border space-y-3">
            <h3 className="font-display font-bold text-foreground text-lg">Tarih Kulübü & Site Yönetimi</h3>
            <p><b>İzzet Furkan Sucuoğlu</b> — Tarih Kulübü Başkanı</p>
            <p><b>Muhammedşah Fidan</b> — Web Yönetimi & Teknik Sorumlu</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
