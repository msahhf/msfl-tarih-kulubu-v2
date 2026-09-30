import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function SiteHaritasiPage() {
  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto space-y-12 bg-surface p-8 sm:p-12 rounded-xl border border-border">
        <header className="space-y-4 border-b border-border pb-6">
          <h1 className="text-3xl sm:text-4xl font-display font-bold">Site Haritası</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            MSFL Tarih Kulübü web sitesindeki tüm bölümlere buradan hızlıca erişebilirsiniz.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ana Sayfa & Etkinlikler */}
          <div className="p-6 bg-background rounded-lg border border-border space-y-4">
            <h3 className="font-display font-bold text-foreground text-lg">Ana Bölüm & İçerik</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
              </li>
              <li>
                <Link href="/hakkinda" className="hover:text-accent transition-colors">Hakkında (Vizyon & Misyon, Yönetim)</Link>
              </li>
              <li>
                <Link href="/etkinlikler" className="hover:text-accent transition-colors">Etkinlikler (Yıllık Plan)</Link>
              </li>
              <li>
                <Link href="/tarihte-bugun" className="hover:text-accent transition-colors">Tarihte Bugün</Link>
              </li>
            </ul>
          </div>

          {/* Bloglar */}
          <div className="p-6 bg-background rounded-lg border border-border space-y-4">
            <h3 className="font-display font-bold text-foreground text-lg">Blog Sistemi</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link href="/blog" className="hover:text-accent transition-colors">Tüm Bloglar / Arşiv</Link>
              </li>
              <li>
                <Link href="/blog/olustur" className="hover:text-accent transition-colors">Yeni Blog Oluştur</Link>
              </li>
            </ul>
          </div>

          {/* Hesap */}
          <div className="p-6 bg-background rounded-lg border border-border space-y-4">
            <h3 className="font-display font-bold text-foreground text-lg">Hesap & Kullanıcı</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link href="/giris" className="hover:text-accent transition-colors">Giriş Yap</Link>
              </li>
              <li>
                <Link href="/kayit" className="hover:text-accent transition-colors">Kayıt Ol</Link>
              </li>
              <li>
                <Link href="/hesap" className="hover:text-accent transition-colors">Hesap Ayarları</Link>
              </li>
            </ul>
          </div>

          {/* Yasal */}
          <div className="p-6 bg-background rounded-lg border border-border space-y-4">
            <h3 className="font-display font-bold text-foreground text-lg">Yasal</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link href="/legal/gizlilik-politikasi" className="hover:text-accent transition-colors">Gizlilik Politikası</Link>
              </li>
              <li>
                <Link href="/legal/kullanim-sartlari" className="hover:text-accent transition-colors">Kullanım Şartları</Link>
              </li>
              <li>
                <Link href="/legal/acik-riza-metni" className="hover:text-accent transition-colors">Açık Rıza Metni</Link>
              </li>
              <li>
                <Link href="/legal/iletisim" className="hover:text-accent transition-colors">İletişim</Link>
              </li>
              <li>
                <Link href="/legal/site-haritasi" className="hover:text-accent transition-colors">Site Haritası</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}
