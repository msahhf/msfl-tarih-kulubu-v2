import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { postRepository } from "@/lib/db/repositories";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getSession } from "@/lib/auth/session";
import { toPlainTextExcerpt } from "@/lib/services/sanitize";
import type { Post } from "@/types";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "MSFL Tarih Kulübü arşivi: geçmişin tozlu raflarından yazılar, araştırmalar ve makaleler.",
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string; success?: string; error?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10) || 1;
  const limit = 12;

  let postsData: { posts: Post[]; total: number; pages: number } = { posts: [], total: 0, pages: 1 };
  try {
    postsData = await postRepository.findPaginated(page, limit);
  } catch (err) {
    console.error("Failed to fetch posts:", err);
  }

  const session = await getSession();
  const { posts, pages } = postsData;

  return (
    <div className="space-y-16 py-16">
      <Container>
        <div className="space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-6">
            <SectionHeader
              title="Tarih Kulübü Arşivi & Blog"
              description="Geçmişin tozlu raflarından yazılar, araştırmalar ve makaleler."
            />
            {session ? (
              <Link
                href="/blog/olustur"
                className="px-6 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity text-center whitespace-nowrap"
              >
                + Yeni Blog Oluştur
              </Link>
            ) : (
              <Link
                href="/giris"
                className="px-6 py-3 border border-border font-medium rounded-lg hover:bg-surface/80 transition-colors text-center whitespace-nowrap text-sm"
              >
                Blog yazmak için giriş yapın
              </Link>
            )}
          </div>

          {resolvedParams.success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg text-sm">
              {resolvedParams.success}
            </div>
          )}

          {resolvedParams.error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
              {resolvedParams.error}
            </div>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-xl border border-border space-y-4">
              <p className="text-muted-foreground">Henüz yayımlanmış bir blog yazısı bulunmuyor.</p>
              {session && (
                <Link
                  href="/blog/olustur"
                  className="inline-block text-sm font-semibold text-accent hover:underline"
                >
                  İlk yazıyı sen oluştur →
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const postId = post._id.toString();
                const cover = post.images?.[0]?.url;
                return (
                  <article
                    key={postId}
                    className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    {cover ? (
                      <div className="relative w-full aspect-[16/9] overflow-hidden border-b border-border">
                        <Image
                          src={cover}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="w-full aspect-[16/9] border-b border-border bg-gradient-to-br from-accent/15 via-surface to-accent/5"
                      />
                    )}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(post.date).toLocaleDateString("tr-TR")}</span>
                        <span className="font-medium text-accent">@{post.username}</span>
                      </div>
                      <h3 className="font-display font-bold text-xl leading-snug text-foreground">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                        {toPlainTextExcerpt(post.content, 160)}
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <Link
                        href={`/blog/${postId}`}
                        className="inline-block text-sm font-semibold text-accent hover:underline"
                      >
                        Devamını Oku →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?page=${p}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    p === page
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-surface border-border hover:bg-border/50 text-muted-foreground"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
