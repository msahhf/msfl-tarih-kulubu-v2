import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Site Haritası",
  description: "MSFL Tarih Kulübü web sitesindeki tüm bölümlerin listesi.",
};

const SECTIONS: {
  title: string;
  links: { href: string; label: string }[];
}[] = [
  {
    title: "Ana Bölüm & İçerik",
    links: [
      { href: "/", label: "Ana Sayfa" },
      { href: "/hakkinda", label: "Hakkında (Vizyon & Misyon, Yönetim)" },
      { href: "/etkinlikler", label: "Etkinlikler (Yıllık Plan)" },
      { href: "/tarihte-bugun", label: "Tarihte Bugün" },
      { href: "/yardim-destek", label: "İletişim & Destek" },
    ],
  },
  {
    title: "Blog Sistemi",
    links: [
      { href: "/blog", label: "Tüm Yazılar / Arşiv" },
      { href: "/blog/olustur", label: "Yeni Yazı Oluştur" },
    ],
  },
  {
    title: "Hesap & Kullanıcı",
    links: [
      { href: "/giris", label: "Giriş Yap" },
      { href: "/kayit", label: "Kayıt Ol" },
      { href: "/sifremi-unuttum", label: "Şifremi Unuttum" },
      { href: "/hesap", label: "Hesap Ayarları" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { href: "/legal/gizlilik-politikasi", label: "Gizlilik Politikası" },
      { href: "/legal/kullanim-sartlari", label: "Kullanım Şartları" },
      { href: "/legal/acik-riza-metni", label: "Açık Rıza Metni" },
      { href: "/legal/iletisim", label: "İletişim" },
      { href: "/legal/site-haritasi", label: "Site Haritası" },
    ],
  },
];

export default function SiteHaritasiPage() {
  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface rounded-md border border-border border-t-2 border-t-accent shadow-sm p-8 sm:p-12 space-y-12">
          <header className="space-y-4 border-b-2 border-foreground/80 pb-6">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground tracking-tight">
              Site Haritası
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              MSFL Tarih Kulübü web sitesindeki tüm bölümlere buradan hızlıca
              erişebilirsiniz.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SECTIONS.map((section) => (
              <nav
                key={section.title}
                aria-label={section.title}
                className="p-6 bg-background rounded-sm border border-border border-l-2 border-l-gold space-y-4"
              >
                <h2 className="font-display font-bold text-foreground text-lg">
                  {section.title}
                </h2>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {section.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="underline-offset-4 decoration-gold/50 hover:text-accent hover:decoration-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
