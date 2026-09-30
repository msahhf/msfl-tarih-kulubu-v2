import Link from "next/link";
import Image from "next/image";
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
    <div className="space-y-16 py-16">
      <Container>
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Profile Header */}
          <div className="bg-surface rounded-xl border border-border space-y-6 shadow-sm overflow-hidden">
            {user.coverImage?.url ? (
              <div className="relative w-full aspect-[4/1] overflow-hidden border-b border-border">
                <Image
                  src={user.coverImage.url}
                  alt={`${user.username} kapak fotoğrafı`}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="p-8 pt-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {user.avatar?.url ? (
                  <Image
                    src={user.avatar.url}
                    alt={`${user.username} profil fotoğrafı`}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center text-accent font-display font-bold text-3xl"
                  >
                    {user.name?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                  </div>
                )}
                <div className="space-y-2 text-center sm:text-left">
                  <h1 className="text-3xl font-display font-bold">
                    {user.name} {user.surname}
                  </h1>
                  <p className="text-muted-foreground font-medium">@{user.username}</p>
                  {user.bio && <p className="text-muted-foreground text-sm max-w-lg">{user.bio}</p>}
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
                        className="inline-block px-3 py-1.5 text-xs font-semibold border border-border rounded-full hover:bg-accent/10 hover:text-accent transition-colors"
                      >
                        {SOCIAL_LABELS[key] ?? key}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 pt-4 border-t border-border text-center">
                <div>
                  <p className="text-2xl font-display font-bold text-accent">{posts.length}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Yazılar</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-accent">{comments.length}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Yorumlar</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Posts */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold tracking-tight">Kullanıcının Yazıları</h2>
            {posts.length === 0 ? (
              <p className="text-muted-foreground text-sm">Bu kullanıcının henüz yayınlanmış yazısı yok.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <article key={post._id.toString()} className="p-6 bg-surface rounded-xl border border-border space-y-3">
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("tr-TR")}
                    </span>
                    <h3 className="font-display font-bold text-lg">
                      <Link href={`/blog/${post._id.toString()}`} className="hover:text-accent transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {toPlainTextExcerpt(post.content, 160)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* User Comments */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold tracking-tight">Son Yorumları</h2>
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-sm">Bu kullanıcı henüz yorum yapmamış.</p>
            ) : (
              <ul className="space-y-3">
                {comments.slice(0, 5).map((comment) => (
                  <li key={comment._id.toString()} className="p-5 bg-surface rounded-xl border border-border space-y-1">
                    <p className="text-muted-foreground text-sm line-clamp-2">{comment.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.date).toLocaleDateString("tr-TR")} •{" "}
                      <Link
                        href={`/blog/${comment.post_id.toString()}#comments`}
                        className="font-semibold text-accent hover:underline"
                      >
                        Yazıya git →
                      </Link>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
