import { Container } from "@/components/ui/Container";

export default function AcikRizaMetniPage() {
  return (
    <Container className="py-16">
      <div className="max-w-3xl mx-auto space-y-8 bg-surface p-8 sm:p-12 rounded-xl border border-border">
        <header className="space-y-4 border-b border-border pb-6">
          <span className="inline-block px-3 py-1 bg-accent/10 text-accent font-semibold text-xs rounded-full">
            Resmî Metin
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold">Açık Rıza Metni</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi Tarih Kulübü · Kişisel Verilerin İşlenmesine İlişkin Açık Rıza Metni
          </p>
          <p className="text-xs text-muted-foreground">
            Yürürlük Tarihi: <strong>2025</strong> · Son Güncelleme: <strong>2025</strong>
          </p>
        </header>

        <article className="space-y-6 text-muted-foreground text-sm sm:text-base leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">1. Veri Sorumlusunun Kimliği ve Platformun Niteliği</h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel verileriniz; veri sorumlusu sıfatıyla
              <strong>Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi Tarih Kulübü</strong> (“Kulüp”) tarafından işlenmektedir.
            </p>
            <p>
              Platform; tamamen <strong>kulüp içi sosyal etkileşimi artırmak</strong>, öğrencilerin tarih ve kültür odaklı içeriklerini paylaşabilmesini sağlamak ve Tarih Kulübü faaliyetlerini desteklemek amacıyla oluşturulmuş bir <strong>kulüp blog sitesi</strong>dir. Ticari bir hizmet sunulmaz; tüm süreçler okul yönetimi ve yalnızca reşit olan <strong>Danışman Öğretmenler</strong> gözetiminde yürütülür.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">2. İşlenen Kişisel Veri Kategorileri</h2>
            <p>Platform kapsamında aşağıdaki kişisel veri kategorileri işlenebilmektedir:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Kimlik:</strong> Ad, soyad, kullanıcı adı.</li>
              <li><strong>İletişim:</strong> E-posta adresi.</li>
              <li><strong>Profil:</strong> Biyografi metni, profil fotoğrafı, kapak görselleri.</li>
              <li><strong>İçerik:</strong> Blog yazıları, yorumlar, başlıklar, zaman bilgileri.</li>
              <li><strong>İşlem Güvenliği:</strong> IP adresi, oturum bilgileri, log kayıtları.</li>
              <li><strong>Sosyal Medya:</strong> Kullanıcı tarafından gönüllü eklenen bağlantılar.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">3. İşleme Amaçları ve Hukuki Sebepler</h2>
            <p>Kişisel verileriniz; KVKK’nın 5. ve 6. maddeleri uyarınca aşağıdaki amaçlarla işlenir:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Kulüp içi etkileşimin artırılması,</li>
              <li>Üyelik ve hesap yönetiminin yürütülmesi,</li>
              <li>Blog içeriklerinin güvenli biçimde yayınlanması,</li>
              <li>Platform güvenliği ve kötüye kullanımın önlenmesi,</li>
              <li>Okul yönetimi tarafından gerekli görülen raporlamaların yapılması.</li>
            </ul>
            <p>
              Hukuki sebepler: <strong>açık rıza</strong>, ilgili mevzuat gereklilikleri, hakların tesisi/kullanılması/korunması ve veri sorumlusunun meşru menfaatleridir.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">4. Toplama Yöntemleri</h2>
            <p>
              Kişisel verileriniz; üyelik formu, giriş–çıkış işlemleri, profil düzenleme ekranları, blog/yorum alanları, çerezler ve teknik log kayıtları üzerinden elektronik ortamda otomatik veya kısmen otomatik yollarla toplanmaktadır.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">5. Veri Aktarımı</h2>
            <p>
              Verileriniz, KVKK’nın 8. ve 9. maddeleri uyarınca; veri minimizasyonu ilkesi gözetilerek aşağıdaki kişi ve kurumlarla paylaşılabilir:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Okul yönetimi ve ilgili idari birimler,</li>
              <li>Reşit olan danışman öğretmenler,</li>
              <li>Hukuken yetkili kamu kurum ve kuruluşları,</li>
              <li>Platformun barındırıldığı veya medya/e-posta hizmeti sağlanan yurt içi/yurt dışı hizmet sağlayıcıları.</li>
            </ul>
            <p>
              Yurt dışı aktarım gereken hallerde KVKK m.9 kapsamında gerekli teknik/idari tedbirler uygulanır.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">6. Veri Saklama ve Yedekleme</h2>
            <p>
              Kişisel verileriniz, ilgili mevzuatta öngörülen süreler boyunca veya işleme amaçları için gerekli olduğu süre boyunca saklanır.
            </p>
            <p>
              Hesap silindiğinde; teknik gereklilikler, sistem güvenliği ve yasal yükümlülükler nedeniyle belirli veriler
              <strong>yedekleme sistemlerinde geçici olarak saklanmaya devam edebilir.</strong> Saklama süresi dolduğunda veriler silinir, yok edilir veya anonim hale getirilir.
            </p>
            <p>
              Kullanıcı; dilediği zaman <strong>msfltarihkulubu@outlook.com</strong> adresine başvurarak kişisel verilerinin tamamen silinmesini talep edebilir.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">7. Özel Nitelikli Veriler</h2>
            <p>
              Platform; sağlık verisi, dini inanç, siyasi görüş, biyometrik veri gibi
              <strong>özel nitelikli kişisel verileri</strong> toplamaz ve işlemez. Bu tür verilerin paylaşılması önerilmez; paylaşılması hâlinde içerik kaldırılabilir.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">8. KVKK Kapsamındaki Haklar</h2>
            <p>KVKK m.11 uyarınca kullanıcılar:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Verilerinin işlenip işlenmediğini öğrenme,</li>
              <li>Bilgi talep etme,</li>
              <li>Düzeltme talep etme,</li>
              <li>Silme/yok etme talep etme,</li>
              <li>Aktarım yapılan üçüncü kişileri öğrenme,</li>
              <li>İtiraz etme,</li>
              <li>Zarar hâlinde tazminat talep etme haklarına sahiptir.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">9. Açık Rızanın Beyanı ve Geri Alınması</h2>
            <p>
              Platforma üye olarak bu metin kapsamındaki veri işleme faaliyetlerine <strong>açık rıza verdiğinizi</strong> kabul etmiş olursunuz. Rıza, aynı e-posta adresi üzerinden her zaman geri çekilebilir.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-foreground">10. İletişim</h2>
            <p>
              Tüm talepleriniz için: <strong>msfltarihkulubu@outlook.com</strong>
            </p>
          </div>
        </article>
      </div>
    </Container>
  );
}
