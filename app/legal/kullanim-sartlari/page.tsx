import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import { MailLink } from "@/components/legal/MailLink";

export const metadata = {
  title: "Kullanım Şartları",
  description:
    "MSFL Tarih Kulübü web platformu kullanım şartları.",
};

export default function KullanimSartlariPage() {
  return (
    <LegalDocument
      title="Kullanım Şartları"
      subtitle="Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi Tarih Kulübü Web Platformu Kullanım Şartları"
      effectiveDate="2026"
      lastUpdated="Ekim 2026"
    >
      <LegalSection title="1. Sitenin Amacı ve Niteliği">
        <p>
          Bu site, Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi Tarih Kulübü&apos;nün
          (&quot;GHV MSFL Tarih Kulübü&quot;, &quot;Kulüp&quot;) kulüp web sitesidir.
          Site ticari bir platform değildir. Temel amacı; kulübün faaliyetleri ve
          içeriklerinin paylaşılması, kulüp tarih içeriklerinin yayımlanması, blog
          mekanizması üzerinden yazı paylaşılması, kullanıcıların yorum yapabilmesi
          ve kulüp öğrencilerinin kulüp içeriklerine daha kolay erişebilmesidir.
        </p>
      </LegalSection>

      <LegalSection title="2. Hesap Kullanımı">
        <p>
          Kişiler, GHV MSFL&apos;deki öğrenciler olarak kulüp içeriklerine daha iyi
          ulaşmak ve/veya blog yazmak, paylaşmak ve yorum yapmak amacıyla kayıt
          olabilir. Hesap oluşturmak için ad, soyad, kullanıcı adı, e-posta ve şifre
          bilgileri gerekir; verdiğiniz bilgilerin doğru ve güncel olması gerekir.
          Başka kişi adına hesap açılamaz.
        </p>
        <p>
          Kayıt sırasında Açık Rıza Metni, Gizlilik Politikası ve bu Kullanım
          Şartları&apos;nı onaylarsınız. Bu metinler; hangi verilerin neden toplandığını
          ve hangi site özelliklerinde kullanıldığını açıklar.
        </p>
      </LegalSection>

      <LegalSection title="3. Hesap Güvenliği">
        <p>
          Hesap şifrenizin gizliliği sizin sorumluluğunuzdadır. Şifreler geri
          döndürülemeyecek şekilde hash&apos;lenerek saklanır; kimse tarafından
          okunamaz. Şifrenizi unuttuğunuzda e-posta yoluyla, 1 saat geçerli sıfırlama
          bağlantısıyla yeni şifre oluşturabilirsiniz. Yetkisiz erişim
          bildirimlerinizi <MailLink /> adresine iletebilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="4. Blog / Yazı Sistemi">
        <p>
          Üyeler, tarih konulu blog yazıları oluşturabilir, kendilerine ait yazıları
          düzenleyebilir ve silebilir. Yazılar, yazarının kullanıcı adıyla birlikte
          herkese açık biçimde yayımlanır. Yüklenebilecek görseller ve içerik,
          Platformun belirlediği teknik sınırlara tabidir.
        </p>
      </LegalSection>

      <LegalSection title="5. Yorum Sistemi">
        <p>
          Üyeler, blog yazılarına yorum yazabilir; kendi yorumlarını düzenleyip
          silebilir. Yorumlar, yorumu yapan kullanıcının adıyla birlikte yazı
          sayfasında herkese açık biçimde görüntülenir ve kullanıcı profiliyle
          ilişkilendirilir.
        </p>
      </LegalSection>

      <LegalSection title="6. Yardım ve Destek Talepleri">
        <p>
          Yardım &amp; Destek sayfasındaki form aracılığıyla gönderdiğiniz talepler;
          ad soyad, e-posta, konu ve mesaj bilgisiyle birlikte kulüp yönetimince
          incelenmek üzere kaydedilir. Bu talepler yalnızca desteğin sağlanması
          amacıyla kullanılır.
        </p>
      </LegalSection>

      <LegalSection title="7. Kullanıcı İçerikleri ve Kullanım Kuralları">
        <p>
          Blog yazıları, yorumlar ve profil bilgileri kullanıcıların kendileri
          tarafından oluşturulur; yayımladığınız içeriğin hukuki sorumluluğu size
          aittir. Kullanıcı içeriklerinin site üzerinde yayımlanması, blog ve kulüp
          içerik paylaşımı özelliğinin parçasıdır. İçerikleriniz, yalnızca kulüp
          faaliyetleri çerçevesinde Platformda gösterilmek ve kulübün iç arşivinde
          saklanmak amacıyla kullanılır; kulüp tarafından başka amaçla çoğaltılmaz.
          Hesabınızı sildiğinizde bu içerikler silinir.
        </p>
        <p>
          Site kurallarına uymak zorunludur. Aşağıdaki içerik ve davranışlar
          yasaktır:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Ayrımcılık, hakaret, tehdit, zorbalık ve nefret söylemi,</li>
          <li>Müstehcen ya da okul ortamına aykırı içerikler,</li>
          <li>Telif hakkı ihlali oluşturan paylaşımlar,</li>
          <li>Bilerek yanıltıcı veya yanlış bilgi yayımı,</li>
          <li>Reklam ve spam amacı taşıyan paylaşımlar,</li>
          <li>Platformun işleyişine zarar vermeye yönelik girişimler,</li>
          <li>
            Özel nitelikli kişisel verilerin (sağlık, dini/siyasi görüş, biyometrik
            veri vb.) paylaşılması.
          </li>
        </ul>
        <p>
          Bu kurallara aykırı içerikler, danışman öğretmenler ve site yönetimi
          tarafından kaldırılabilir; uyarılmaksızın üyelik askıya alınabilir veya
          sonlandırılabilir.
        </p>
      </LegalSection>

      <LegalSection title="8. Hizmetin Teknik Olarak Değiştirilebilmesi">
        <p>
          Platform; kulüp faaliyetlerinin gereksinimlerine bağlı olarak özellikleri,
          görünümü ve işleyişi değiştirilebilir, yeni özellikler eklenebilir veya mevcut
          özellikler geçici olarak sunulmayabilir. Bu değişiklikler önceden
          duyurulabilir; özellik değişikliklerinden kaynaklanan kayıplardan Kulüp,
          kasıt ve ağır ihmali olmayan durumlarda sorumlu tutulamaz.
        </p>
      </LegalSection>

      <LegalSection title="9. Hesap Silme">
        <p>
          Hesabınızı, şifrenizi onaylayarak hesap ayarlarından dilediğiniz zaman
          silebilirsiniz. Silme sonrasında profiliniz, yazılarınız ve yorumlarınız
          kaldırılır; yüklediğiniz görseller barındırma hizmetinden silinir. Veri
          kaybına karşı alınan arşiv kopyası <strong>30 gün (1 ay)</strong> boyunca
          tutulduktan sonra otomatik olarak silinir.
        </p>
      </LegalSection>

      <LegalSection title="10. Değişiklikler">
        <p>
          Kulüp, şartları güncelleyebilir. Güncel metin Platformda yayımlandığı
          tarihte yürürlüğe girer.
        </p>
      </LegalSection>

      <LegalSection title="11. İletişim">
        <p>
          Tüm sorularınız için: <MailLink />
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
