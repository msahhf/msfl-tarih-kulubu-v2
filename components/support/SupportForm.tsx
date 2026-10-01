"use client";

import { useActionState } from "react";
import {
  createSupportMessageAction,
  type SupportFormState,
} from "@/lib/support/actions";
import { SUPPORT_TOPICS } from "@/lib/validation/support";

const TOPIC_LABELS: Record<(typeof SUPPORT_TOPICS)[number], string> = {
  "Teknik Hata": "Teknik hata bildirimi",
  "İçerik Önerisi": "İçerik önerisi",
  "İş Birliği": "İş birliği / destek",
  "Diğer": "Diğer",
};

export default function SupportForm({
  defaultName = "",
  defaultEmail = "",
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [state, formAction, isPending] = useActionState<
    SupportFormState | null,
    FormData
  >(createSupportMessageAction, null);

  return (
    <form action={formAction} className="space-y-5" aria-describedby={state?.error ? "support-error" : undefined}>
      {state?.error && (
        <div
          id="support-error"
          role="alert"
          aria-live="assertive"
          className="p-3 text-sm bg-destructive/10 border-l-2 border-destructive text-destructive rounded-sm"
        >
          {state.error}
        </div>
      )}

      {state?.success && (
        <div
          role="status"
          aria-live="polite"
          className="p-3 text-sm bg-success/10 border-l-2 border-success text-success rounded-sm"
        >
          {state.success}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="field-label" htmlFor="support-name">
            Ad Soyad
          </label>
          <input
            id="support-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            defaultValue={defaultName}
            className="field-input"
            placeholder="Ad Soyad"
            aria-describedby={state?.error ? "support-error" : undefined}
          />
        </div>

        <div className="space-y-2">
          <label className="field-label" htmlFor="support-email">
            E-posta
          </label>
          <input
            id="support-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            defaultValue={defaultEmail}
            className="field-input"
            placeholder="ornek@email.com"
            aria-describedby={state?.error ? "support-error" : undefined}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="field-label" htmlFor="support-topic">
          Konu
        </label>
        <select
          id="support-topic"
          name="topic"
          defaultValue="Diğer"
          className="field-input"
        >
          {SUPPORT_TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {TOPIC_LABELS[topic]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="field-label" htmlFor="support-message">
          Mesaj
        </label>
        <textarea
          id="support-message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={2000}
          defaultValue=""
          className="field-input"
          placeholder="Mesajınızı buraya yazabilirsiniz…"
          aria-describedby={state?.error ? "support-error" : undefined}
        />
        <p className="text-xs text-muted-foreground">
          En az 10, en fazla 2000 karakter.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto px-8 py-3 bg-accent text-accent-foreground font-semibold border border-accent rounded-sm hover:bg-accent-strong hover:border-accent-strong transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Gönderiliyor…" : "Gönder"}
      </button>
    </form>
  );
}
