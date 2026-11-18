"use client";

import { useEffect, useRef, useState } from "react";
import type { PageFlipOrientation } from "page-flip";
import { CloseIcon } from "./icons";

type ThumbnailProps = {
  index: number;
  ratio: number;
  active: boolean;
  renderThumbnail: (pageIndex: number) => Promise<string>;
  onSelect: (page: number) => void;
};

function Thumbnail({
  index,
  ratio,
  active,
  renderThumbnail,
  onSelect,
}: ThumbnailProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (src || failed) return;
    const element = buttonRef.current;
    if (!element) return;

    let cancelled = false;

    const load = () => {
      renderThumbnail(index)
        .then((url) => {
          if (!cancelled) setSrc(url);
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    };

    if (typeof IntersectionObserver === "undefined") {
      load();
      return;
    }

    const scrollRoot = element.closest(".magazine-thumbs__grid");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      {
        root: scrollRoot instanceof HTMLElement ? scrollRoot : null,
        rootMargin: "320px",
      }
    );

    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [failed, index, renderThumbnail, src]);

  return (
    <button
      ref={buttonRef}
      type="button"
      className="magazine-thumb"
      onClick={() => onSelect(index + 1)}
      aria-current={active ? "page" : undefined}
      aria-label={`Sayfa ${index + 1}`}
    >
      <span
        className="magazine-thumb__frame"
        style={{ aspectRatio: String(ratio || 0.707) }}
      >
        {src ? (
          // Blob URL'leri PDF.js tarafından üretilir; next/image optimizasyonu uygun değil.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="magazine-thumb__placeholder" aria-hidden="true">
            {failed ? "!" : index + 1}
          </span>
        )}
      </span>
      <span className="magazine-thumb__label">{index + 1}</span>
    </button>
  );
}

type MagazineThumbnailsProps = {
  open: boolean;
  pageCount: number;
  ratio: number;
  currentPage: number;
  orientation: PageFlipOrientation;
  onSelect: (page: number) => void;
  onClose: () => void;
  renderThumbnail: (pageIndex: number) => Promise<string>;
};

export function MagazineThumbnails({
  open,
  pageCount,
  ratio,
  currentPage,
  orientation,
  onSelect,
  onClose,
  renderThumbnail,
}: MagazineThumbnailsProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const activePages = new Set<number>();
  if (orientation === "portrait") {
    activePages.add(currentPage);
  } else {
    activePages.add(currentPage);
    if (currentPage + 1 < pageCount) activePages.add(currentPage + 1);
  }

  return (
    <div
      className="magazine-thumbs"
      role="dialog"
      aria-modal="true"
      aria-label="Sayfa küçük resimleri"
    >
      <div className="magazine-thumbs__panel">
        <div className="magazine-thumbs__header">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold-bright">
              Dergi içinde
            </p>
            <h2 className="font-display text-xl font-bold text-accent-foreground">
              Sayfalar
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="magazine-icon-button magazine-icon-button--dark"
            onClick={onClose}
            aria-label="Sayfa listesini kapat"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="magazine-thumbs__grid">
          {Array.from({ length: pageCount }, (_, index) => (
            <Thumbnail
              key={index}
              index={index}
              ratio={ratio}
              active={activePages.has(index)}
              renderThumbnail={renderThumbnail}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
