import Image from "next/image";
import Link from "next/link";

const VIEWER_NOTES = [
  {
    title: "Tarayıcıda okunur",
    description:
      "Dergi sayfaları sayfa çevirme hareketiyle açılır; ayrı bir uygulama veya eklenti gerekmez.",
  },
  {
    title: "Her ekrana uyum sağlar",
    description:
      "Masaüstünde çift sayfa, telefonda tek sayfa görünümü. Yakınlaştırma ve tam ekran desteği bulunur.",
  },
  {
    title: "Sayılar arşivlenir",
    description:
      "Yeni sayılar yayımlandıkça bu sayfada listelenir; eski sayılara erişim korunur.",
  },
];

/**
 * Dergi henüz yayımlanmadığında gösterilen tanıtım durumu.
 *
 * Bilinçli olarak sahte bir kapak, örnek PDF veya uydurma yayın bilgisi
 * içermez; yalnızca görüntüleyicinin ne yapacağını ve yayının hangi
 * aşamada olduğunu anlatır.
 */
export function MagazineEmptyState() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
      <div className="space-y-7">
        <div className="space-y-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-gold">
            Yayın Durumu
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            İlk sayı hazırlanıyor
          </h2>
        </div>

        <div className="space-y-4 text-[0.975rem] leading-relaxed text-muted-foreground">
          <p>
            Tarih Kulübü dergisinin ilk sayısı editörlük, araştırma ve tasarım
            aşamasında. Kapak, dosya ve sayfa düzeni tamamlandığında dergi bu
            sayfada yayımlanacak.
          </p>
          <p>
            Yayımlandığında dergiyi buradan sayfa çevirerek okuyabilecek,
            yakınlaştırabilecek ve tam ekran görünümüne geçebileceksiniz. Bu
            sayfada örnek veya deneme dosyası gösterilmez; yalnızca gerçek
            sayılar yer alır.
          </p>
        </div>

        <dl className="grid gap-4 border-y border-border py-6 sm:grid-cols-3 sm:gap-6">
          {VIEWER_NOTES.map((note) => (
            <div key={note.title} className="space-y-1.5">
              <dt className="font-display text-sm font-bold text-foreground">
                {note.title}
              </dt>
              <dd className="text-xs leading-relaxed text-muted-foreground">
                {note.description}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-strong"
          >
            Blog yazılarını okuyun
          </Link>
          <Link
            href="/yardim-destek"
            className="inline-flex items-center border border-border-strong px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-accent"
          >
            Görüş ve öneri iletin
          </Link>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-sm">
        <div
          className="relative aspect-[210/297] w-full overflow-hidden border border-border-strong bg-surface shadow-lg"
          aria-hidden="true"
        >
          <span className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <span className="absolute inset-x-3 top-3 bottom-3 border border-border" />

          <div className="relative flex h-full flex-col items-center justify-between px-8 py-10 text-center">
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-gold">
              Sayı 01
            </span>

            <div className="flex flex-col items-center gap-5">
              <Image
                src="/img/logo-tarih-kulubu.webp"
                alt=""
                width={1800}
                height={1078}
                sizes="(min-width: 1024px) 220px, 60vw"
                className="h-auto w-40 object-contain opacity-90"
              />
              <span className="h-px w-14 bg-gold/60" />
              <p className="font-display text-2xl font-bold leading-snug text-foreground">
                Tarih Kulübü
                <br />
                Dergisi
              </p>
            </div>

            <div className="w-full space-y-2 text-center">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Kapak hazırlanıyor
              </p>
              <p className="border-t border-dashed border-border-strong pt-2 text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground/80">
                Mustafa Saffet Fen Lisesi
              </p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
          Temsili kapak maketi · Yayın değildir
        </p>
      </div>
    </div>
  );
}
