"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { PublicMagazineNote } from "@/types/magazine-note";
import { CloseIcon, NoteIcon } from "./icons";

export type MagazineNoteComposerTarget = {
  page: number;
};

export type MagazineNoteSubmitResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const DATE_FORMAT = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return DATE_FORMAT.format(date);
}

function groupByPage(notes: PublicMagazineNote[]) {
  const groups = new Map<number, PublicMagazineNote[]>();
  for (const note of notes) {
    const list = groups.get(note.page);
    if (list) list.push(note);
    else groups.set(note.page, [note]);
  }
  return [...groups.entries()].sort(([a], [b]) => a - b);
}

type MagazineNotesPanelProps = {
  open: boolean;
  notes: PublicMagazineNote[];
  composer: MagazineNoteComposerTarget | null;
  activeNoteId: string | null;
  /** 1 tabanlı, kullanıcının baktığı sayfa. */
  currentPage: number;
  onClose: () => void;
  onJumpToPage: (page: number) => void;
  onStartCompose: (target: MagazineNoteComposerTarget) => void;
  onCancelCompose: () => void;
  onSubmit: (input: {
    body: string;
    name: string;
    email: string;
    website: string;
  }) => Promise<MagazineNoteSubmitResult>;
};

export function MagazineNotesPanel({
  open,
  notes,
  composer,
  activeNoteId,
  currentPage,
  onClose,
  onJumpToPage,
  onStartCompose,
  onCancelCompose,
  onSubmit,
}: MagazineNotesPanelProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const activeRef = useRef<HTMLLIElement>(null);

  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);

  // Yazma alanına odaklan (form durumu, panel `key` ile sıfırlanır).
  useEffect(() => {
    if (!composer) return;
    const frame = requestAnimationFrame(() => bodyRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [composer]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      if (composer) return;
      if (activeRef.current) {
        activeRef.current.scrollIntoView({ block: "center" });
      } else closeRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open, composer, activeNoteId]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      if (composer) onCancelCompose();
      else onClose();
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [composer, onCancelCompose, onClose, open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  const groups = groupByPage(notes);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    setError(null);
    setFieldErrors({});

    if (body.trim().length < 3) {
      setFieldErrors({ body: ["Yorum en az 3 karakter olmalıdır."] });
      bodyRef.current?.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldErrors({ email: ["Geçerli bir e-posta adresi giriniz."] });
      return;
    }

    setSending(true);
    try {
      const result = await onSubmit({
        body: body.trim(),
        name: name.trim(),
        email: email.trim(),
        website,
      });

      if (!result.ok) {
        setError(result.message ?? "Notunuz kaydedilemedi.");
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        return;
      }

      setBody("");
      setWebsite("");
      setSaved(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="magazine-notes"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="magazine-notes__panel">
        <div className="magazine-notes__header">
          <div className="min-w-0">
            <p className="magazine-notes__eyebrow">
              {composer ? `Sayfa ${composer.page}` : "Okuyucu notları"}
            </p>
            <h2
              id={titleId}
              className="truncate font-display text-xl font-bold text-foreground"
            >
              {composer ? "Sayfaya not" : `Notlar (${notes.length})`}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="magazine-icon-button shrink-0"
            onClick={composer ? onCancelCompose : onClose}
            aria-label={composer ? "Not yazmayı iptal et" : "Notları kapat"}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {composer ? (
          <form className="magazine-notes__form" onSubmit={handleSubmit} noValidate>
            {error && (
              <p className="magazine-notes__alert" role="alert">
                {error}
              </p>
            )}

            {saved && (
              <p className="magazine-notes__success" role="status">
                Notunuz yayımlandı. Teşekkürler!
              </p>
            )}

            <div className="space-y-2">
              <label htmlFor="magazine-note-body" className="field-label">
                Notunuz
              </label>
              <textarea
                ref={bodyRef}
                id="magazine-note-body"
                name="body"
                rows={5}
                maxLength={800}
                value={body}
                onChange={(event) => {
                  setBody(event.target.value);
                  setSaved(false);
                }}
                className="field-input resize-y"
                placeholder="Bu sayfa hakkındaki düşüncenizi yazın…"
                aria-invalid={fieldErrors.body ? true : undefined}
                aria-describedby={
                  fieldErrors.body ? "magazine-note-body-error" : undefined
                }
              />
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  {body.length}/800
                </p>
                {fieldErrors.body && (
                  <p
                    id="magazine-note-body-error"
                    className="text-xs font-semibold text-destructive"
                  >
                    {fieldErrors.body[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="magazine-note-name" className="field-label">
                  İsim{" "}
                  <span className="normal-case tracking-normal">
                    (isteğe bağlı)
                  </span>
                </label>
                <input
                  id="magazine-note-name"
                  name="name"
                  type="text"
                  maxLength={40}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="field-input"
                  placeholder="Anonim"
                  autoComplete="nickname"
                  aria-invalid={fieldErrors.name ? true : undefined}
                />
                {fieldErrors.name && (
                  <p className="text-xs font-semibold text-destructive">
                    {fieldErrors.name[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="magazine-note-email" className="field-label">
                  E-posta <span className="text-accent">*</span>
                </label>
                <input
                  id="magazine-note-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="field-input"
                  placeholder="ornek@email.com"
                  autoComplete="email"
                  aria-invalid={fieldErrors.email ? true : undefined}
                  aria-describedby="magazine-note-email-help"
                />
                {fieldErrors.email && (
                  <p className="text-xs font-semibold text-destructive">
                    {fieldErrors.email[0]}
                  </p>
                )}
              </div>
            </div>

            <p id="magazine-note-email-help" className="magazine-notes__help">
              E-posta adresiniz{" "}
              <strong className="text-foreground">yayımlanmaz</strong>.
              {name.trim().length === 0 &&
                " İsim girmezseniz notunuz “Anonim” olarak görünür."}
            </p>

            {/* Bot tuzağı — ekran okuyuculardan ve kullanıcıdan gizli. */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="magazine-note-website">Website</label>
              <input
                id="magazine-note-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>

            <div className="magazine-notes__actions">
              <button
                type="button"
                className="magazine-note-button magazine-note-button--ghost"
                onClick={onCancelCompose}
                disabled={sending}
              >
                {saved ? "Kapat" : "Vazgeç"}
              </button>
              {!saved && (
                <button
                  type="submit"
                  className="magazine-note-button magazine-note-button--solid"
                  disabled={sending}
                >
                  {sending ? "Gönderiliyor…" : "Notu gönder"}
                </button>
              )}
            </div>
          </form>
        ) : (
          <>
            <div className="magazine-notes__list">
              {notes.length === 0 ? (
                <div className="magazine-notes__empty">
                  <span className="magazine-notes__empty-icon">
                    <NoteIcon className="h-5 w-5" />
                  </span>
                  <p className="font-display text-lg font-bold text-foreground">
                    Henüz not yok
                  </p>
                  <p className="max-w-[22rem] text-sm leading-relaxed text-muted-foreground">
                    İlk notu siz bırakın. Sayfa hakkındaki düşüncenizi
                    yazabilirsiniz.
                  </p>
                </div>
              ) : (
                groups.map(([page, pageNotes]) => (
                  <section key={page} className="magazine-notes__group">
                    <button
                      type="button"
                      className="magazine-notes__group-title"
                      onClick={() => onJumpToPage(page)}
                    >
                      <span>Sayfa {page}</span>
                      <span className="magazine-notes__group-count">
                        {pageNotes.length}
                      </span>
                    </button>

                    <ul className="space-y-3">
                      {pageNotes.map((note) => {
                        const isActive = note.id === activeNoteId;
                        return (
                          <li
                            key={note.id}
                            ref={isActive ? activeRef : undefined}
                            className={`magazine-note-item ${
                              isActive ? "is-active" : ""
                            }`}
                          >
                            <div className="magazine-note-item__meta">
                              <span className="magazine-note-item__author">
                                {note.name ?? "Anonim"}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{formatDate(note.createdAt)}</span>
                            </div>
                            <p className="magazine-note-item__body whitespace-pre-line">
                              {note.body}
                            </p>
                            <button
                              type="button"
                              className="magazine-note-item__jump"
                              onClick={() => onJumpToPage(note.page)}
                            >
                              Sayfaya git
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))
              )}
            </div>

            <div className="magazine-notes__footer">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Notlar anonim yayımlanır. İsim yazarsanız yalnızca o görünür;
                e-posta adresiniz hiçbir zaman gösterilmez.
              </p>
              <button
                type="button"
                className="magazine-note-button magazine-note-button--solid w-full"
                onClick={() => onStartCompose({ page: currentPage })}
              >
                <NoteIcon className="h-4 w-4" />
                Bu sayfaya not bırak
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
