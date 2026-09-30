import { tarihteBugunRepository } from "@/lib/db/repositories";
import {
  adminUpdateTarihteBugunAction,
  adminRegenerateTarihteBugunAction,
} from "@/lib/admin/actions";
import { TarihteBugunEditor } from "@/components/admin/TarihteBugunEditor";

interface Props {
  searchParams: Promise<{ success?: string; error?: string }>;
}

function todayKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

export default async function AdminTarihteBugunPage({ searchParams }: Props) {
  const query = await searchParams;
  const dateKey = todayKey();

  const entry = await tarihteBugunRepository.findByDateKey(dateKey);
  const events = entry?.events ?? [
    { year: "", title: "", description: "" },
    { year: "", title: "", description: "" },
    { year: "", title: "", description: "" },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold">Tarihte Bugün ({dateKey})</h2>
          <p className="text-sm text-muted-foreground">
            {entry
              ? `Üretim: ${entry.generatedBy} • ${new Date(entry.generatedAt).toLocaleString("tr-TR")}${entry.editedByAdmin && entry.editedAt ? ` • Admin düzenlemesi: ${new Date(entry.editedAt).toLocaleString("tr-TR")}` : ""}`
              : "Bugün için henüz kayıt yok."}
          </p>
        </div>
        <form action={adminRegenerateTarihteBugunAction}>
          <input type="hidden" name="dateKey" value={dateKey} />
          <button
            type="submit"
            className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            AI ile Yeniden Oluştur
          </button>
        </form>
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

      <section className="bg-surface p-6 rounded-xl border border-border space-y-6">
        <h3 className="font-display font-bold">Olayları Düzenle</h3>
        <form action={adminUpdateTarihteBugunAction} className="space-y-6">
          <input type="hidden" name="dateKey" value={dateKey} />
          <TarihteBugunEditor
            initialEvents={events.map((e) => ({
              year: e.year,
              title: e.title,
              description: e.description,
            }))}
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            İçeriği Kaydet
          </button>
        </form>
        <p className="text-xs text-muted-foreground">
          Not: manuel düzenleme AI&apos;ın ilk çıktısını silmez;{" "}
          <code>originalAIContent</code> korunur.
        </p>
      </section>

      {entry?.originalAIContent && (
        <section className="bg-surface p-6 rounded-xl border border-border space-y-3">
          <h3 className="font-display font-bold">AI Orijinal Çıktısı (korunur)</h3>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap max-h-64 overflow-auto bg-background p-4 rounded-lg border border-border">
            {entry.originalAIContent}
          </pre>
        </section>
      )}

      {entry?.history && entry.history.length > 0 && (
        <section className="bg-surface p-6 rounded-xl border border-border space-y-4">
          <h3 className="font-display font-bold">
            Üretim Geçmişi ({entry.history.length})
          </h3>
          <ul className="space-y-4">
            {entry.history.map((gen, i) => (
              <li key={i} className="border border-border rounded-lg p-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Üretim #{entry.history!.length - i} • {gen.generatedBy} •{" "}
                  {new Date(gen.generatedAt).toLocaleString("tr-TR")}
                </p>
                <ul className="space-y-1 text-sm">
                  {gen.events.map((e, j) => (
                    <li key={j}>
                      <span className="font-semibold">{String(e.year)}</span> — {e.title}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
