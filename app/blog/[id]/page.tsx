import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
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
  const heroImage = images[0]?.url;
  const galleryImages = images.slice(1);

  return (
    <div className="pb-16">
      {/* Kapak hero — eski sitedeki koyu blog detay başlığı */}
      <section className="relative overflow-hidden border-b-2 border-gold-bright/60">
        <SafeImage
          src={heroImage || "/img/bg/arsiv.webp"}
          fallbackSrc="/img/bg/arsiv.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink/95"
          aria-hidden="true"
        />
        <Container className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl space-y-4">
            <span className="inline-block border border-gold-bright/50 bg-gold-bright/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold-bright rounded-sm">
              Tarih Kulübü Arşivi
            </span>
            <h1 className="font-display text-3xl font-bold leading-tight text-[#faf6ec] sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#faf6ec]/80">
              <time dateTime={new Date(post.date).toISOString()}>
                {new Date(post.date).toLocaleDateString("tr-TR")}
              </time>
              <span aria-hidden="true" className="text-gold-bright">
                ◆
              </span>
              <Link
                href={`/u/${post.username}`}
                className="font-semibold text-gold-bright hover:text-[#ebd68f] transition-colors"
              >
                @{post.username}
              </Link>
            </p>

            {(isOwner || isAdmin) && (
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href={`/blog/duzenle/${id}`}
                  className="text-xs font-semibold text-gold-bright hover:underline"
                >
                  Yazıyı Düzenle
                </Link>
                <form action={deletePostAction}>
                  <input type="hidden" name="postId" value={id} />
                  <button
                    type="submit"
                    className="text-xs font-semibold text-[#f0b4b4] hover:underline"
                  >
                    Yazıyı Sil
                  </button>
                </form>
              </div>
            )}
          </div>
        </Container>
      </section>

      <Container className="pt-12">
        <div className="mx-auto max-w-3xl space-y-12">
          {resolvedSearch.success && (
            <div role="status" className="p-4 bg-success/10 border-l-2 border-success text-success rounded-sm text-sm">
              {resolvedSearch.success}
            </div>
          )}

          {resolvedSearch.error && (
            <div role="alert" className="p-4 bg-destructive/10 border-l-2 border-destructive text-destructive rounded-sm text-sm">
              {resolvedSearch.error}
            </div>
          )}

          {/* Yazı gövdesi */}
          <article className="bg-surface p-8 sm:p-12 rounded-md border border-border border-t-2 border-t-accent shadow-sm">
            <div
              className="article-body max-w-none"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />

            {galleryImages.length > 0 && (
              <div
                className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
                role="group"
                aria-label="Yazı görselleri"
              >
                {galleryImages.map((img, i) => (
                  <Link
                    key={img.fileId || img.url}
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative overflow-hidden rounded-md border border-border"
                  >
                    <SafeImage
                      src={img.url}
                      fallbackSrc="/img/default-blog.webp"
                      alt={`${post.title} — görsel ${i + 2}`}
                      width={900}
                      height={600}
                      className="h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </Link>
                ))}
              </div>
            )}
          </article>

          {/* Yorumlar */}
          <section id="comments" className="space-y-8 border-t-2 border-foreground/80 pt-8">
            <h2 className="text-2xl font-display font-bold">
              Yorumlar ({comments.length})
            </h2>

            {isAuth ? (
              <form
                action={addCommentAction}
                className="space-y-4 bg-surface p-6 rounded-md border border-border"
              >
                <input type="hidden" name="postId" value={id} />
                <label htmlFor="comment-content" className="field-label">
                  Yorumunuz
                </label>
                <textarea
                  id="comment-content"
                  name="content"
                  rows={3}
                  required
                  maxLength={2000}
                  placeholder="Düşüncelerini paylaş..."
                  className="field-input"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-accent text-accent-foreground font-medium text-sm border border-accent rounded-sm hover:bg-accent-strong hover:border-accent-strong transition-colors"
                >
                  Yorum Yap
                </button>
              </form>
            ) : (
              <div className="p-6 bg-surface rounded-md border border-border text-center space-y-2">
                <p className="text-muted-foreground text-sm">
                  Yorum yapabilmek için oturum açman gerekiyor.
                </p>
                <Link href="/giris" className="inline-block text-sm font-semibold text-accent hover:underline">
                  Giriş Yap →
                </Link>
              </div>
            )}

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-muted-foreground text-sm italic">
                  Henüz yorum yapılmamış. İlk yorumu sen yap!
                </p>
              ) : (
                comments.map((comment) => {
                  const commentId = comment._id.toString();
                  const isCommentOwner = isAuth && comment.user_id.toString() === session._id;
                  const canEditComment = isCommentOwner || isAdmin;

                  return (
                    <div
                      key={commentId}
                      className="p-6 bg-surface rounded-md border border-border border-l-2 border-l-gold space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Link
                          href={`/u/${comment.username}`}
                          className="font-semibold text-foreground hover:text-accent transition-colors"
                        >
                          @{comment.username}
                        </Link>
                        <span>{new Date(comment.date).toLocaleDateString("tr-TR")}</span>
                      </div>
                      <p className="text-foreground/85 text-sm leading-relaxed">
                        {comment.content}
                      </p>
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

          <div className="pt-2">
            <Link
              href="/blog"
              className="text-sm font-semibold text-accent underline-offset-4 decoration-gold/60 hover:decoration-accent"
            >
              ← Arşive Geri Dön
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
