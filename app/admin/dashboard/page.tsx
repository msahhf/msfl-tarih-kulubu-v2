import Link from "next/link";
import { userRepository, postRepository, commentRepository, supportMessageRepository } from "@/lib/db/repositories";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const [userCount, blogCount, commentCount] = await Promise.all([
    userRepository.countUsers(),
    postRepository.countPosts(),
    commentRepository.countComments(),
  ]);
  const unreadSupport = await supportMessageRepository.countMessages({ status: "new" });

  const [recentBlogs, recentUsers] = await Promise.all([
    postRepository.findRecent(5),
    userRepository.findFiltered({ sort: "new" }).then((users) => users.slice(0, 5)),
  ]);

  const stats = [
    { label: "Kullanıcı", value: userCount, href: "/admin/kullanicilar" },
    { label: "Blog Yazısı", value: blogCount, href: "/admin/bloglar" },
    { label: "Yorum", value: commentCount, href: "/admin/yorumlar" },
    { label: "Okunmamış Destek", value: unreadSupport, href: "/admin/destek" },
  ];

  return (
    <div className="space-y-10">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-surface p-6 rounded-xl border border-border space-y-1 hover:shadow-md transition-shadow"
          >
            <p className="text-3xl font-display font-bold text-accent">{stat.value}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-surface p-6 rounded-xl border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold">Son Blog Yazıları</h2>
            <Link href="/admin/bloglar" className="text-xs font-semibold text-accent hover:underline">
              Tümü →
            </Link>
          </div>
          {recentBlogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz yazı yok.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {recentBlogs.map((post) => (
                <li key={post._id.toString()} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      @{post.username} • {new Date(post.date).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${post._id.toString()}`}
                    className="text-xs font-semibold text-accent hover:underline whitespace-nowrap"
                  >
                    Görüntüle
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-surface p-6 rounded-xl border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold">Son Kullanıcılar</h2>
            <Link href="/admin/kullanicilar" className="text-xs font-semibold text-accent hover:underline">
              Tümü →
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz kullanıcı yok.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {recentUsers.map((user) => (
                <li key={user._id.toString()} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">@{user.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email} • {new Date(user.date).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <Link
                    href={`/admin/kullanici/${user._id.toString()}`}
                    className="text-xs font-semibold text-accent hover:underline whitespace-nowrap"
                  >
                    İncele
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
