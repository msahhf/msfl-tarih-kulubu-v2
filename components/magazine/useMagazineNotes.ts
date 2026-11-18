"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicMagazineNote } from "@/types/magazine-note";

type NotesResponse = {
  ok?: boolean;
  notes?: PublicMagazineNote[];
  note?: PublicMagazineNote;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

type NotesState = {
  slug: string;
  notes: PublicMagazineNote[];
  loading: boolean;
  error: string | null;
};

export type SubmitNoteInput = {
  page: number;
  anchor: { x: number; y: number } | null;
  body: string;
  name: string;
  email: string;
  website: string;
};

export type SubmitNoteResult = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

function sortNotes(notes: PublicMagazineNote[]) {
  return [...notes].sort((a, b) => {
    if (a.page !== b.page) return a.page - b.page;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

/**
 * Dergi okuyucu notları — istemci tarafı.
 *
 * Notlar sayfa yüklendiğinde tek istekle alınır; yeni not eklendiğinde
 * liste yeniden çekilmeden yerel olarak güncellenir.
 */
export function useMagazineNotes(issueSlug: string) {
  const [state, setState] = useState<NotesState>({
    slug: issueSlug,
    notes: [],
    loading: true,
    error: null,
  });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/dergi/notlar?issue=${encodeURIComponent(issueSlug)}`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as NotesResponse;
        if (!response.ok || !payload.ok) {
          throw new Error(payload.message || "Notlar yüklenemedi.");
        }
        if (cancelled || !mountedRef.current) return;
        setState({
          slug: issueSlug,
          notes: sortNotes(payload.notes ?? []),
          loading: false,
          error: null,
        });
      })
      .catch((fetchError: unknown) => {
        if (cancelled || !mountedRef.current) return;
        setState({
          slug: issueSlug,
          notes: [],
          loading: false,
          error:
            fetchError instanceof Error
              ? fetchError.message
              : "Notlar yüklenemedi.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [issueSlug]);

  // Sayı değiştiğinde önceki sayının notları gösterilmez.
  const current = state.slug === issueSlug ? state : null;

  const submitNote = useCallback(
    async (input: SubmitNoteInput): Promise<SubmitNoteResult> => {
      try {
        const response = await fetch("/api/dergi/notlar", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({ ...input, issueSlug }),
        });

        const payload = (await response.json().catch(() => ({}))) as NotesResponse;

        if (!response.ok || !payload.ok || !payload.note) {
          return {
            ok: false,
            message: payload.message || "Notunuz kaydedilemedi.",
            fieldErrors: payload.fieldErrors,
          };
        }

        const created = payload.note;
        if (mountedRef.current) {
          setState((previous) => {
            const previousNotes =
              previous.slug === issueSlug ? previous.notes : [];
            return {
              slug: issueSlug,
              notes: sortNotes([...previousNotes, created]),
              loading: false,
              error: null,
            };
          });
        }
        return { ok: true };
      } catch {
        return {
          ok: false,
          message: "Bağlantı kurulamadı. Lütfen tekrar deneyin.",
        };
      }
    },
    [issueSlug]
  );

  return {
    notes: current?.notes ?? [],
    loading: current ? current.loading : true,
    error: current?.error ?? null,
    submitNote,
  };
}
