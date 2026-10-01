import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import { MailLink } from "@/components/legal/MailLink";

export const metadata = {
  title: "Gizlilik Politikası",
  description:
    "MSFL Tarih Kulübü web platformunun kişisel verileri işleme esasları (KVKK).",
};

export default function GizlilikPolitikasiPage() {
  return (
    <LegalDocument
      title="Gizlilik Politikası"
      subtitle="Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi Tarih Kulübü Web Platformu Gizlilik Politikası"
      effectiveDate="2026"
      lastUpdated="Ekim 2026"
    >
      <LegalSection title="1. Bu Site ve Veri Sorumlusu">
        <p>
          Bu site, Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi Tarih
          Kulübü&apos;nün (&quot;GHV MSFL Tarih Kulübü&quot;, &quot;Kulüp&quot;)
          kulüp tanıtım ve içerik/blog sitesidir; ticari bir platform değildir.
          Temel amacı; kulüp faaliyetlerini tanıtmak, tarih içeriklerini paylaşmak,
          öğrencilerin içeriklere ulaşmasını sağlamak, blog yazıları paylaşmak ve
          yorum yapılmasını sağlamaktır. Veri sorumlusu:{" "}
          <strong>GHV MSFL Tarih Kulübü</strong>.
        </p>
        <p>
          Bu politika; siteyi kullanırken hangi bilgilerinizin neden tutulduğunu
          ve sitenin hangi teknik servisleri kullandığını açıklar.
        </p>
      </LegalSection>

      <LegalSection title="2. Hangi Bilgiler Tutulur?">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Hesap bilgileri:</strong> Kayıt sırasında ad, soyad, kullanıcı
            adı, e-posta ve şifre istenir. Bu bilgiler hesap oluşturmak ve site
            özelliklerini kullanmak için tutulur.
          </li>
          <li>
            <strong>Şifre:</strong> Şifreler geri döndürülemeyecek şekilde
            hash&apos;lenerek saklanır; düz metin olarak tutulmaz ve kimse tarafından
            okunamaz.
          </li>
          <li>
            <strong>Profil bilgileri (isteğe bağlı):</strong> Biyografi, profil ve
            kapak fotoğrafı, sosyal medya bağlantıları.
          </li>
          <li>
            <strong>İçerikler:</strong> Kullanıcının kendi isteğiyle oluşturduğu
            blog yazıları, yazı görselleri ve yorumlar sistemde tutulur.
          </li>
          <li>
            <strong>Destek mesajları:</strong> Yardım &amp; Destek formu üzerinden
            gönderilen ad soyad, e-posta, konu ve mesaj bilgileri.
          </li>
          <li>
            <strong>Tercihler (isteğe bağlı):</strong> Çerez ve veri kullanım
            tercihleriniz; hesap ayarlarından her zaman değiştirilebilir.
          </li>
          <li>
            <strong>Şifre sıfırlama kodu:</strong> Yalnızca sıfırlama talebinde
            bulunulduğunda oluşturulur ve 1 saat sonra geçersiz olur.
          </li>
        </ul>
        <p>
          Site; IP adresi kaydetmez, davranış takibi yapmaz ve analitik araç
          kullanmaz.
        </p>
      </LegalSection>

      <LegalSection title="3. Bilgiler Neden Tutulur?">
        <p>
          GHV MSFL öğrencileri, kulüp faaliyetlerine daha iyi erişebilmek ve kulüp
          sitesi üzerinden yazı paylaşmak, blog içerikleri oluşturmak ve yorum
          yapmak amacıyla hesap oluşturabilir. Tutulan bilgiler yalnızca şu amaçlarla
          kullanılır:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Hesap oluşturma, giriş ve oturum yönetimi,</li>
          <li>Profil sayfasının ve hesap ayarlarının çalıştırılması,</li>
          <li>Blog yazılarının oluşturulması ve yayımlanması,</li>
          <li>Yorum özelliğinin çalıştırılması,</li>
          <li>Şifre sıfırlama taleplerinin yerine getirilmesi,</li>
          <li>Destek taleplerinin yürütülmesi,</li>
          <li>Site güvenliğinin sağlanması.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Herkesin Görebildiği Bilgiler">
        <p>
          Yayınladığınız blog yazıları ve yorumlar, ilgili sayfalarda diğer
          ziyaretçiler tarafından görülebilir. Herkese açık profil sayfanızda
          kullanıcı adınız, ad-soyadınız, biyografiniz, profil/kapak fotoğraflarınız
          ve sosyal medya bağlantılarınız gösterilir. E-posta adresiniz ve şifreniz
          gibi gizli hesap bilgileri hiçbir zaman herkese açık sayfalarda
          gösterilmez.
        </p>
      </LegalSection>

      <LegalSection title="5. Özel Nitelikli Veriler">
        <p>
          Site; sağlık durumu, dini inanç, siyasi görüş, biyometrik veri gibi özel
          nitelikli kişisel verileri toplamaz. Bu tür verilerin yazı, yorum veya
          profil alanlarında paylaşılması uygun değildir; tespit edildiğinde içerik
          kaldırılabilir.
        </p>
      </LegalSection>

      <LegalSection title="6. Çerezler ve Oturum">
        <p>
          Siteye giriş yaptığınızda yalnızca bir adet zorunlu teknik çerez (oturum
          çerezi) kullanılır. Bu çerez tarayıcı komut dosyaları tarafından okunamaz,
          yalnızca site amacıyla çalışır ve 7 gün sonra ya da çıkış yaptığınızda
          geçersiz olur. Site, istatistik, reklam veya takip amacıyla çerez
          kullanmaz.
        </p>
      </LegalSection>

      <LegalSection title="7. Teknik Servisler">
        <p>
          Site, çalışması için aşağıdaki teknik servisleri kullanır ve verileriniz
          bu hizmetlerin çalışması kapsamında işlenebilir:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Vercel:</strong> Sitenin barındırılması ve yayına alınması.
          </li>
          <li>
            <strong>MongoDB:</strong> Hesap, içerik ve destek verilerinin tutulduğu
            veritabanı.
          </li>
          <li>
            <strong>ImageKit:</strong> Yüklediğiniz görsellerin (avatar, kapak, yazı
            görselleri) barındırılması.
          </li>
          <li>
            <strong>SendGrid:</strong> Şifre sıfırlama e-postalarının gönderilmesi.
          </li>
          <li>
            <strong>Google Gemini:</strong> &quot;Tarihte Bugün&quot; bölümünün
            içeriğinin üretilmesi — bu servise yalnızca günün tarihi gönderilir,
            kişisel veri paylaşılmaz.
          </li>
        </ul>
        <p>
          Kulüp iletişim e-posta adresi (msfltarihkulubu@outlook.com) Microsoft
          Outlook e-posta hizmetini kullanır. Gerektiğinde verileriniz okul yönetimi,
          danışman öğretmenler ve hukuken yetkili kurumlarla paylaşılabilir.
        </p>
      </LegalSection>

      <LegalSection title="8. Veri Güvenliği">
        <ul className="list-disc pl-6 space-y-2">
          <li>Şifrelerin geri döndürülemeyecek şekilde hash&apos;lenmesi,</li>
          <li>Oturumların imzalı jetonlar (JWT) ve HTTP-only çerezlerle yönetilmesi,</li>
          <li>Yönetim işlevlerinin rol bazlı yetkilendirme ile korunması,</li>
          <li>Yüklenen görsellerin ve içerik girdilerinin sunucu tarafında doğrulanması.</li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Saklama">
        <p>
          Bilgileriniz, üyeliğiniz sürdüğü sürece ve ilgili amaç için gerekli olduğu
          süre boyunca tutulur. Hesabınızı sildiğinizde profiliniz, yazılarınız ve
          yorumlarınız silinir; yüklediğiniz görseller barındırma servisinden
          kaldırılır. Veri kaybına karşı silme öncesi alınan arşiv kopyası{" "}
          <strong>30 gün (1 ay)</strong> boyunca tutulduktan sonra otomatik olarak
          silinir. Destek mesajları, kulüp sitesi üzerinden gelen destek ve iletişim
          taleplerini yönetmek amacıyla veritabanında{" "}
          <strong>kalıcı olarak saklanır</strong>.
        </p>
      </LegalSection>

      <LegalSection title="10. KVKK Kapsamındaki Haklarınız">
        <p>
          6698 sayılı KVKK uyarınca; kişisel verilerinizin işlenip işlenmediğini
          öğrenme, bilgi talep etme, eksik veya yanlış verilerin düzeltilmesini
          isteme, silinmesini isteme, işlemeye itiraz etme ve zarara uğramanız
          hâlinde tazminat talep etme haklarına sahipsiniz.
        </p>
      </LegalSection>

      <LegalSection title="11. Değişiklikler">
        <p>
          Bu politika güncellenebilir. Güncel metin, sitede yayımlandığı anda
          yürürlüğe girer.
        </p>
      </LegalSection>

      <LegalSection title="12. İletişim">
        <p>
          Başvuru ve sorularınız için: <MailLink />
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
