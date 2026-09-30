import Link from "next/link";
import { commentRepository } from "@/lib/db/repositories";
import { adminDeleteCommentAction } from "@/lib/admin/actions";

interface Props {
  searchParams: Promise<{
    q?: string;
    period?: string;
    success?: string;
    error?: string;
  }>;
}

export default async function AdminCommentsPage({ searchParams }: Props) {
  const query = await searchParams;

  const comments = await commentRepository.findFiltered({
    q: query.q || undefined,
    period: query.period || undefined,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display font-bold">Yorumlar ({comments.length})</h2>

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

      <form method="GET" className="flex flex-col sm:flex-row gap-3 bg-surface p-4 rounded-xl border border-border">
        <input
          type="search"
          name="q"
          defaultValue={query.q || ""}
          placeholder="Kullanıcı adı veya içerik ara…"
          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
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
        <button
          type="submit"
          className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Filtrele
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Yorum bulunamadı.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => {
            const commentId = comment._id.toString();
            return (
              <li key={commentId} className="bg-surface p-4 rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">@{comment.username}</span>
                  <span>{new Date(comment.date).toLocaleDateString("tr-TR")}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{comment.content}</p>
                <div className="flex items-center gap-4 pt-1">
                  <Link
                    href={`/admin/yorum/${commentId}/duzenle`}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Düzenle
                  </Link>
                  <form action={adminDeleteCommentAction}>
                    <input type="hidden" name="commentId" value={commentId} />
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
