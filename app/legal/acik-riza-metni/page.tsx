import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import { MailLink } from "@/components/legal/MailLink";

export const metadata = {
  title: "Açık Rıza Metni",
  description:
    "MSFL Tarih Kulübü web platformu kişisel verilerin işlenmesine ilişkin açık rıza metni (KVKK).",
};

export default function AcikRizaMetniPage() {
  return (
    <LegalDocument
      title="Açık Rıza Metni"
      subtitle="Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi Tarih Kulübü · Kişisel Verilerin İşlenmesine İlişkin Açık Rıza Metni"
      effectiveDate="2026"
      lastUpdated="Ekim 2026"
    >
      <LegalSection title="1. Veri Sorumlusu">
        <p>
          Kişisel verileriniz, veri sorumlusu sıfatıyla{" "}
          <strong>Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi Tarih Kulübü</strong>{" "}
          (&quot;GHV MSFL Tarih Kulübü&quot;, &quot;Kulüp&quot;) tarafından işlenir.
        </p>
        <p>
          Bu metin, kayıt sırasında onayladığınız açık rızanın kapsamını belirler.
          Verilerinizin hangi amaçlarla tutulduğuna ilişkin eksiksiz açıklama Gizlilik
          Politikası&apos;nda yer alır; bu metin o politikanın yerini almaz.
        </p>
      </LegalSection>

      <LegalSection title="2. Açık Rızanın Konusu">
        <p>
          Hesap oluşturmak ve site özelliklerini kullanmak için gereken ad, soyad,
          kullanıcı adı, e-posta ve şifre bilgileri, açık rızanız dışında, hesabın
          oluşturulması ve site işlevlerinin sunulması amacıyla işlenir.
        </p>
        <p>
          Bu metni onaylayarak, aşağıdaki <strong>isteğe bağlı</strong> bilgilerinizin
          belirtilen amaçlarla işlenmesine açık rıza verirsiniz:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Profil bilgileri:</strong> Biyografi, profil ve kapak fotoğrafı,
            sosyal medya bağlantıları — profil sayfanızda gösterilmeleri dâhil.
          </li>
          <li>
            <strong>Tercihler:</strong> Çerez ve veri kullanım tercihlerinizin
            hesabınızda saklanması.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Blog Yazıları ve Yorumlar">
        <p>
          Blog yazısı paylaşmak ve yorum yapmak sitenin temel işlevlerindendir. Kayıt
          olurken site kurallarını ve veri işleme metinlerini kabul edersiniz;
          yazılarınızın ve yorumlarınızın site üzerinde yayınlanacağını bilerek
          içerik oluşturursunuz.
        </p>
      </LegalSection>

      <LegalSection title="4. Destek Mesajları">
        <p>
          Yardım &amp; Destek formunu doldurduğunuzda; ad soyad, e-posta, konu ve
          mesaj bilgileriniz, talebin kulüp yönetimince ele alınması amacıyla gönüllü
          olarak sağlanır ve işlenir.
        </p>
      </LegalSection>

      <LegalSection title="5. Teknik Servisler">
        <p>
          Sitenin çalışması için kullanılan teknik servisler (Vercel, MongoDB,
          ImageKit) üzerinden verileriniz bu hizmetlerin çalışması kapsamında
          işlenebilir. Ayrıntılar Gizlilik Politikası&apos;nın 7. bölümünde yer alır.
        </p>
      </LegalSection>

      <LegalSection title="6. Saklama">
        <p>
          Verileriniz, üyeliğiniz sürdüğü sürece tutulur. Hesap silindiğinde
          verileriniz silinir; veri kaybına karşı silme öncesi alınan arşiv kopyası{" "}
          <strong>30 gün (1 ay)</strong> boyunca tutulduktan sonra otomatik olarak
          silinir. Destek mesajları kalıcı olarak saklanır.
        </p>
      </LegalSection>

      <LegalSection title="7. Rızanın Geri Alınması">
        <p>
          Bu metne ilişkin açık rızanızı dilediğiniz zaman, gerekçe göstermeksizin ve
          üyeliğinizi kullanmaya devam etme hakkınızı ortadan kaldırmaksızın{" "}
          <MailLink /> adresine göndereceğiniz taleple geri alabilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="8. Haklarınız">
        <p>
          KVKK kapsamındaki haklarınızın tam listesi ve başvuru yolu Gizlilik
          Politikası&apos;nın 10. bölümünde yer almaktadır.
        </p>
      </LegalSection>

      <LegalSection title="9. İletişim">
        <p>
          Tüm talepleriniz için: <MailLink />
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
