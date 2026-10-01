import Link from "next/link";
import Image from "next/image";
import { postRepository, tarihteBugunRepository } from "@/lib/db/repositories";
import { getSession } from "@/lib/auth/session";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/types";

export const dynamic = "force-dynamic";

/** Eski sitedeki tam ekran arka plan bölümlerinin modern karşılığı:
 *  gerçek bölüm görselleri + okunabilirlik için perde, responsive yükseklik. */
function Band({
  image,
  priority = false,
  overlay = "bg-background/60",
  className = "",
  children,
}: {
  image: string;
  priority?: boolean;
  overlay?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`relative overflow-hidden border-b border-border ${className}`}>
      <Image
        src={image}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        priority={priority}
        className="object-cover"
      />
      <div className={`absolute inset-0 ${overlay}`} aria-hidden="true" />
      <Container className="relative py-16 sm:py-20 lg:py-24">{children}</Container>
    </section>
  );
}

export default async function HomePage() {
  let featuredPosts: Post[] = [];
  try {
    featuredPosts = await postRepository.findRecent(3);
  } catch (error) {
    console.error("Failed to fetch recent posts:", error);
  }

  const now = new Date();
  const dateKey = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
  let bugun = null;
  try {
    bugun = await tarihteBugunRepository.findByDateKey(dateKey);
  } catch (error) {
    console.error("Failed to fetch Tarihte Bugün:", error);
  }

  const session = await getSession();

  return (
    <div>
      {/* 1) HERO — eski "texts" bölümü */}
      <Band image="/img/bg/hero.webp" priority overlay="bg-background/40">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
              Mustafa Saffet Fen Lisesi Tarih Kulübü
            </p>
            <blockquote className="space-y-5">
              <p className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                &ldquo;Tarih yazmak, tarih yapmak kadar mühimdir.&rdquo;
              </p>
              <Image
                src="/img/ataturk-imza.webp"
                alt="Mustafa Kemal Atatürk'ün imzası"
                width={220}
                height={74}
                className="h-auto w-44 sm:w-52"
              />
            </blockquote>
            <p className="serif-quote text-xl sm:text-2xl">
              &ldquo;Hey Gaziler! Yürümek gerek, niçin duralım?&rdquo;
            </p>
          </div>

          <div
            aria-hidden="true"
            className="hidden justify-center lg:col-span-1 lg:flex"
          >
            <Image
              src="/img/ayrac.png"
              alt=""
              width={40}
              height={375}
              className="h-72 w-auto opacity-80"
            />
          </div>

          <div className="flex flex-col items-start gap-6 lg:col-span-5">
            <p className="paper-panel p-6 text-base leading-relaxed text-foreground/90">
              Tarihi yalnızca okumakla kalmıyor, onu yaşatıyoruz. Mustafa Saffet
              Fen Lisesi Tarih Kulübü olarak geçmişin izlerini araştırıyor,
              tarihin ışığında geleceğe yürüyoruz.
            </p>
            <Image
              src="/img/tugra.webp"
              alt=""
              aria-hidden="true"
              width={180}
              height={101}
              className="h-auto w-40 self-end opacity-90"
            />
            <Link
              href="/hakkinda"
              className="px-6 py-3 bg-accent text-accent-foreground font-medium border border-accent rounded-sm hover:bg-accent-strong hover:border-accent-strong transition-colors"
            >
              Daha Fazlası İçin Tıkla
            </Link>
          </div>
        </div>
      </Band>

      {/* 2) TARİHİN SATIR ARALARI — öne çıkan yazılar */}
      <Band
        image="/img/bg/arsiv.webp"
        overlay="bg-gradient-to-r from-background via-background/90 to-background/40"
      >
        <div className="space-y-10">
          <div className="max-w-2xl space-y-3">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tarihin Satır Araları
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Her yazıda geçmişten bir nefes, geleceğe bir iz bırakıyoruz.
            </p>
            <p className="font-display text-xl font-bold text-accent">Öne Çıkanlar</p>
          </div>

          {featuredPosts.length === 0 ? (
            <p className="paper-panel p-8 text-center text-muted-foreground">
              Henüz yayımlanmış bir yazı yok. İlk yazıyı sen oluştur!
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post, i) => (
                <PostCard key={post._id.toString()} post={post} headingLevel={3} priority={i === 0} />
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <p className="serif-quote text-lg">
              &ldquo;Tarih sadece kitaplarda kalmasın. Bizimle keşfet!&rdquo;
            </p>
            <Link
              href="/blog"
              className="px-6 py-3 bg-accent text-accent-foreground font-medium border border-accent rounded-sm hover:bg-accent-strong hover:border-accent-strong transition-colors"
            >
              Blogu Keşfet
            </Link>
          </div>
        </div>
      </Band>

      {/* 3) BU YIL TARİHLE BULUŞUYORUZ — etkinlikler */}
      <Band image="/img/bg/etkinlik.webp" overlay="bg-background/55">
        <div className="paper-panel max-w-3xl space-y-6 p-8 sm:p-10">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Bu Yıl Tarihle Buluşuyoruz
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Her etkinliğimizde tarihin farklı bir dönemine yolculuk ediyoruz.
            Konferanslar, müze gezileri, münazaralar ve söyleşilerle dolu bir yıl
            bizi bekliyor.
          </p>
          <p className="serif-quote text-xl sm:text-2xl">
            &ldquo;Tarih, anlatıldıkça yaşar.&rdquo;
          </p>
          <Link
            href="/etkinlikler"
            className="inline-block px-6 py-3 bg-accent text-accent-foreground font-medium border border-accent rounded-sm hover:bg-accent-strong hover:border-accent-strong transition-colors"
          >
            Etkinlik Takvimini Gör
          </Link>
        </div>
      </Band>

      {/* 4) TARİHTE BUGÜN */}
      <Band image="/img/bg/tarihte-bugun.webp" overlay="bg-background/70">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="space-y-4 lg:col-span-4">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tarihte Bugün
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Bugün geçmişte neler yaşandı, bir bak.
            </p>
            <Link
              href="/tarihte-bugun"
              className="inline-block px-6 py-3 bg-accent text-accent-foreground font-medium border border-accent rounded-sm hover:bg-accent-strong hover:border-accent-strong transition-colors"
            >
              Daha Fazlası İçin Tıkla
            </Link>
          </div>

          <div className="space-y-4 lg:col-span-8">
            {bugun && bugun.events && bugun.events.length > 0 ? (
              bugun.events.slice(0, 3).map((event, i) => (
                <div
                  key={i}
                  className="paper-panel flex items-start gap-5 p-5"
                >
                  <span className="font-display text-2xl font-bold text-accent">
                    {event.year}
                  </span>
                  <p className="pt-0.5 text-sm leading-relaxed text-foreground/85">
                    {event.title}
                  </p>
                </div>
              ))
            ) : (
              <p className="paper-panel p-6 text-sm text-muted-foreground">
                Bugünün tarihi için arşiv içeriği hazırlanıyor. Geçmiş günlerin
                kayıtları için Tarihte Bugün sayfasına göz atabilirsin.
              </p>
            )}
          </div>
        </div>
      </Band>

      {/* 5) ARAMIZA KATIL */}
      <Band image="/img/bg/katil.webp" overlay="bg-ink/80" className="border-b-0">
        <div className="mx-auto max-w-2xl space-y-5 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-accent-foreground sm:text-4xl">
            Sen de aramıza katılmak ister misin?
          </h2>
          <p className="text-lg text-accent-foreground/80">
            Tarihi sadece okumuyor, birlikte yaşıyoruz.
          </p>
          {session ? (
            <Link
              href="/blog/olustur"
              className="inline-block px-8 py-3 bg-gold-bright text-ink font-semibold border border-gold-bright rounded-sm hover:bg-transparent hover:text-gold-bright transition-colors"
            >
              Yeni Yazı Oluştur
            </Link>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/giris"
                className="px-8 py-3 bg-gold-bright text-ink font-semibold border border-gold-bright rounded-sm hover:bg-transparent hover:text-gold-bright transition-colors"
              >
                Oturum Aç
              </Link>
              <Link
                href="/kayit"
                className="px-8 py-3 border border-accent-foreground/50 text-accent-foreground font-semibold rounded-sm hover:border-accent-foreground hover:bg-accent-foreground/10 transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </Band>
    </div>
  );
}
