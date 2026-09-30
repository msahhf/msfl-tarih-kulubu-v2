import Link from "next/link";
import { supportMessageRepository } from "@/lib/db/repositories";

interface Props {
  searchParams: Promise<{
    q?: string;
    topic?: string;
    status?: string;
    success?: string;
    error?: string;
  }>;
}

export default async function AdminDestekPage({ searchParams }: Props) {
  const query = await searchParams;

  const messages = await supportMessageRepository.findFiltered({
    q: query.q || undefined,
    topic: query.topic || undefined,
    status: query.status || undefined,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display font-bold">Destek Mesajları ({messages.length})</h2>

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
          placeholder="İsim, e-posta, mesaj ara…"
          className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <input
          type="search"
          name="topic"
          defaultValue={query.topic || ""}
          placeholder="Konu…"
          className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <select
          name="status"
          defaultValue={query.status || ""}
          className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Tüm durumlar</option>
          <option value="new">new</option>
          <option value="read">read</option>
          <option value="archived">archived</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Filtrele
        </button>
      </form>

      {messages.length === 0 ? (
        <p className="text-sm text-muted-foreground">Mesaj bulunamadı.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((message) => (
            <li
              key={message._id.toString()}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-border"
            >
              <div className="min-w-0 text-sm">
                <p className="font-semibold">
                  {message.name || message.email}{" "}
                  <span className="ml-2 text-[11px] uppercase tracking-wider text-accent font-bold">
                    {message.status}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {message.topic} • {message.message.slice(0, 80)}
                </p>
              </div>
              <Link
                href={`/admin/destek/${message._id.toString()}`}
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
