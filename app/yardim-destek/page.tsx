import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import SupportForm from "@/components/support/SupportForm";
import { MailLink } from "@/components/legal/MailLink";
import { getSession } from "@/lib/auth/session";
import { userRepository } from "@/lib/db/repositories";

export const metadata = {
  title: "Yardım & Destek",
  description:
    "MSFL Tarih Kulübü web platformu yardım, destek ve iletişim merkezi.",
};

export default async function YardimDestekPage() {
  let defaultName = "";
  let defaultEmail = "";
  try {
    const session = await getSession();
    if (session) {
      const user = await userRepository.findById(session._id as string);
      if (user) {
        defaultName = `${user.name} ${user.surname}`.trim();
        defaultEmail = user.email;
      }
    }
  } catch {
    // Form herkese açık; oturum bilgisi alınamazsa boş başlatılır.
  }

  return (
    <div className="py-16">
      <Container>
        <div className="max-w-3xl mx-auto space-y-12">
          <SectionHeader
            eyebrow="Yardım & Destek"
            title="Bize Ulaşın"
            description="Sitemiz, içeriklerimiz veya kulüp faaliyetlerimiz hakkında soru, öneri ve destek taleplerinizi aşağıdaki formu kullanarak iletebilirsiniz."
          />

          {/* Destek formu */}
          <section
            aria-label="Destek talebi formu"
            className="bg-surface rounded-md border border-border border-t-2 border-t-accent shadow-sm p-8 sm:p-10"
          >
            <SupportForm defaultName={defaultName} defaultEmail={defaultEmail} />
          </section>

          {/* Doğrudan iletişim */}
          <section className="space-y-6">
            <div className="p-6 bg-surface rounded-md border border-border border-l-2 border-l-gold space-y-2">
              <h2 className="font-display font-bold text-foreground text-lg">E-posta</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Formu kullanmak istemezseniz doğrudan yazabilirsiniz:{" "}
                <MailLink />
              </p>
            </div>

            <div className="p-6 bg-surface rounded-md border border-border border-l-2 border-l-gold space-y-3">
              <h2 className="font-display font-bold text-foreground text-lg">
                Okul ve Kulüp Bilgileri
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                <strong className="text-foreground">Kurum:</strong> Gönüllü Hizmet
                Vakfı Mustafa Saffet Fen Lisesi
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                <strong className="text-foreground">Adres:</strong> Çamlık
                Mahallesi, 34912 Pendik / İstanbul
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                <strong className="text-foreground">Danışman Öğretmenler:</strong>{" "}
                Sn. Ruhi Sarıkaya &amp; Sn. Ramazan Mürşit Sarıoğlu
              </p>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
