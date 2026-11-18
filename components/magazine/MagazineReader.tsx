"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { PageFlip, PageFlipOrientation } from "page-flip";
import type { MagazineIssue } from "@/content/magazine";
import type { PublicMagazineNote } from "@/types/magazine-note";
import {
  formatSpreadLabel,
  getNextSpreadStart,
  getPrevSpreadStart,
  getSpreadPages,
  getSpreadStart,
  type SpreadLayout,
} from "@/lib/magazine/spreads";
import { usePdfDocument } from "./usePdfDocument";
import { useMagazineNotes } from "./useMagazineNotes";
import { MagazineThumbnails } from "./MagazineThumbnails";
import {
  MagazineNotesPanel,
  type MagazineNoteComposerTarget,
  type MagazineNoteSubmitResult,
} from "./MagazineNotesPanel";
import {
  AlertIcon,
  BookIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ContractIcon,
  ExpandIcon,
  FitIcon,
  MarkerIcon,
  NoteIcon,
  PagesIcon,
  PinIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "./icons";

type PageCacheEntry = {
  url: string;
  pixelWidth: number;
  cssWidth: number;
};

type PendingRender = {
  cssWidth: number;
  version: number;
  promise: Promise<void>;
};

const LANDSCAPE_BREAKPOINT = 820;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;
const MAX_CACHED_PAGES = 14;

/** Kitap düzeninde kapak tek başına gösterilir, sonra çiftler gelir. */
const SHOW_COVER = true;

function scheduleIdle(task: () => void) {
  if (typeof window === "undefined") return;

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(task, { timeout: 1200 });
  } else {
    setTimeout(task, 80);
  }
}

function isCancelledRender(error: unknown) {
  return error instanceof Error && error.name === "RenderingCancelledException";
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
  variant = "light",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "light" | "dark";
}) {
  return (
    <button
      type="button"
      className={`magazine-icon-button ${
        variant === "dark" ? "magazine-icon-button--dark" : ""
      }`}
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function ReaderLoading({ progress }: { progress: number | null }) {
  return (
    <div className="magazine-reader__state" role="status" aria-live="polite">
      <div className="magazine-loading-book" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="space-y-2 text-center">
        <p className="font-display text-xl font-bold text-accent-foreground">
          Dergi hazırlanıyor
        </p>
        <p className="text-sm text-accent-foreground/60">
          Sayfalar yüklendiğinde görüntüleyici açılacak.
        </p>
      </div>
      <div
        className={`magazine-progress ${
          progress === null ? "magazine-progress--indeterminate" : ""
        }`}
        aria-hidden="true"
      >
        <span
          style={{
            width:
              progress === null
                ? undefined
                : `${Math.max(4, Math.round(progress * 100))}%`,
          }}
        />
      </div>
      {progress !== null && (
        <span className="text-xs tabular-nums text-gold-bright">
          %{Math.round(progress * 100)}
        </span>
      )}
    </div>
  );
}

function ReaderError({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="magazine-reader__state" role="alert">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10 text-destructive">
        <AlertIcon className="h-7 w-7" />
      </span>
      <div className="max-w-md space-y-2 text-center">
        <p className="font-display text-xl font-bold text-accent-foreground">
          {title}
        </p>
        <p className="text-sm leading-relaxed text-accent-foreground/65">
          {message || "Beklenmeyen bir hata oluştu."}
        </p>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-2 border border-gold-bright bg-gold-bright px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-transparent hover:text-gold-bright"
        onClick={onRetry}
      >
        Tekrar dene
      </button>
    </div>
  );
}

type PageNoteOverlayProps = {
  page: number;
  notes: PublicMagazineNote[];
  activeNoteId: string | null;
  hoveredNoteId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (note: PublicMagazineNote) => void;
};

/**
 * Bir sayfanın üzerine düşen not iğneleri ve sayfa notu rozeti.
 *
 * Sayfa çerçevesinin içine portal ile çizilir; böylece sayfa çevrilirken,
 * yakınlaştırılırken veya yeniden boyutlanırken iğneler sayfayla birlikte
 * hareket eder (ekran koordinatı hesaplamak gerekmez).
 */
function PageNoteOverlay({
  page,
  notes,
  activeNoteId,
  hoveredNoteId,
  onHover,
  onSelect,
}: PageNoteOverlayProps) {
  const anchored = notes.filter((note) => note.anchor);
  const pageNotes = notes.filter((note) => !note.anchor);

  if (!anchored.length && !pageNotes.length) return null;

  return (
    <div className="magazine-note-layer">
      {anchored.map((note, position) => (
        <button
          key={note.id}
          type="button"
          className={`magazine-note-marker ${
            note.id === activeNoteId || note.id === hoveredNoteId
              ? "is-active"
              : ""
          }`}
          style={{
            left: `${(note.anchor?.x ?? 0) * 100}%`,
            top: `${(note.anchor?.y ?? 0) * 100}%`,
          }}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(note);
          }}
          onMouseEnter={() => onHover(note.id)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(note.id)}
          onBlur={() => onHover(null)}
          title={`${note.name ?? "Anonim"}: ${note.body.slice(0, 120)}`}
          aria-label={`Sayfa ${page} üzerindeki not ${position + 1}: ${
            note.name ?? "Anonim"
          }`}
        >
          <PinIcon className="h-3.5 w-3.5" />
        </button>
      ))}

      {pageNotes.length > 0 && (
        <button
          type="button"
          className="magazine-note-badge"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(pageNotes[0]);
          }}
          title={`Bu sayfada ${pageNotes.length} not var`}
        >
          <NoteIcon className="h-3.5 w-3.5" />
          {pageNotes.length}
        </button>
      )}
    </div>
  );
}

