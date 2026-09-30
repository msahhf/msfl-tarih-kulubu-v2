"use client";

import { useState } from "react";

interface EditorEvent {
  year: string | number;
  title: string;
  description: string;
}

const inputClass =
  "w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent";

export function TarihteBugunEditor({
  initialEvents,
}: {
  initialEvents: EditorEvent[];
}) {
  const [events, setEvents] = useState<EditorEvent[]>(
    [0, 1, 2].map((i) => ({
      year: String(initialEvents[i]?.year ?? ""),
      title: initialEvents[i]?.title ?? "",
      description: initialEvents[i]?.description ?? "",
    }))
  );

  function update(index: number, field: keyof EditorEvent, value: string) {
    setEvents((prev) =>
      prev.map((event, i) => (i === index ? { ...event, [field]: value } : event))
    );
  }

  const serialized = JSON.stringify(
    events.map((e) => {
      const yearNum = Number(String(e.year).trim());
      return {
        year: e.year !== "" && Number.isFinite(yearNum) ? yearNum : e.year,
        title: e.title,
        description: e.description,
      };
    })
  );

  return (
    <div className="space-y-6">
      <input type="hidden" name="events" value={serialized} />
      {events.map((event, i) => (
        <fieldset key={i} className="space-y-3 border border-border rounded-lg p-4">
          <legend className="text-sm font-semibold px-2">Olay {i + 1}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <label htmlFor={`tb-year-${i}`} className="text-xs font-medium">
                Yıl
              </label>
              <input
                id={`tb-year-${i}`}
                value={String(event.year)}
                onChange={(e) => update(i, "year", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor={`tb-title-${i}`} className="text-xs font-medium">
                Başlık
              </label>
              <input
                id={`tb-title-${i}`}
                value={event.title}
                onChange={(e) => update(i, "title", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor={`tb-desc-${i}`} className="text-xs font-medium">
              Açıklama
            </label>
            <textarea
              id={`tb-desc-${i}`}
              rows={3}
              value={event.description}
              onChange={(e) => update(i, "description", e.target.value)}
              className={inputClass}
            />
          </div>
        </fieldset>
      ))}
    </div>
  );
}
