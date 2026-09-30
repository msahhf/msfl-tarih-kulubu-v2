import Link from "next/link";
import { postRepository } from "@/lib/db/repositories";
import { adminDeleteBlogAction } from "@/lib/admin/actions";

interface Props {
  searchParams: Promise<{
    q?: string;
    author?: string;
    period?: string;
    sort?: string;
    success?: string;
    error?: string;
  }>;
}

export default async function AdminBlogsPage({ searchParams }: Props) {
  const query = await searchParams;

  const blogs = await postRepository.findFiltered({
    q: query.q || undefined,
    author: query.author || undefined,
    period: query.period || undefined,
    sort: query.sort || undefined,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display font-bold">Bloglar ({blogs.length})</h2>

      {query.success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg text-sm">
          {query.success}
        </div>
      )}
      {query.error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
          {query.error}
        </div>
      )}

      <form method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-surface p-4 rounded-xl border border-border">
        <input
          type="search"
          name="q"
          defaultValue={query.q || ""}
          placeholder="Başlık/içerik ara…"
          className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <input
          type="search"
          name="author"
          defaultValue={query.author || ""}
          placeholder="Yazar ara…"
          className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <select
          name="period"
          defaultValue={query.period || ""}
          className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Tüm zamanlar</option>
          <option value="7">Son 7 gün</option>
          <option value="30">Son 30 gün</option>
          <option value="365">Son 1 yıl</option>
        </select>
        <div className="flex gap-2">
          <select
            name="sort"
            defaultValue={query.sort || ""}
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">En yeni</option>
            <option value="old">En eski</option>
            <option value="title">Başlığa göre</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Filtrele
          </button>
        </div>
      </form>

      {blogs.length === 0 ? (
        <p className="text-sm text-muted-foreground">Blog bulunamadı.</p>
      ) : (
        <ul className="space-y-3">
          {blogs.map((post) => {
            const postId = post._id.toString();
            return (
              <li
                key={postId}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-border"
              >
                <div className="min-w-0 text-sm">
                  <p className="font-semibold truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground">
                    @{post.username} • {new Date(post.date).toLocaleDateString("tr-TR")} •{" "}
                    {(post.images || []).length} görsel
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link href={`/blog/${postId}`} className="text-xs font-semibold text-accent hover:underline">
                    Görüntüle
                  </Link>
                  <Link href={`/blog/duzenle/${postId}`} className="text-xs font-semibold text-accent hover:underline">
                    Düzenle
                  </Link>
                  <form action={adminDeleteBlogAction}>
                    <input type="hidden" name="postId" value={postId} />
                    <button type="submit" className="text-xs font-semibold text-destructive hover:underline">
                      Sil
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