export function MagazineReader({ issue }: { issue: MagazineIssue }) {
  const {
    status,
    progress,
    pageCount,
    ratio,
    error,
    documentId,
    reload,
    renderPage,
    renderThumbnail,
  } = usePdfDocument(issue.pdfUrl);

  const [layoutMode, setLayoutMode] = useState<PageFlipOrientation | null>(null);
  const [orientation, setOrientation] =
    useState<PageFlipOrientation>("portrait");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInput, setPageInput] = useState("1");
  const [viewerReady, setViewerReady] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [thumbsOpen, setThumbsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cssFullscreen, setCssFullscreen] = useState(false);

  // Okuyucu notları
  const { notes, submitNote } = useMagazineNotes(issue.slug);
  const [notesOpen, setNotesOpen] = useState(false);
  const [composer, setComposer] = useState<MagazineNoteComposerTarget | null>(
    null
  );
  const [marking, setMarking] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [pageFrames, setPageFrames] = useState<HTMLDivElement[]>([]);
  const [markSurface, setMarkSurface] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  // Portallar yalnızca istemcide çizilir; SSR ile hydration uyuşmazlığı olmaz.
  const portalReady = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const overlayLayerRef = useRef<HTMLDivElement>(null);
  const markerLayerRef = useRef<HTMLDivElement>(null);
  const overlaySyncRef = useRef<() => void>(() => undefined);
  const markingRef = useRef(false);

  const pageElsRef = useRef<HTMLDivElement[]>([]);
  const imgElsRef = useRef<HTMLImageElement[]>([]);
  const pageCacheRef = useRef(new Map<number, PageCacheEntry>());
  const pendingRenderRef = useRef(new Map<number, PendingRender>());
  const paintTokenRef = useRef(new Map<number, number>());
  const garbageUrlsRef = useRef<string[]>([]);

  const pageWidthRef = useRef(0);
  const ratioRef = useRef(0);
  const pageCountRef = useRef(0);
  const currentPageRef = useRef(0);
  const orientationRef = useRef<PageFlipOrientation>("portrait");
  const layoutModeRef = useRef<PageFlipOrientation>("portrait");
  const zoomRef = useRef(1);
  const renderVersionRef = useRef(0);
  const flippingRef = useRef(false);
  const navigationRef = useRef(false);
  const mountedRef = useRef(true);

  const immersive = isFullscreen || cssFullscreen;
  const issueLabel = `Sayı ${issue.issueNumber}`;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    markingRef.current = marking;
  }, [marking]);

  useEffect(() => {
    orientationRef.current = orientation;
  }, [orientation]);

  useEffect(() => {
    ratioRef.current = ratio;
  }, [ratio]);

  useEffect(() => {
    pageCountRef.current = pageCount;
  }, [pageCount]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const flushGarbage = useCallback(() => {
    if (flippingRef.current) return;
    const urls = garbageUrlsRef.current;
    garbageUrlsRef.current = [];
    for (const url of urls) URL.revokeObjectURL(url);
  }, []);

  const clearPageCache = useCallback(() => {
    for (const entry of pageCacheRef.current.values()) {
      URL.revokeObjectURL(entry.url);
    }
    pageCacheRef.current.clear();

    const garbage = garbageUrlsRef.current;
    garbageUrlsRef.current = [];
    for (const url of garbage) URL.revokeObjectURL(url);

    pendingRenderRef.current.clear();
    paintTokenRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      clearPageCache();
      for (const url of garbageUrlsRef.current) URL.revokeObjectURL(url);
      garbageUrlsRef.current = [];
    };
  }, [clearPageCache]);

  const paintPage = useCallback((index: number, url: string) => {
    return new Promise<void>((resolve) => {
      const image = imgElsRef.current[index];
      if (!image) {
        resolve();
        return;
      }

      const token = (paintTokenRef.current.get(index) || 0) + 1;
      paintTokenRef.current.set(index, token);

      const preloader = new Image();
      preloader.decoding = "async";
      preloader.onload = () => {
        if (paintTokenRef.current.get(index) !== token || !image.isConnected) {
          resolve();
          return;
        }

        image.src = url;
        image.classList.add("is-loaded");
        pageElsRef.current[index]?.classList.remove("is-error");
        resolve();
      };
      preloader.onerror = () => {
        if (paintTokenRef.current.get(index) !== token) {
          resolve();
          return;
        }

        const pageElement = pageElsRef.current[index];
        pageElement?.classList.add("is-error");
        const hint = pageElement?.querySelector<HTMLElement>(
          ".magazine-page__hint"
        );
        if (hint) hint.textContent = "Sayfa görüntülenemedi";
        resolve();
      };
      preloader.src = url;
    });
  }, []);

  const markPageError = useCallback((index: number) => {
    const pageElement = pageElsRef.current[index];
    pageElement?.classList.add("is-error");
    const hint = pageElement?.querySelector<HTMLElement>(
      ".magazine-page__hint"
    );
    if (hint) hint.textContent = "Sayfa görüntülenemedi";
  }, []);

  const ensurePageRef = useRef<(index: number) => Promise<void>>(
    async () => undefined
  );

  const ensurePage = useCallback(
    async (index: number): Promise<void> => {
      if (!mountedRef.current) return;
      if (index < 0 || index >= pageCountRef.current) return;

      const cssWidth = pageWidthRef.current;
      if (cssWidth <= 0) return;

      const cached = pageCacheRef.current.get(index);
      if (cached && cached.cssWidth >= cssWidth * 0.98) {
        const image = imgElsRef.current[index];
        if (image && image.getAttribute("src") !== cached.url) {
          await paintPage(index, cached.url);
        }
        return;
      }

      const pending = pendingRenderRef.current.get(index);
      if (pending && pending.cssWidth >= cssWidth * 0.98) {
        await pending.promise;
        return;
      }

      const version = renderVersionRef.current;
      let finish: () => void = () => undefined;
      const promise = new Promise<void>((resolve) => {
        finish = resolve;
      });
      const pendingEntry: PendingRender = { cssWidth, version, promise };
      pendingRenderRef.current.set(index, pendingEntry);

      try {
        const result = await renderPage(index, cssWidth);
        if (!result) return;

        if (!mountedRef.current || version !== renderVersionRef.current) {
          URL.revokeObjectURL(result.url);
          return;
        }

        const previous = pageCacheRef.current.get(index);
        pageCacheRef.current.set(index, {
          url: result.url,
          pixelWidth: result.width,
          cssWidth,
        });

        await paintPage(index, result.url);

        if (previous && previous.url !== result.url) {
          garbageUrlsRef.current.push(previous.url);
          flushGarbage();
        }
      } catch (renderError) {
        if (!isCancelledRender(renderError)) {
          console.error(`Dergi sayfası ${index + 1} oluşturulamadı:`, renderError);
          markPageError(index);
        }
      } finally {
        if (pendingRenderRef.current.get(index) === pendingEntry) {
          pendingRenderRef.current.delete(index);
        }
        finish();

        if (
          mountedRef.current &&
          version === renderVersionRef.current &&
          pageWidthRef.current > cssWidth * 1.05
        ) {
          void ensurePageRef.current(index);
        }
      }
    },
    [flushGarbage, markPageError, paintPage, renderPage]
  );

  useEffect(() => {
    ensurePageRef.current = ensurePage;
  }, [ensurePage]);

  const pruneCache = useCallback(() => {
    if (flippingRef.current) return;
    flushGarbage();

    const cache = pageCacheRef.current;
    if (cache.size <= MAX_CACHED_PAGES) return;

    const center = currentPageRef.current;
    const keep = new Set<number>();
    for (let index = center - 4; index <= center + 5; index += 1) {
      keep.add(index);
    }

    for (const [index, entry] of cache) {
      if (keep.has(index)) continue;
      URL.revokeObjectURL(entry.url);
      cache.delete(index);
    }
  }, [flushGarbage]);

  const getLayout = useCallback(
    (): SpreadLayout => ({
      portrait: orientationRef.current === "portrait",
      showCover: SHOW_COVER,
    }),
    []
  );

  const syncWindow = useCallback(
    (center = currentPageRef.current) => {
      const count = pageCountRef.current;
      if (!count) return;

      const visible = new Set<number>(
        getSpreadPages(center, count, getLayout())
      );
      if (!visible.size) visible.add(center);

      for (const index of visible) {
        void ensurePageRef.current(index);
      }

      const prefetch = new Set<number>();
      for (const index of visible) {
        for (let distance = -2; distance <= 3; distance += 1) {
          const candidate = index + distance;
          if (candidate >= 0 && candidate < count) prefetch.add(candidate);
        }
      }

      const rest = [...prefetch].filter((index) => !visible.has(index));
      if (rest.length) {
        scheduleIdle(() => {
          for (const index of rest) {
            void ensurePageRef.current(index);
          }
        });
      }

      pruneCache();
    },
    [getLayout, pruneCache]
  );

  const getBookSize = useCallback(() => {
    const stage = stageRef.current;
    const pageRatio = ratioRef.current;
    if (!stage || pageRatio <= 0) {
      return { pageWidth: 0, hostWidth: 0 };
    }

    const availableWidth = Math.max(180, stage.clientWidth * 0.92);
    const availableHeight = Math.max(180, stage.clientHeight * 0.9);
    const basePageWidth =
      layoutModeRef.current === "portrait"
        ? Math.min(availableWidth, availableHeight * pageRatio)
        : Math.min(availableWidth / 2, availableHeight * pageRatio);

    const pageWidth = basePageWidth * zoomRef.current;
    return {
      pageWidth,
      hostWidth:
        pageWidth * (layoutModeRef.current === "portrait" ? 1 : 2),
    };
  }, []);

  const applySize = useCallback(() => {
    const host = hostRef.current;
    const flip = flipRef.current;
    const size = getBookSize();
    if (!host || size.hostWidth <= 0) return;

    const changed = Math.abs(size.pageWidth - pageWidthRef.current) > 0.5;
    pageWidthRef.current = size.pageWidth;
    if (changed) renderVersionRef.current += 1;

    host.style.width = `${Math.round(size.hostWidth)}px`;
    host.style.minWidth = "0px";
    host.style.maxWidth = "none";

    if (flip) flip.update();
  }, [getBookSize]);

  const centerScroll = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    if (stage.scrollWidth > stage.clientWidth) {
      stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
    }
    if (stage.scrollHeight > stage.clientHeight) {
      stage.scrollTop = (stage.scrollHeight - stage.clientHeight) / 2;
    }
  }, []);

  const goToPage = useCallback(
    async (humanPage: number) => {
      const flip = flipRef.current;
      const count = pageCountRef.current;
      if (!flip || !count) return;

      const target = Math.min(count, Math.max(1, Math.round(humanPage)));
      const targetIndex = target - 1;
      const layout = getLayout();
      const spreadStart = getSpreadStart(targetIndex, layout);
      const targets = getSpreadPages(spreadStart, count, layout);

      await Promise.all(
        (targets.length ? targets : [targetIndex]).map((index) =>
          ensurePageRef.current(index)
        )
      );
      if (!mountedRef.current || !flipRef.current) return;

      flip.turnToPage(spreadStart);
      setPageInput(String(target));
      if (zoomRef.current > 1) requestAnimationFrame(centerScroll);
    },
    [centerScroll, getLayout]
  );

  const goNext = useCallback(async () => {
    const flip = flipRef.current;
    const count = pageCountRef.current;
    const current = currentPageRef.current;
    if (!flip || !count || navigationRef.current) return;

    const layout = getLayout();
    const nextStart = getNextSpreadStart(current, count, layout);
    if (nextStart >= count) return;

    navigationRef.current = true;
    window.setTimeout(() => {
      navigationRef.current = false;
    }, 220);

    const targets = getSpreadPages(nextStart, count, layout);

    await Promise.all(
      (targets.length ? targets : [nextStart]).map((index) =>
        ensurePageRef.current(index)
      )
    );
    if (!mountedRef.current || !flipRef.current) return;

    flip.flipNext();
    if (zoomRef.current > 1) requestAnimationFrame(centerScroll);
  }, [centerScroll, getLayout]);

  const goPrev = useCallback(async () => {
    const flip = flipRef.current;
    const count = pageCountRef.current;
    const current = currentPageRef.current;
    if (!flip || current <= 0 || navigationRef.current) return;

    const layout = getLayout();
    const prevStart = getPrevSpreadStart(current, layout);
    if (prevStart < 0) return;

    const targets = getSpreadPages(prevStart, count, layout);

    navigationRef.current = true;
    window.setTimeout(() => {
      navigationRef.current = false;
    }, 220);

    await Promise.all(
      (targets.length ? targets : [prevStart]).map((index) =>
        ensurePageRef.current(index)
      )
    );
    if (!mountedRef.current || !flipRef.current) return;

    flip.flipPrev();
    if (zoomRef.current > 1) requestAnimationFrame(centerScroll);
  }, [centerScroll, getLayout]);

  // Ölçüm: tek/çift sayfa modu sahne genişliğine göre belirlenir. Mod
  // değiştiğinde görüntüleyici mevcut sayfayı koruyarak yeniden kurulur.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let frame = 0;
    const measure = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nextMode: PageFlipOrientation =
          stage.clientWidth < LANDSCAPE_BREAKPOINT ? "portrait" : "landscape";

        if (nextMode !== layoutModeRef.current || layoutMode === null) {
          layoutModeRef.current = nextMode;
          setLayoutMode(nextMode);
          return;
        }

        if (!flipRef.current) return;
        applySize();
        void syncWindow();
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("orientationchange", measure);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("orientationchange", measure);
    };
  }, [applySize, layoutMode, syncWindow]);

  // PageFlip örneği: mod değişiminde yeniden kurulur, zoom sırasında kurulmaz.
  useEffect(() => {
    if (
      status !== "ready" ||
      pageCount <= 0 ||
      ratio <= 0 ||
      layoutMode === null
    ) {
      return;
    }

    const host = hostRef.current;
    if (!host) return;

    let destroyed = false;
    let flip: PageFlip | null = null;
    const pendingRenders = pendingRenderRef.current;

    setViewerReady(false);
    setViewerError(null);
    host.replaceChildren();

    const bookRoot = document.createElement("div");
    bookRoot.className = "magazine-book";
    host.appendChild(bookRoot);

    const pages: HTMLDivElement[] = [];
    const images: HTMLImageElement[] = [];
    const frames: HTMLDivElement[] = [];

    for (let index = 0; index < pageCount; index += 1) {
      const page = document.createElement("div");
      page.className = "magazine-page";
      page.dataset.density = "soft";
      page.dataset.pageIndex = String(index);
      page.setAttribute("aria-label", `Dergi sayfası ${index + 1}`);

      const frame = document.createElement("div");
      frame.className = "magazine-page__frame";

      const image = document.createElement("img");
      image.className = "magazine-page__image";
      image.alt = `Dergi sayfası ${index + 1}`;
      image.draggable = false;
      image.decoding = "async";

      const placeholder = document.createElement("div");
      placeholder.className = "magazine-page__placeholder";
      placeholder.setAttribute("aria-hidden", "true");

      const number = document.createElement("span");
      number.className = "magazine-page__number";
      number.textContent = String(index + 1);

      const hint = document.createElement("span");
      hint.className = "magazine-page__hint";
      hint.textContent = "Sayfa yükleniyor";

      placeholder.append(number, hint);
      frame.append(image, placeholder);
      page.append(frame);
      pages.push(page);
      images.push(image);
      frames.push(frame);
    }

    pageElsRef.current = pages;
    imgElsRef.current = images;
    setPageFrames(frames);

    const size = getBookSize();
    if (size.hostWidth <= 0) {
      requestAnimationFrame(() => {
        if (!destroyed) {
          setViewerError("Görüntüleyici alanı hesaplanamadı.");
        }
      });
      return;
    }

    pageWidthRef.current = size.pageWidth;
    host.style.width = `${Math.round(size.hostWidth)}px`;
    host.style.minWidth = "0px";
    host.style.maxWidth = "none";

    const initialize = async () => {
      try {
        const { PageFlip: PageFlipClass } = await import("page-flip");
        if (destroyed) return;

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        flip = new PageFlipClass(bookRoot, {
          startPage: 0,
          size: "stretch",
          width: 1000,
          height: 1000 / ratio,
          minWidth: layoutMode === "portrait" ? 10000 : 280,
          maxWidth: 2000,
          minHeight: 280,
          maxHeight: 3200,
          drawShadow: true,
          flippingTime: reduceMotion ? 1 : 680,
          usePortrait: layoutMode === "portrait",
          startZIndex: 0,
          autoSize: true,
          maxShadowOpacity: 0.55,
          showCover: true,
          mobileScrollSupport: true,
          clickEventForward: true,
          useMouseEvents: true,
          swipeDistance: 28,
          showPageCorners: true,
          disableFlipByClick: false,
        });

        flipRef.current = flip;

        flip.on("flip", (event) => {
          currentPageRef.current = event.data;
          setCurrentPage(event.data);
          setPageInput(String(event.data + 1));
          scheduleIdle(() => syncWindow(event.data));
        });

        flip.on("changeOrientation", (event) => {
          orientationRef.current = event.data;
          setOrientation(event.data);
        });

        flip.on("changeState", (event) => {
          flippingRef.current = event.data !== "read";
          if (event.data === "read") {
            flushGarbage();
            pruneCache();
            scheduleIdle(() => syncWindow(currentPageRef.current));
          }
        });

        flip.on("init", (event) => {
          orientationRef.current = event.data.mode;
          setOrientation(event.data.mode);
          currentPageRef.current = event.data.page;
          setCurrentPage(event.data.page);
          setPageInput(String(event.data.page + 1));
        });

        flip.loadFromHTML(pages);

        // StPageFlip, portrait modda minWidth'i block boyutuna uygular.
        // Gerçek boyutu biz yönettiğimiz için bu alt sınırı kaldırıyoruz.
        bookRoot.style.minWidth = "0px";
        bookRoot.style.maxWidth = "none";
        host.style.minWidth = "0px";

        flip.update();

        const startPage = Math.min(
          currentPageRef.current,
          Math.max(0, pageCount - 1)
        );
        flip.turnToPage(startPage);

        orientationRef.current = flip.getOrientation();
        setOrientation(flip.getOrientation());
        const resolvedPage = flip.getCurrentPageIndex();
        currentPageRef.current = resolvedPage;
        setCurrentPage(resolvedPage);
        setPageInput(String(resolvedPage + 1));

        applySize();
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve())
        );

        if (destroyed) return;

        const visible = getSpreadPages(resolvedPage, pageCount, {
          portrait: orientationRef.current === "portrait",
          showCover: SHOW_COVER,
        });

        await Promise.all(visible.map((index) => ensurePageRef.current(index)));
        if (destroyed) return;

        setViewerReady(true);
        syncWindow(resolvedPage);
      } catch (error) {
        if (destroyed) return;
        console.error("Dergi görüntüleyicisi başlatılamadı:", error);
        setViewerError(
          "Görüntüleyici başlatılamadı. Sayfayı yenileyip tekrar deneyin."
        );
      }
    };

    void initialize();

    return () => {
      destroyed = true;
      flipRef.current = null;
      flippingRef.current = false;
      try {
        flip?.destroy();
      } catch {
        // Görüntüleyici zaten kaldırılmış olabilir.
      }
      host.replaceChildren();
      pageElsRef.current = [];
      imgElsRef.current = [];
      pendingRenders.clear();
      setPageFrames([]);
    };
  }, [
    applySize,
    flushGarbage,
    getBookSize,
    layoutMode,
    pageCount,
    pruneCache,
    ratio,
    status,
    syncWindow,
    documentId,
  ]);

  useEffect(() => {
    if (!viewerReady) return;

    applySize();
    const timeout = window.setTimeout(() => {
      void syncWindow();
      if (zoomRef.current > 1) centerScroll();
    }, 60);

    return () => window.clearTimeout(timeout);
  }, [applySize, centerScroll, syncWindow, viewerReady, zoom]);

  // Kitap düzeninde kapak tek sayfa olarak sağ yuvaya düşer; görsel olarak
  // ortalanması için kitabı yarım sayfa sola kaydırıyoruz.
  const showingCover =
    orientation !== "portrait" &&
    currentPage === 0 &&
    getSpreadPages(0, pageCount, {
      portrait: false,
      showCover: SHOW_COVER,
    }).length === 1;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.dataset.cover = showingCover ? "true" : "false";
  }, [showingCover, viewerReady]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const active = document.fullscreenElement === rootRef.current;
      setIsFullscreen(active);
      if (!active) setCssFullscreen(false);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!cssFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [cssFullscreen]);

  useEffect(() => {
    if (!thumbsOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [thumbsOpen]);

  const toggleFullscreen = useCallback(async () => {
    const root = rootRef.current;
    if (!root) return;

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        setIsFullscreen(false);
      }
      return;
    }

    if (cssFullscreen) {
      setCssFullscreen(false);
      return;
    }

    try {
      await root.requestFullscreen();
    } catch {
      setCssFullscreen(true);
    }
  }, [cssFullscreen]);

  const zoomIn = useCallback(() => {
    setZoom((value) =>
      Math.min(MAX_ZOOM, Math.round((value + ZOOM_STEP) * 100) / 100)
    );
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((value) =>
      Math.max(MIN_ZOOM, Math.round((value - ZOOM_STEP) * 100) / 100)
    );
  }, []);

  const resetZoom = useCallback(() => setZoom(1), []);

  const canGoPrev = currentPage > 0;
  const spreadPages = useMemo(
    () =>
      getSpreadPages(currentPage, pageCount, {
        portrait: orientation === "portrait",
        showCover: SHOW_COVER,
      }),
    [currentPage, orientation, pageCount]
  );
  const canGoNext =
    pageCount > 0 &&
    getNextSpreadStart(currentPage, pageCount, {
      portrait: orientation === "portrait",
      showCover: SHOW_COVER,
    }) < pageCount;

  const pageLabel = useMemo(() => {
    if (!pageCount) return "—";
    return formatSpreadLabel(spreadPages, currentPage);
  }, [currentPage, pageCount, spreadPages]);

  const handlePageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Number.parseInt(pageInput, 10);
    if (!Number.isFinite(value)) {
      setPageInput(String(currentPage + 1));
      return;
    }
    void goToPage(value);
  };

  const handleRetry = () => {
    clearPageCache();
    setViewerError(null);
    setViewerReady(false);
    setCurrentPage(0);
    currentPageRef.current = 0;
    setPageInput("1");
    setThumbsOpen(false);
    setZoom(1);
    zoomRef.current = 1;
    flippingRef.current = false;
    navigationRef.current = false;
    reload();
  };

  const handleThumbnailSelect = (page: number) => {
    setThumbsOpen(false);
    void goToPage(page);
  };

  // İşaretleme yüzeyi kitabın tam üzerine oturur; tıklamayı yakalar.
  useEffect(() => {
    if (!marking) return;

    const update = () => {
      const host = hostRef.current;
      const canvas = host?.parentElement;
      if (!host || !canvas) return;
      const hostRect = host.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      if (hostRect.width <= 0 || hostRect.height <= 0) return;
      setMarkSurface({
        left: hostRect.left - canvasRect.left,
        top: hostRect.top - canvasRect.top,
        width: hostRect.width,
        height: hostRect.height,
      });
    };

    const frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    if (hostRef.current) observer.observe(hostRef.current);
    if (stageRef.current) observer.observe(stageRef.current);
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [marking, viewerReady, zoom, layoutMode]);

  const handleMarkPoint = (event: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;

    // Sayfayı konumundan buluyoruz: PageFlip kendi gölge/perspektif
    // katmanları yüzünden `elementsFromPoint` sayfaları atlayabiliyor.
    const isInside = (rect: DOMRect) =>
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;

    let pageEl: HTMLElement | null = null;
    for (const candidate of pageElsRef.current) {
      if (candidate.offsetParent === null) continue;
      const rect = candidate.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && isInside(rect)) {
        pageEl = candidate;
        break;
      }
    }

    if (!pageEl) {
      const target = document.elementsFromPoint(clientX, clientY)
        .map((element) => element.closest<HTMLElement>(".magazine-page"))
        .find((element): element is HTMLElement => Boolean(element));
      pageEl = target ?? null;
    }

    if (!pageEl) return;

    const index = Number(pageEl.dataset.pageIndex);
    if (!Number.isInteger(index) || index < 0) return;

    const frame =
      pageEl.querySelector<HTMLElement>(".magazine-page__frame") ?? pageEl;
    const rect = frame.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const anchor = {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    };

    setMarking(false);
    setActiveNoteId(null);
    setComposer({ page: index + 1, anchor });
    setNotesOpen(true);
  };

  const openNote = (note: PublicMagazineNote) => {
    setComposer(null);
    setActiveNoteId(note.id);
    setNotesOpen(true);
  };

  const handleStartMarking = () => {
    setNotesOpen(false);
    setComposer(null);
    setMarking(true);
  };

  const handleSubmitNote = async (input: {
    body: string;
    name: string;
    email: string;
    website: string;
  }): Promise<MagazineNoteSubmitResult> => {
    if (!composer) {
      return { ok: false, message: "Not hedefi bulunamadı. Lütfen tekrar deneyin." };
    }
    return submitNote({
      page: composer.page,
      anchor: composer.anchor,
      ...input,
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Panel açıkken gezinme tuşları dergiyi çevirmesin.
      if (notesOpen) return;

      if (event.key === "Escape") {
        if (marking) {
          setMarking(false);
          return;
        }
        if (thumbsOpen) {
          setThumbsOpen(false);
          return;
        }
        if (document.fullscreenElement) {
          void document.exitFullscreen().catch(() => setIsFullscreen(false));
          return;
        }
        if (cssFullscreen) {
          setCssFullscreen(false);
          return;
        }
        return;
      }

      if (thumbsOpen || marking || !viewerReady) return;

      switch (event.key) {
        case "ArrowRight":
        case "PageDown":
          event.preventDefault();
          void goNext();
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          void goPrev();
          break;
        case "Home":
          event.preventDefault();
          void goToPage(1);
          break;
        case "End":
          event.preventDefault();
          void goToPage(pageCount);
          break;
        case "+":
        case "=":
          event.preventDefault();
          zoomIn();
          break;
        case "-":
          event.preventDefault();
          zoomOut();
          break;
        case "0":
          event.preventDefault();
          resetZoom();
          break;
        case "f":
        case "F":
          event.preventDefault();
          void toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    cssFullscreen,
    goNext,
    goPrev,
    goToPage,
    marking,
    notesOpen,
    pageCount,
    resetZoom,
    thumbsOpen,
    toggleFullscreen,
    viewerReady,
    zoomIn,
    zoomOut,
  ]);

  const showBook = status === "ready" && !viewerError;

  return (
    <section
      ref={rootRef}
      className="magazine-reader"
      data-immersive={immersive ? "true" : "false"}
      aria-label="Tarih Kulübü dijital dergi görüntüleyicisi"
    >
      <div className="magazine-reader__topbar">
        <div className="min-w-0">
          <p className="magazine-reader__eyebrow">
            Dijital yayın · {issue.period} · {issueLabel}
          </p>
          <p className="truncate font-display text-base font-bold text-foreground sm:text-lg">
            {issue.title}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            className="magazine-text-button magazine-text-button--notes"
            onClick={() => {
              setComposer(null);
              setNotesOpen(true);
            }}
            disabled={!viewerReady}
            aria-haspopup="dialog"
          >
            <NoteIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Notlar</span>
            <span className="sr-only sm:hidden">Notlar</span>
            {notes.length > 0 && (
              <span className="magazine-note-count" aria-hidden="true">
                {notes.length}
              </span>
            )}
          </button>
          <button
            type="button"
            className="magazine-text-button"
            onClick={() => setThumbsOpen(true)}
            disabled={!viewerReady}
            aria-expanded={thumbsOpen}
            aria-haspopup="dialog"
          >
            <PagesIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Sayfalar</span>
            <span className="sr-only sm:hidden">Sayfalar</span>
          </button>
          <IconButton
            label={immersive ? "Tam ekrandan çık" : "Tam ekran"}
            onClick={() => void toggleFullscreen()}
          >
            {immersive ? (
              <ContractIcon className="h-5 w-5" />
            ) : (
              <ExpandIcon className="h-5 w-5" />
            )}
          </IconButton>
        </div>
      </div>

      <div ref={stageRef} className="magazine-reader__stage">
        <div className="magazine-reader__stage-glow" aria-hidden="true" />

        {status === "loading" && <ReaderLoading progress={progress} />}

        {status === "error" && (
          <ReaderError
            title="Dergi yüklenemedi"
            message={error}
            onRetry={handleRetry}
          />
        )}

        {status === "ready" && viewerError && (
          <ReaderError
            title="Görüntüleyici açılamadı"
            message={viewerError}
            onRetry={handleRetry}
          />
        )}

        {showBook && (
          <div
            className="magazine-reader__canvas"
            data-marking={marking ? "true" : "false"}
          >
            <div
              ref={hostRef}
              className="magazine-reader__book"
              style={{ touchAction: zoom > 1 ? "pan-x pan-y" : undefined }}
            />

            {portalReady &&
              pageFrames.map((frame, index) =>
                createPortal(
                  <PageNoteOverlay
                    page={index + 1}
                    notes={notes.filter((note) => note.page === index + 1)}
                    activeNoteId={activeNoteId}
                    hoveredNoteId={hoveredNoteId}
                    onHover={setHoveredNoteId}
                    onSelect={openNote}
                  />,
                  frame,
                  `magazine-notes-page-${index}`
                )
              )}

            {marking && markSurface && (
              <div
                className="magazine-marking-surface"
                style={{
                  left: markSurface.left,
                  top: markSurface.top,
                  width: markSurface.width,
                  height: markSurface.height,
                }}
                onPointerDown={handleMarkPoint}
                role="button"
                tabIndex={-1}
                aria-label="Not bırakmak için sayfada bir nokta seçin"
              />
            )}
          </div>
        )}

        {marking && (
          <div className="magazine-marking-hint" role="status">
            <MarkerIcon className="h-4 w-4" />
            <span>Not bırakmak istediğiniz noktaya dokunun.</span>
            <button
              type="button"
              onClick={() => setMarking(false)}
              className="magazine-marking-hint__cancel"
            >
              Vazgeç
            </button>
          </div>
        )}

        {showBook && !viewerReady && (
          <div className="magazine-reader__preparing" role="status">
            <span className="magazine-spinner" aria-hidden="true" />
            <span>Sayfalar hazırlanıyor…</span>
          </div>
        )}

        <MagazineThumbnails
          open={thumbsOpen}
          pageCount={pageCount}
          ratio={ratio}
          activePages={spreadPages}
          onSelect={handleThumbnailSelect}
          onClose={() => setThumbsOpen(false)}
          renderThumbnail={renderThumbnail}
        />
      </div>

      <div
        className="magazine-reader__controls"
        role="toolbar"
        aria-label="Dergi gezinme ve görüntüleme kontrolleri"
      >
        <div className="flex items-center gap-1.5">
          <IconButton
            label="Önceki sayfa"
            onClick={() => void goPrev()}
            disabled={!viewerReady || !canGoPrev}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </IconButton>

          <form
            onSubmit={handlePageSubmit}
            className="flex items-center gap-1.5"
          >
            <label htmlFor="magazine-page-input" className="sr-only">
              Sayfa numarası
            </label>
            <input
              id="magazine-page-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pageInput}
              onChange={(event) =>
                setPageInput(event.target.value.replace(/[^0-9]/g, ""))
              }
              onFocus={(event) => event.currentTarget.select()}
              className="magazine-page-input"
              aria-describedby="magazine-page-total"
              disabled={!viewerReady}
            />
            <span id="magazine-page-total" className="text-xs text-muted-foreground">
              / {pageCount || "—"}
            </span>
          </form>

          <IconButton
            label="Sonraki sayfa"
            onClick={() => void goNext()}
            disabled={!viewerReady || !canGoNext}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </IconButton>

          <span className="sr-only" aria-live="polite">
            Görünen sayfa: {pageLabel} / {pageCount}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <IconButton
            label="Uzaklaştır"
            onClick={zoomOut}
            disabled={!viewerReady || zoom <= MIN_ZOOM}
          >
            <ZoomOutIcon className="h-5 w-5" />
          </IconButton>
          <span className="w-11 text-center text-[0.7rem] font-semibold tabular-nums text-muted-foreground">
            %{Math.round(zoom * 100)}
          </span>
          <IconButton
            label="Yakınlaştır"
            onClick={zoomIn}
            disabled={!viewerReady || zoom >= MAX_ZOOM}
          >
            <ZoomInIcon className="h-5 w-5" />
          </IconButton>
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <IconButton
            label="Sayfayı ekrana sığdır"
            onClick={resetZoom}
            disabled={!viewerReady || zoom === MIN_ZOOM}
          >
            <FitIcon className="h-5 w-5" />
          </IconButton>
        </div>
      </div>

      <p className="magazine-reader__hint">
        <span className="magazine-reader__hint-item">
          <BookIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            Sayfaları çevirmek için kenarlara tıklayın, kaydırın veya ok
            tuşlarını kullanın.
          </span>
        </span>
        <span className="magazine-reader__hint-sep" aria-hidden="true">
          ·
        </span>
        <span className="magazine-reader__hint-item">
          <NoteIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <button
            type="button"
            className="magazine-reader__hint-button"
            onClick={handleStartMarking}
            disabled={!viewerReady}
          >
            Sayfada bir noktayı işaretleyip not bırakın
          </button>
        </span>
      </p>

      {portalReady &&
        createPortal(
          <MagazineNotesPanel
            key={
              composer
                ? `${composer.page}:${
                    composer.anchor
                      ? `${composer.anchor.x.toFixed(3)},${composer.anchor.y.toFixed(3)}`
                      : "page"
                  }`
                : "list"
            }
            open={notesOpen}
            notes={notes}
            composer={composer}
            activeNoteId={activeNoteId}
            currentPage={currentPage + 1}
            onClose={() => {
              setNotesOpen(false);
              setActiveNoteId(null);
            }}
            onJumpToPage={(page) => {
              setNotesOpen(false);
              void goToPage(page);
            }}
            onStartCompose={(target) => {
              setActiveNoteId(null);
              setComposer(target);
            }}
            onCancelCompose={() => {
              setComposer(null);
              setNotesOpen(false);
            }}
            onStartMarking={handleStartMarking}
            onSubmit={handleSubmitNote}
          />,
          document.body
        )}

      {immersive && (
        <button
          type="button"
          className="magazine-immersive-close"
          onClick={() => {
            if (document.fullscreenElement) void document.exitFullscreen();
            else setCssFullscreen(false);
          }}
          aria-label="Tam ekrandan çık"
          title="Tam ekrandan çık"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      )}
    </section>
  );
}
