import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { userRepository, postRepository, commentRepository } from "@/lib/db/repositories";
import { Container } from "@/components/ui/Container";
import { toPlainTextExcerpt } from "@/lib/services/sanitize";

interface PublicProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  try {
    const user = await userRepository.findByUsername(username);
    if (!user) return { title: "Kullanıcı Bulunamadı" };
    return {
      title: `@${user.username}`,
      description: user.bio
        ? toPlainTextExcerpt(user.bio, 160)
        : `@${user.username} — MSFL Tarih Kulübü üyesi.`,
    };
  } catch {
    return { title: "Profil" };
  }
}

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  x: "X",
  github: "GitHub",
  youtube: "YouTube",
  website: "Website",
};

function socialHref(key: string, value: string): string {
  if (key === "website") {
    return value.startsWith("http") ? value : `https://${value}`;
  }
  const bases: Record<string, string> = {
    instagram: "https://instagram.com/",
    x: "https://x.com/",
    github: "https://github.com/",
    youtube: "https://youtube.com/",
  };
  return `${bases[key] ?? ""}${value.replace(/^@/, "")}`;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;

  const user = await userRepository.findByUsername(username);
  if (!user) {
    notFound();
  }

  const userIdStr = user._id.toString();
  const posts = await postRepository.findByUserId(userIdStr);
  const comments = await commentRepository.findByUserId(userIdStr);

  const socialEntries = Object.entries(user.social || {}).filter(
    ([, value]) => typeof value === "string" && value.trim().length > 0
  ) as [string, string][];

  return (
    <div className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto space-y-14">
          {/* Üye kaydı — katalog kartı */}
          <section className="bg-surface rounded-md border border-border shadow-sm overflow-hidden">
            <div className="relative w-full aspect-[4/1] overflow-hidden border-b border-border">
              <SafeImage
                src={user.coverImage?.url || "/img/bg/hero.webp"}
                fallbackSrc="/img/bg/hero.webp"
                alt={user.coverImage?.url ? `${user.username} kapak fotoğrafı` : ""}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1 bg-gold-bright/80"
              />
            </div>
            <div className="p-8 pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <SafeImage
                  src={user.avatar?.url || "/img/default-avatar.webp"}
                  fallbackSrc="/img/default-avatar.webp"
                  alt={user.avatar?.url ? `${user.username} profil fotoğrafı` : ""}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gold-bright/70 p-0.5 bg-surface"
                />
                <div className="space-y-2 text-center sm:text-left">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-gold">
                    Kulüp Üyesi
                  </p>
                  <h1 className="text-3xl font-display font-bold text-foreground">
                    {user.name} {user.surname}
                  </h1>
                  <p className="text-muted-foreground font-medium">@{user.username}</p>
                  {user.bio && <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">{user.bio}</p>}
                </div>
              </div>

              {socialEntries.length > 0 && (
                <ul className="flex flex-wrap items-center gap-3" aria-label="Sosyal medya bağlantıları">
                  {socialEntries.map(([key, value]) => (
                    <li key={key}>
                      <a
                        href={socialHref(key, value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] border border-border-strong rounded-sm text-muted hover:border-accent hover:text-accent transition-colors"
                      >
                        {SOCIAL_LABELS[key] ?? key}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              <div className="rule-double grid grid-cols-2 gap-4 pt-5 text-center">
                <div>
                  <p className="text-3xl font-display font-bold text-accent">{posts.length}</p>
                  <p className="text-[0.65rem] text-muted-foreground uppercase tracking-[0.22em] font-semibold">Yazı</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-accent">{comments.length}</p>
                  <p className="text-[0.65rem] text-muted-foreground uppercase tracking-[0.22em] font-semibold">Yorum</p>
                </div>
              </div>
            </div>
          </section>

          {/* Yazılar */}
          <section className="space-y-6">
            <div className="space-y-2 border-b-2 border-foreground/80 pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Külliyat
              </p>
              <h2 className="text-2xl font-display font-bold tracking-tight">Kullanıcının Yazıları</h2>
            </div>
            {posts.length === 0 ? (
              <p className="text-muted-foreground text-sm border border-dashed border-border-strong rounded-md p-6">
                Bu kullanıcının henüz yayınlanmış yazısı yok.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <article
                    key={post._id.toString()}
                    className="p-6 bg-surface rounded-md border border-border border-t-2 border-t-accent space-y-3 hover:border-border-strong hover:shadow-md transition-all duration-150"
                  >
                    <p className="text-xs text-muted-foreground">
                      <span>{new Date(post.date).toLocaleDateString("tr-TR")}</span>
                    </p>
                    <h3 className="font-display font-bold text-lg text-foreground">
                      <Link
                        href={`/blog/${post._id.toString()}`}
                        className="hover:text-accent transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                      {toPlainTextExcerpt(post.content, 160)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Yorumlar */}
          <section className="space-y-6">
            <div className="space-y-2 border-b-2 border-foreground/80 pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Etkileşim
              </p>
              <h2 className="text-2xl font-display font-bold tracking-tight">Son Yorumları</h2>
            </div>
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-sm border border-dashed border-border-strong rounded-md p-6">
                Bu kullanıcı henüz yorum yapmamış.
              </p>
            ) : (
              <ul className="space-y-3">
                {comments.slice(0, 5).map((comment) => (
                  <li
                    key={comment._id.toString()}
                    className="p-5 bg-surface rounded-md border border-border border-l-2 border-l-gold space-y-1"
                  >
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{comment.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.date).toLocaleDateString("tr-TR")} •{" "}
                      <Link
                        href={`/blog/${comment.post_id.toString()}#comments`}
                        className="font-semibold text-accent underline-offset-4 decoration-gold/60 hover:decoration-accent"
                      >
                        Yazıya git →
                      </Link>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}
