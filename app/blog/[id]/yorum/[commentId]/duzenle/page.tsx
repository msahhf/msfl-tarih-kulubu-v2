import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { commentRepository } from "@/lib/db/repositories";
import { Container } from "@/components/ui/Container";
import { updateCommentAction } from "@/lib/blog/actions";

interface YorumDuzenlePageProps {
  params: Promise<{ id: string; commentId: string }>;
}

export default async function YorumDuzenlePage({ params }: YorumDuzenlePageProps) {
  const { id, commentId } = await params;

  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  let comment;
  try {
    comment = await commentRepository.findById(commentId);
  } catch (err) {
    console.error("Error fetching comment for edit:", err);
    notFound();
  }

  if (!comment) {
    notFound();
  }

  const isOwner = comment.user_id.toString() === session._id;
  const isAdmin = session.role === "admin";

  if (!isOwner && !isAdmin) {
    redirect(`/blog/${id}?error=Yetkiniz+yok`);
  }

  return (
    <Container className="py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold">Yorumu Düzenle</h1>
          <p className="text-muted-foreground text-sm">
            Yorumunuzun içeriğini güncelleyin.
          </p>
        </div>

        <form action={updateCommentAction} className="space-y-6 bg-surface p-8 rounded-xl border border-border">
          <input type="hidden" name="commentId" value={commentId} />
          <input type="hidden" name="postId" value={id} />

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium leading-none">
              İçerik
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={5}
              defaultValue={comment.content}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Güncelle
            </button>
            <Link
              href={`/blog/${id}#comments`}
              className="px-6 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-surface/80 transition-colors"
            >
              İptal
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
