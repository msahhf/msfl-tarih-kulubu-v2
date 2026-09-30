import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { postRepository } from "@/lib/db/repositories";
import { commentRepository } from "@/lib/db/repositories";
import { Container } from "@/components/ui/Container";
import { getSession } from "@/lib/auth/session";
import {
  addCommentAction,
  deleteCommentAction,
  deletePostAction,
} from "@/lib/blog/actions";
import { sanitizeBlogContent, toPlainTextExcerpt } from "@/lib/services/sanitize";

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await postRepository.findById(id);
    if (!post) return { title: "Yazı Bulunamadı" };
    const description = toPlainTextExcerpt(post.content, 160);
    const cover = post.images?.[0]?.url;
    return {
      title: post.title,
      description,
      openGraph: {
        title: post.title,
        description,
        type: "article",
        authors: [`@${post.username}`],
        ...(cover ? { images: [{ url: cover }] } : {}),
      },
    };
  } catch {
    return { title: "Blog" };
  }
}

export default async function BlogDetailPage({ params, searchParams }: BlogDetailPageProps) {
  const { id } = await params;
  const resolvedSearch = await searchParams;

  let post = null;
  let comments = [];

  try {
    post = await postRepository.findById(id);
    if (!post) {
      notFound();
    }
    comments = await commentRepository.findByPostId(id);
  } catch (err) {
    console.error("Error fetching blog detail:", err);
    notFound();
  }

  const session = await getSession();
  const isAuth = !!session;
  const isOwner = isAuth && post.user_id.toString() === session._id;
  const isAdmin = isAuth && session.role === "admin";

  const safeContent = sanitizeBlogContent(post.content);
  const images = post.images || [];

  return (
    <div className="space-y-16 py-16">
      <Container>
        <div className="max-w-3xl mx-auto space-y-12">
          {resolvedSearch.success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg text-sm">
              {resolvedSearch.success}
            </div>
          )}

          {resolvedSearch.error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
              {resolvedSearch.error}
            </div>
          )}

          {/* Post Header & Content */}
          <article className="bg-surface p-8 sm:p-12 rounded-xl border border-border space-y-8">
            <div className="space-y-4 border-b border-border pb-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{new Date(post.date).toLocaleDateString("tr-TR")}</span>
                <Link href={`/u/${post.username}`} className="font-medium text-accent hover:underline">
                  @{post.username}
                </Link>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                {post.title}
              </h1>

              {(isOwner || isAdmin) && (
                <div className="flex items-center gap-4 pt-2">
                  <Link
                    href={`/blog/duzenle/${id}`}
                    className="text-xs text-accent hover:underline font-semibold"
                  >
                    Yazıyı Düzenle
                  </Link>
                  <form action={deletePostAction}>
                    <input type="hidden" name="postId" value={id} />
                    <button
                      type="submit"
                      className="text-xs text-destructive hover:underline font-semibold"
                    >
                      Yazıyı Sil
                    </button>
                  </form>
                </div>
              )}
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="group" aria-label="Yazı görselleri">
                {images.map((img, i) => (
                  <div key={img.fileId || img.url} className="relative rounded-lg overflow-hidden border border-border">
                    <Image
                      src={img.url}
                      alt={`${post.title} — görsel ${i + 1}`}
                      width={800}
                      height={450}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div
              className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </article>

          {/* Comments Section */}
          <section id="comments" className="space-y-8 pt-8 border-t border-border">
            <h2 className="text-2xl font-display font-bold">Yorumlar ({comments.length})</h2>

            {isAuth ? (
              <form action={addCommentAction} className="space-y-4 bg-surface p-6 rounded-xl border border-border">
                <input type="hidden" name="postId" value={id} />
                <label htmlFor="comment-content" className="sr-only">
                  Yorumunuz
                </label>
                <textarea
                  id="comment-content"
                  name="content"
                  rows={3}
                  required
                  maxLength={2000}
                  placeholder="Düşüncelerini paylaş..."
                  className="w-full p-3 bg-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-accent text-accent-foreground font-medium text-sm rounded-lg hover:opacity-90 transition-opacity"
                >
                  Yorum Yap
                </button>
              </form>
            ) : (
              <div className="p-6 bg-surface rounded-xl border border-border text-center space-y-2">
                <p className="text-muted-foreground text-sm">Yorum yapabilmek için oturum açman gerekiyor.</p>
                <Link href="/giris" className="inline-block text-sm font-semibold text-accent hover:underline">
                  Giriş Yap →
                </Link>
              </div>
            )}

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
              ) : (
                comments.map((comment) => {
                  const commentId = comment._id.toString();
                  const isCommentOwner = isAuth && comment.user_id.toString() === session._id;
                  const canEditComment = isCommentOwner || isAdmin;

                  return (
                    <div key={commentId} className="p-6 bg-surface rounded-xl border border-border space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Link href={`/u/${comment.username}`} className="font-semibold text-foreground hover:underline">
                          @{comment.username}
                        </Link>
                        <span>{new Date(comment.date).toLocaleDateString("tr-TR")}</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{comment.content}</p>
                      {canEditComment && (
                        <div className="flex items-center gap-4 pt-2">
                          <Link
                            href={`/blog/${id}/yorum/${commentId}/duzenle`}
                            className="text-xs text-accent hover:underline font-semibold"
                          >
                            Düzenle
                          </Link>
                          <form action={deleteCommentAction}>
                            <input type="hidden" name="commentId" value={commentId} />
                            <input type="hidden" name="postId" value={id} />
                            <button
                              type="submit"
                              className="text-xs text-destructive hover:underline font-semibold"
                            >
                              Sil
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <div className="pt-4">
            <Link href="/blog" className="text-sm font-semibold text-accent hover:underline">
              ← Arşive Geri Dön
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
