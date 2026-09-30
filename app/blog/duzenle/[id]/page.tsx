import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { postRepository } from "@/lib/db/repositories";
import { Container } from "@/components/ui/Container";
import { ImageUploader } from "@/components/blog/ImageUploader";
import { updatePostAction } from "@/lib/blog/actions";

interface BlogDuzenlePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function BlogDuzenlePage({ params, searchParams }: BlogDuzenlePageProps) {
  const { id } = await params;
  const resolvedSearch = await searchParams;

  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  let post;
  try {
    post = await postRepository.findById(id);
  } catch (err) {
    console.error("Error fetching post for edit:", err);
    notFound();
  }

  if (!post) {
    notFound();
  }

  const isOwner = post.user_id.toString() === session._id;
  const isAdmin = session.role === "admin";

  if (!isOwner && !isAdmin) {
    redirect("/blog?error=Bu+işlem+için+yetkiniz+yok");
  }

  const existingImages = (post.images || []).map((img) => ({
    url: img.url,
    fileId: img.fileId,
  }));

  return (
    <Container className="py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold">Yazıyı Düzenle</h1>
          <p className="text-muted-foreground text-sm">
            Yazınızın başlığını, görsellerini ve içeriğini güncelleyin.
            Kaldırdığınız görseller arşivden de silinir.
          </p>
        </div>

        {resolvedSearch.error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
            {resolvedSearch.error}
          </div>
        )}

        <form action={updatePostAction} className="space-y-6 bg-surface p-8 rounded-xl border border-border">
          <input type="hidden" name="postId" value={id} />

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium leading-none">
              Başlık
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={3}
              maxLength={200}
              defaultValue={post.title}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium leading-none" id="edit-images-label">
              Görseller (en fazla 5)
            </span>
            <div role="group" aria-labelledby="edit-images-label">
              <ImageUploader name="images" initialImages={existingImages} maxImages={5} folder="blog" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium leading-none">
              İçerik
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={15}
              defaultValue={post.content}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm"
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
              href={`/blog/${id}`}
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
