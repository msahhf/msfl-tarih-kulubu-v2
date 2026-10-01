import Link from "next/link";
import Image from "next/image";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="mt-auto bg-surface rule-double">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Kimlik */}
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <Image
                src="/img/logo-kulup.webp"
                alt="MSFL Tarih Kulübü logosu"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-contain"
              />
              <div>
                <h2 className="font-display font-bold text-xl text-foreground">
                  MSFL Tarih Kulübü
                </h2>
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-gold">
                  Mustafa Saffet Fen Lisesi
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Tarihi yalnızca okumakla kalmıyor, onu yaşatıyoruz. Geçmişin
              izlerini araştırıyor, tarihin ışığında geleceğe yürüyoruz.
            </p>
            <SocialLinks variant="footer" />
          </div>

          {/* Bağlantılar */}
          <nav className="space-y-3 md:col-span-3" aria-label="Site bölümleri">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Bölümler
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/blog" className="hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/etkinlikler" className="hover:text-accent transition-colors">
                  Etkinlikler
                </Link>
              </li>
              <li>
                <Link href="/tarihte-bugun" className="hover:text-accent transition-colors">
                  Tarihte Bugün
                </Link>
              </li>
              <li>
                <Link href="/hakkinda" className="hover:text-accent transition-colors">
                  Hakkında
                </Link>
              </li>
              <li>
                <Link href="/yardim-destek" className="hover:text-accent transition-colors">
                  Yardım &amp; Destek
                </Link>
              </li>
            </ul>
          </nav>

          {/* Yasal + destek */}
          <div className="space-y-5 md:col-span-4">
            <nav className="space-y-3" aria-label="Yasal sayfalar">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Yasal &amp; Bilgi
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/legal/gizlilik-politikasi" className="hover:text-accent transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/legal/kullanim-sartlari" className="hover:text-accent transition-colors">
                    Kullanım Şartları
                  </Link>
                </li>
                <li>
                  <Link href="/legal/acik-riza-metni" className="hover:text-accent transition-colors">
                    Açık Rıza Metni
                  </Link>
                </li>
                <li>
                  <Link href="/legal/iletisim" className="hover:text-accent transition-colors">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link href="/legal/site-haritasi" className="hover:text-accent transition-colors">
                    Site Haritası
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-sm font-semibold text-foreground">Yardım &amp; Destek</p>
              <p className="text-xs text-muted-foreground">
                Soru, öneri ve katkıların için bize ulaş.
              </p>
              <Link
                href="/yardim-destek"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold-bright text-ink text-xs font-semibold uppercase tracking-[0.12em] rounded-sm border border-gold-bright hover:bg-transparent hover:text-gold transition-colors"
              >
                Yardım &amp; Destek&apos;e Git →
              </Link>
            </div>
          </div>
        </div>

        <div className="rule-double mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MSFL Tarih Kulübü — Tüm Hakları Saklıdır.</p>
          <p className="uppercase tracking-[0.18em]">Gönüllü Hizmet Vakfı Mustafa Saffet Fen Lisesi</p>
        </div>
      </div>
    </footer>
  );
}
