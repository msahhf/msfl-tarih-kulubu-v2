import { Container } from "@/components/ui/Container";

export default function KullanimSartlariPage() {
  return (
    <Container className="py-16">
      <div className="max-w-3xl mx-auto space-y-8 bg-surface p-8 sm:p-12 rounded-xl border border-border">
        <header className="space-y-4 border-b border-border pb-6">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent font-semibold text-xs rounded-full">
            Resmî Metin
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold">Kullanım Şartları</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi Tarih Kulübü Web Platformu Kullanım Şartları
          </p>
          <p className="text-xs text-muted-foreground">
            Yürürlük Tarihi: <strong>2025</strong> · Son Güncelleme: <strong>2025</strong>
          </p>
        </header>

        <article className="space-y-6 text-muted-foreground text-sm sm:text-base leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">1. Amaç ve Kapsam</h2>
            <p>
              Platform; tamamen <strong>kulüp içi sosyal etkileşimi artırmak</strong>, öğrenci çalışmalarını ve tarih içeriklerini paylaşılabilir hâle getirmek amacıyla kurulmuş sosyal amaçlı bir öğrenci kulübü sitesidir. Ticari bir hizmet değildir.
            </p>
            <p>
              Platform tüm süreçlerini okul yönetimi ve yalnızca reşit olan <strong>Danışman Öğretmenler</strong> gözetiminde yürütür.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">2. Platformun Kullanım Alanı</h2>
            <p>Platform şu amaçlarla kullanılır:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Kulüp duyurularının paylaşılması,</li>
              <li>Blog içeriklerinin ve öğrenci çalışmalarının yayınlanması,</li>
              <li>Kulüp etkinliklerinin duyurulması,</li>
              <li>Kulüp içi iletişimin güçlendirilmesi.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-foreground">3. Üyelik Şartları</h2>
            <p>Üyelik; okul öğrencileri, mezunlar ve okulun uygun gördüğü kişilerle sınırlıdır.</p>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">3.1 Bilgilerin Doğruluğu</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Üyelik sırasında verilen bilgilerin doğru ve güncel olması zorunludur.</li>
                <li>Başka kişi adına hesap açılması yasaktır.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">3.2 Hesap Güvenliği</h3>
              <p>
                Hesap şifresi Kullanıcının sorumluluğundadır. Yetkisiz erişimlerden doğabilecek zararlardan Kulüp sorumlu değildir.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">3.3 Askıya Alma</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Uygunsuz içerik paylaşımı,</li>
                <li>Hakaret, nefret söylemi, zorbalık,</li>
                <li>Ticari reklam ve spam,</li>
                <li>Okul/kulüp itibarına zarar verici davranış,</li>
                <li>Yetkisiz erişim girişimleri</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">3.4 Hesap Silme ve Veri Saklama</h3>
              <p>
                Hesap silme işlemi sonrasında veriler; teknik gereklilikler ve mevzuat yükümlülükleri sebebiyle belirli süre boyunca <strong>sistem yedeklerinde tutulabilir</strong>. Saklama süresi sonunda veriler silinir, yok edilir veya anonim hale getirilir.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">4. Yasaklı İçerikler</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ayrımcı ifadeler, hakaret, tehdit, zorbalık,</li>
              <li>Müstehcen veya okul ortamına aykırı içerik,</li>
              <li>Telif hakkı ihlalleri,</li>
              <li>Yanlış veya yanıltıcı bilgi,</li>
              <li>Reklam amacı taşıyan paylaşımlar.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">5. Özel Nitelikli Veriler</h2>
            <p>
              Platform; sağlık verisi, biyometrik veri, dini/siyasi görüş gibi özel nitelikli verileri işlemeyi amaçlamaz. Bu tür bilgilerin paylaşımı yasaktır ve kaldırılabilir.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">6. Telif Hakları</h2>
            <p>
              Platformdaki metin, görsel ve tasarımlar FSEK kapsamında korunur. Kullanıcı; yüklediği içeriklerin Kulüp tarafından yalnızca kulüp faaliyetleri çerçevesinde kullanılmasına izin verir.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">7. Sorumluluğun Sınırlandırılması</h2>
            <p>
              Kulüp; makul teknik tedbirler almasına rağmen internet altyapısından doğan kesinti, gecikme veya veri kaybından sorumlu tutulamaz.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">8. Değişiklik Hakkı</h2>
            <p>
              Kulüp, Şartları güncelleyebilir. Güncel metin Platformda yayımlandığı tarihte yürürlüğe girer.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">9. İletişim</h2>
            <p>
              Tüm sorularınız için: <strong>msfltarihkulubu@outlook.com</strong>
            </p>
          </div>
        </article>
      </div>
    </Container>
  );
}
