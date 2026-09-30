import Link from "next/link";
import { postRepository } from "@/lib/db/repositories";
import { Container } from "@/components/ui/Container";
import type { Post } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let recentPosts: Post[] = [];
  try {
    recentPosts = await postRepository.findRecent(6);
  } catch (error) {
    console.error("Failed to fetch recent posts:", error);
  }

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="bg-surface border-b border-border py-20 px-4 sm:px-6 lg:px-8">
        <Container>
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Mustafa Saffet Fen Lisesi • Dijital Arşiv
            </span>
            <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-foreground">
              Geçmişin İzinde, Geleceğin Işığında.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              MSFL Tarih Kulübü olarak tarihin derinliklerini keşfediyor, araştırma yazılarımızı, etkinliklerimizi ve arşivimizi dijital dünyada buluşturuyoruz.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/blog"
                className="px-6 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Arşivi Keşfet
              </Link>
              <Link
                href="/etkinlikler"
                className="px-6 py-3 border border-border font-medium rounded-lg hover:bg-surface transition-colors"
              >
                Etkinlik Takvimi
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Sections / Highlights */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-surface rounded-xl border border-border space-y-4">
            <h3 className="text-xl font-display font-bold">Tarihte Bugün</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Bugünün tarihinde dünyada ve Türk tarihinde neler yaşandı? Arşivimizden önemli olayları inceleyin.
            </p>
            <Link href="/tarihte-bugun" className="inline-block text-sm font-semibold text-accent hover:underline">
              Göz At →
            </Link>
          </div>

          <div className="p-8 bg-surface rounded-xl border border-border space-y-4">
            <h3 className="text-xl font-display font-bold">Yıllık Etkinlikler</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Konferanslar, müze gezileri, münazaralar ve tarih söyleşileri ile dolu akademik takvimimizi keşfedin.
            </p>
            <Link href="/etkinlikler" className="inline-block text-sm font-semibold text-accent hover:underline">
              Takvimi İncele →
            </Link>
          </div>

          <div className="p-8 bg-surface rounded-xl border border-border space-y-4">
            <h3 className="text-xl font-display font-bold">Kulüp Misyonu</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tarih bilincini yaymak, eleştirel düşünceyi geliştirmek ve ortak kültürel mirasa sahip çıkmak.
            </p>
            <Link href="/hakkinda" className="inline-block text-sm font-semibold text-accent hover:underline">
              Hakkımızda →
            </Link>
          </div>
        </div>
      </Container>

      {/* Recent Posts Section */}
      <Container>
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-2xl font-display font-bold tracking-tight">Son Araştırma ve Yazılar</h2>
            <Link href="/blog" className="text-sm font-semibold hover:text-accent transition-colors">
              Tümünü Gör →
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Henüz bir yazı eklenmemiş.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article
                  key={post._id.toString()}
                  className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(post.date).toLocaleDateString("tr-TR")}</span>
                        <span>@{post.username}</span>
                      </div>
                      <h3 className="font-display font-bold text-lg leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {post.content.replace(/<[^>]*>?/gm, "")}
                      </p>
                    </div>
                    <Link
                      href={`/blog/${post._id.toString()}`}
                      className="text-sm font-semibold text-accent hover:underline pt-2"
                    >
                      Devamını Oku →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
