import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { userRepository, postRepository, commentRepository } from "@/lib/db/repositories";
import { adminToggleRoleAction, adminDeleteUserAction } from "@/lib/admin/actions";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function AdminUserDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;

  let targetUser = null;
  try {
    targetUser = await userRepository.findById(id);
  } catch {
    redirect("/admin/kullanicilar");
  }
  if (!targetUser) {
    notFound();
  }

  const [userBlogs, userComments] = await Promise.all([
    postRepository.findByUserId(id),
    commentRepository.findByUserId(id),
  ]);

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <Link href="/admin/kullanicilar" className="text-sm font-semibold text-accent hover:underline">
          ← Kullanıcılara Dön
        </Link>
        <h2 className="text-xl font-display font-bold mt-2">@{targetUser.username}</h2>
        <p className="text-sm text-muted-foreground">
          {targetUser.name} {targetUser.surname} • {targetUser.email} • Rol:{" "}
          <span className="uppercase font-semibold text-accent">{targetUser.role}</span> • Kayıt:{" "}
          {new Date(targetUser.date).toLocaleDateString("tr-TR")}
        </p>
        {targetUser.bio && (
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">{targetUser.bio}</p>
        )}
      </div>

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

      <div className="flex flex-wrap gap-3">
        <form action={adminToggleRoleAction}>
          <input type="hidden" name="userId" value={id} />
          <button
            type="submit"
            className="px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-surface/80 transition-colors"
          >
            {targetUser.role === "admin" ? "Admin Yetkisini Kaldır" : "Admin Yap"}
          </button>
        </form>
        <form action={adminDeleteUserAction}>
          <input type="hidden" name="userId" value={id} />
          <button
            type="submit"
            className="px-4 py-2 bg-destructive/10 text-destructive text-sm font-medium rounded-lg hover:bg-destructive/20 transition-colors"
          >
            Kullanıcıyı Sil (tüm verileriyle)
          </button>
        </form>
      </div>

      <section className="space-y-3">
        <h3 className="font-display font-bold">Blogları ({userBlogs.length})</h3>
        {userBlogs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Yazı yok.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {userBlogs.map((post) => (
              <li key={post._id.toString()} className="bg-surface p-3 rounded-lg border border-border flex items-center justify-between gap-3">
                <span className="font-medium truncate">{post.title}</span>
                <Link href={`/blog/${post._id.toString()}`} className="text-xs font-semibold text-accent hover:underline whitespace-nowrap">
                  Görüntüle
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="font-display font-bold">Yorumları ({userComments.length})</h3>
        {userComments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Yorum yok.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {userComments.slice(0, 20).map((comment) => (
              <li key={comment._id.toString()} className="bg-surface p-3 rounded-lg border border-border">
                <p className="text-muted-foreground line-clamp-2">{comment.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(comment.date).toLocaleDateString("tr-TR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
