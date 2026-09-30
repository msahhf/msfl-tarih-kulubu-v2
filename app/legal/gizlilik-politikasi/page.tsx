import { Container } from "@/components/ui/Container";

export default function GizlilikPolitikasiPage() {
  return (
    <Container className="py-16">
      <div className="max-w-3xl mx-auto space-y-8 bg-surface p-8 sm:p-12 rounded-xl border border-border">
        <header className="space-y-4 border-b border-border pb-6">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent font-semibold text-xs rounded-full">
            Resmî Metin
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold">Gizlilik Politikası</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi Tarih Kulübü Web Platformu Gizlilik Politikası
          </p>
          <p className="text-xs text-muted-foreground">
            Yürürlük Tarihi: <strong>2025</strong> · Son Güncelleme: <strong>2025</strong>
          </p>
        </header>

        <article className="space-y-6 text-muted-foreground text-sm sm:text-base leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">1. Genel İlkeler</h2>
            <p>
              Bu Gizlilik Politikası; Platformu kullanan ziyaretçilerin ve üyelerin kişisel verilerinin, gizliliğinin ve güvenliğinin nasıl korunduğunu açıklamaktadır.
            </p>
            <p>
              Platform; sosyal amaçlı bir öğrenci kulübü faaliyetidir ve tüm süreçler okul yönetimi ile yalnızca reşit olan <strong>Danışman Öğretmenler</strong> gözetiminde yürütülür.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">2. Toplanan Veri Kategorileri</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, kullanıcı adı.</li>
              <li><strong>İletişim:</strong> E-posta adresi.</li>
              <li><strong>Profil:</strong> Biyografi, profil fotoğrafı, kapak fotoğrafı.</li>
              <li><strong>İçerik:</strong> Blog yazıları, yorumlar, zaman bilgileri.</li>
              <li><strong>Sosyal Medya:</strong> Gönüllü paylaşılan bağlantılar.</li>
              <li><strong>İşlem Güvenliği:</strong> IP adresi, oturum ve log kayıtları.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">3. Özel Nitelikli Veriler</h2>
            <p>
              Platform; KVKK m.6 kapsamındaki özel nitelikli kişisel verileri toplamayı amaçlamaz. Bu verilerin paylaşılması önerilmez; tespit edilirse içerik kaldırılır.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">4. İşleme Amaçları</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Üyelik ve hesap yönetimi,</li>
              <li>Platform güvenliği,</li>
              <li>Kulüp içi iletişimin güçlendirilmesi,</li>
              <li>Öğrenci çalışmalarının sergilenmesi,</li>
              <li>Teknik sorunların tespiti ve çözümü,</li>
              <li>Okul yönetimince gerekli görülen raporlamalar.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">5. Veri Aktarımı</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Okul yönetimi ve idari birimler,</li>
              <li>Reşit danışman öğretmenler,</li>
              <li>Yetkili kamu kurumları,</li>
              <li>Platform barındırma ve medya/e-posta hizmetleri sağlayıcıları.</li>
            </ul>
            <p>
              Yurt dışı aktarım gerekmesi hâlinde KVKK m.9’a uygun teknik/idari tedbirler uygulanır.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">6. Çerezler</h2>
            <p>
              Platform; zorunlu teknik çerezleri kullanır. İstatistik ve kişiselleştirme çerezleri yalnızca açık rıza ile çalıştırılır.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">7. Veri Güvenliği Tedbirleri</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Şifrelerin hash’lenmesi,</li>
              <li>Erişim yetkilerinin sınırlandırılması,</li>
              <li>Oturum sürelerinin sınırlandırılması,</li>
              <li>Güvenlik loglarının tutulması,</li>
              <li>Güncel güvenlik yamalarının uygulanması.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">8. Veri Saklama Süreleri</h2>
            <p>
              Veriler; mevzuatta öngörülen veya işleme amacı için gerekli süre boyunca saklanır. Hesap silindiğinde veriler teknik ve yasal gereklilikler sebebiyle belirli bir süre <strong>sistem yedeklerinde tutulabilir</strong>; süresi dolunca silinir, yok edilir veya anonimleştirilir.
            </p>
            <p>
              Kullanıcı, dilediği zaman <strong>msfltarihkulubu@outlook.com</strong> adresine başvurarak verilerinin tamamen silinmesini talep edebilir.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">9. KVKK Hakları</h2>
            <p>Kullanıcılar KVKK m.11 kapsamındaki tüm haklara sahiptir.</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">10. Değişiklikler</h2>
            <p>
              Politika güncellenebilir. Güncel metin Platformda yayımlandığı anda yürürlüğe girer.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">11. İletişim</h2>
            <p>
              Tüm talepler için: <strong>msfltarihkulubu@outlook.com</strong>
            </p>
          </div>
        </article>
      </div>
    </Container>
  );
}
