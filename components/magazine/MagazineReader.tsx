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
  NoteIcon,
  PagesIcon,
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
  onSelect: (note: PublicMagazineNote) => void;
};

/**
 * Sayfada not bulunduğunu gösteren rozet.
 *
 * Sayfa çerçevesinin içine portal ile çizilir; böylece sayfa çevrilirken,
 * yakınlaştırılırken veya yeniden boyutlanırken rozet sayfayla birlikte
 * hareket eder (ekran koordinatı hesaplamak gerekmez).
 */
function PageNoteOverlay({ page, notes, onSelect }: PageNoteOverlayProps) {
  if (!notes.length) return null;

  return (
    <div className="magazine-note-layer">
      <button
        type="button"
        className="magazine-note-badge"
        onClick={(event) => {
          event.stopPropagation();
          onSelect(notes[0]);
        }}
        title={`Bu sayfada ${notes.length} not var`}
        aria-label={`Sayfa ${page}: ${notes.length} okuyucu notu`}
      >
        <NoteIcon className="h-3.5 w-3.5" />
        {notes.length}
      </button>
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
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [pageFrames, setPageFrames] = useState<HTMLDivElement[]>([]);
  // Not paneli okuyucunun kendi içine portal edilir; böylece tam ekranda da
  // görünür (native fullscreen yalnızca tam ekran öğesinin içini çizer).
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);

  // Portallar yalnızca istemcide çizilir; SSR ile hydration uyuşmazlığı olmaz.
  const portalReady = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);

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

  const openNote = (note: PublicMagazineNote) => {
    setComposer(null);
    setActiveNoteId(note.id);
    setNotesOpen(true);
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
      anchor: null,
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

      if (thumbsOpen || !viewerReady) return;

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
      ref={(node) => {
        rootRef.current = node;
        setPortalHost(node);
      }}
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
          <div className="magazine-reader__canvas">
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
                    onSelect={openNote}
                  />,
                  frame,
                  `magazine-notes-page-${index}`
                )
              )}
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
      </p>

      {portalReady &&
        portalHost &&
        createPortal(
          <MagazineNotesPanel
            key={composer ? `${composer.page}:form` : "list"}
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
            onSubmit={handleSubmitNote}
          />,
          portalHost
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
