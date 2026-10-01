import Link from "next/link";
import type { Metadata } from "next";
import { postRepository } from "@/lib/db/repositories";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { getSession } from "@/lib/auth/session";
import type { Post } from "@/types";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "MSFL Tarih Kulübü arşivi: geçmişin tozlu raflarından yazılar, araştırmalar ve makaleler.",
};

interface BlogPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;

  // Arşiv: tüm yayınlanmış yazılar (limit/sayfalama yok).
  let posts: Post[] = [];
  try {
    posts = await postRepository.findAll();
  } catch (err) {
    console.error("Failed to fetch posts:", err);
  }

  const session = await getSession();

  return (
    <div className="py-16">
      <Container>
        <div className="space-y-12">
          {/* Başlık */}
          <header className="space-y-3 border-b-2 border-foreground/80 pb-6 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              Blog
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Geçmişin İzinde, Geleceğin Peşinde
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground sm:mx-0">
              Her yazımızda geçmişin tozlu sayfalarından bir hikâye, geleceğe
              ilham verecek bir iz bulacaksın.
            </p>
          </header>

          {resolvedParams.success && (
            <div
              role="status"
              className="p-4 bg-success/10 border-l-2 border-success text-success rounded-sm text-sm"
            >
              {resolvedParams.success}
            </div>
          )}

          {resolvedParams.error && (
            <div
              role="alert"
              className="p-4 bg-destructive/10 border-l-2 border-destructive text-destructive rounded-sm text-sm"
            >
              {resolvedParams.error}
            </div>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border-strong rounded-md space-y-4">
              <p className="text-muted-foreground">
                Henüz yayımlanmış bir blog yazısı bulunmuyor.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Toplam <span className="font-semibold text-foreground">{posts.length}</span> yazı
              </p>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <PostCard
                    key={post._id.toString()}
                    post={post}
                    headingLevel={2}
                    priority={i < 3}
                  />
                ))}
              </div>
            </>
          )}

          {/* Sen de kendi tarihini yaz! — eski site CTA'sı */}
          <section className="paper-panel mx-auto max-w-3xl px-8 py-10 text-center space-y-4">
            <h2 className="font-display text-2xl font-bold text-accent">
              Sen de kendi tarihini yaz!
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
              Düşüncelerini, araştırmalarını ve gözlemlerini paylaş; tarih senin
              kaleminden canlansın.
            </p>
            {session ? (
              <Link
                href="/blog/olustur"
                className="inline-block px-6 py-3 bg-accent text-accent-foreground font-semibold border border-accent rounded-sm hover:bg-accent-strong hover:border-accent-strong transition-colors"
              >
                Yeni Blog Oluştur
              </Link>
            ) : (
              <Link
                href="/giris"
                className="inline-block px-6 py-3 bg-accent text-accent-foreground font-semibold border border-accent rounded-sm hover:bg-accent-strong hover:border-accent-strong transition-colors"
              >
                Blog yazmak için giriş yapın
              </Link>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}
