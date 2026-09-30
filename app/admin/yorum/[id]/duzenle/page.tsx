import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { commentRepository } from "@/lib/db/repositories";
import { adminUpdateCommentAction } from "@/lib/admin/actions";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminCommentEditPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;

  let comment = null;
  try {
    comment = await commentRepository.findById(id);
  } catch {
    redirect("/admin/yorumlar");
  }
  if (!comment) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/yorumlar" className="text-sm font-semibold text-accent hover:underline">
          ← Yorumlara Dön
        </Link>
        <h2 className="text-xl font-display font-bold mt-2">Yorumu Düzenle</h2>
        <p className="text-sm text-muted-foreground">
          @{comment.username} • {new Date(comment.date).toLocaleDateString("tr-TR")}
        </p>
      </div>

      {query.error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
          {query.error}
        </div>
      )}

      <form action={adminUpdateCommentAction} className="space-y-4 bg-surface p-6 rounded-xl border border-border">
        <input type="hidden" name="commentId" value={id} />
        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium leading-none">
            İçerik
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={5}
            maxLength={2000}
            defaultValue={comment.content}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
}
