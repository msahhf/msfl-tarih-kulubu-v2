import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <h3 className="font-display font-bold text-lg">MSFL Tarih Kulübü</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              Geçmişin izinde, geleceğin ışığında dijital tarih arşivi ve araştırma platformu.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">Arşiv / Blog</Link>
              </li>
              <li>
                <Link href="/etkinlikler" className="hover:text-foreground transition-colors">Etkinlikler</Link>
              </li>
              <li>
                <Link href="/tarihte-bugun" className="hover:text-foreground transition-colors">Tarihte Bugün</Link>
              </li>
              <li>
                <Link href="/hakkinda" className="hover:text-foreground transition-colors">Hakkında</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Yasal & Bilgi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/gizlilik-politikasi" className="hover:text-foreground transition-colors">Gizlilik Politikası</Link>
              </li>
              <li>
                <Link href="/legal/kullanim-sartlari" className="hover:text-foreground transition-colors">Kullanım Şartları</Link>
              </li>
              <li>
                <Link href="/legal/acik-riza-metni" className="hover:text-foreground transition-colors">Açık Rıza Metni</Link>
              </li>
              <li>
                <Link href="/legal/iletisim" className="hover:text-foreground transition-colors">İletişim</Link>
              </li>
              <li>
                <Link href="/legal/site-haritasi" className="hover:text-foreground transition-colors">Site Haritası</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MSFL Tarih Kulübü. Tüm hakları saklıdır.</p>
          <p className="mt-2 sm:mt-0">Mustafa Saffet Fen Lisesi</p>
        </div>
      </div>
    </footer>
  );
}
