import Link from "next/link";
import { userRepository } from "@/lib/db/repositories";

interface Props {
  searchParams: Promise<{
    q?: string;
    role?: string;
    period?: string;
    sort?: string;
    success?: string;
    error?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const query = await searchParams;

  const users = await userRepository.findFiltered({
    q: query.q || undefined,
    role: query.role || undefined,
    period: query.period || undefined,
    sort: query.sort || undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold">Kullanıcılar ({users.length})</h2>
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

      <form method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-surface p-4 rounded-xl border border-border">
        <input
          type="search"
          name="q"
          defaultValue={query.q || ""}
          placeholder="Ad, kullanıcı adı, e-posta ara…"
          className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <select
          name="role"
          defaultValue={query.role || ""}
          className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Tüm roller</option>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
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
            <option value="name">Ada göre</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Filtrele
          </button>
        </div>
      </form>

      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground">Kullanıcı bulunamadı.</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user._id.toString()}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-border"
            >
              <div className="min-w-0 text-sm">
                <p className="font-semibold">
                  @{user.username}{" "}
                  <span className="ml-2 text-[11px] uppercase tracking-wider text-accent font-bold">
                    {user.role}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.name} {user.surname} • {user.email} •{" "}
                  {new Date(user.date).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <Link
                href={`/admin/kullanici/${user._id.toString()}`}
                className="text-xs font-semibold text-accent hover:underline whitespace-nowrap"
              >
                İncele →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
