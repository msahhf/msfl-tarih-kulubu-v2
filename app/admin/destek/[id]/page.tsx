import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { supportMessageRepository } from "@/lib/db/repositories";
import { adminMarkSupportReadAction } from "@/lib/admin/actions";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function AdminDestekDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;

  let message = null;
  try {
    message = await supportMessageRepository.findById(id);
  } catch {
    redirect("/admin/destek");
  }
  if (!message) {
    notFound();
  }

  // Legacy parity: unread message is marked read on view.
  if (message.status === "new") {
    await supportMessageRepository.updateStatus(id, { status: "read" });
    message = (await supportMessageRepository.findById(id)) ?? message;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/admin/destek" className="text-sm font-semibold text-accent hover:underline">
          ← Mesajlara Dön
        </Link>
        <h2 className="text-xl font-display font-bold mt-2">
          {message.name || "İsimsiz"} — {message.topic}
        </h2>
        <p className="text-sm text-muted-foreground">
          {message.email} • Durum:{" "}
          <span className="uppercase font-semibold text-accent">{message.status}</span>
        </p>
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

      <div className="bg-surface p-6 rounded-xl border border-border">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
      </div>

      <form action={adminMarkSupportReadAction} className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <input type="hidden" name="messageId" value={id} />
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium leading-none">
            Durum
          </label>
          <select
            id="status"
            name="status"
            defaultValue={message.status}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="new">new</option>
            <option value="read">read</option>
            <option value="archived">archived</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          Durumu Güncelle
        </button>
      </form>
    </div>
  );
}
