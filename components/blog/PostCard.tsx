import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { toPlainTextExcerpt } from "@/lib/services/sanitize";
import type { Post } from "@/types";

/**
 * Blog kartı — eski sitedeki `.blog-card` yapısının (kapak, başlık, özet,
 * "Okumaya Devam Et" butonu, oluşturan + tarih) modern karşılığı.
 * Kapak yoksa eski sitedeki gerçek varsayılan görsel kullanılır.
 */
export function PostCard({
  post,
  headingLevel = 3,
  priority = false,
}: {
  post: Post;
  headingLevel?: 2 | 3;
  priority?: boolean;
}) {
  const postId = post._id.toString();
  const cover = post.images?.[0]?.url;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="group bg-surface rounded-md border border-border border-t-2 border-t-accent overflow-hidden flex flex-col shadow-sm hover:border-border-strong hover:shadow-md transition-all duration-150">
      <Link
        href={`/blog/${postId}`}
        className="relative block w-full aspect-[16/10] overflow-hidden border-b border-border"
        tabIndex={-1}
        aria-hidden="true"
      >
        <SafeImage
          src={cover || "/img/default-blog.webp"}
          fallbackSrc="/img/default-blog.webp"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          priority={priority}
        />
      </Link>

      <div className="p-6 flex-1 flex flex-col gap-3">
        <Heading className="font-display font-bold text-xl leading-snug text-foreground">
          <Link
            href={`/blog/${postId}`}
            className="hover:text-accent transition-colors"
          >
            {post.title}
          </Link>
        </Heading>

        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed flex-1">
          {toPlainTextExcerpt(post.content, 150)}
        </p>

        <Link
          href={`/blog/${postId}`}
          className="block w-full text-center px-4 py-2.5 bg-accent text-accent-foreground text-sm font-semibold border border-accent rounded-sm hover:bg-accent-strong hover:border-accent-strong transition-colors"
        >
          Okumaya Devam Et
        </Link>

        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
          Oluşturan:{" "}
          <Link href={`/u/${post.username}`} className="text-gold font-semibold hover:text-accent">
            @{post.username}
          </Link>
          <span className="dot-separator" />
          <time dateTime={new Date(post.date).toISOString()}>
            {new Date(post.date).toLocaleDateString("tr-TR")}
          </time>
        </p>
      </div>
    </article>
  );
}
