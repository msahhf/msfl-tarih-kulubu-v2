"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

export type MagazineDocumentStatus = "loading" | "ready" | "error";

export type MagazinePageRender = {
  url: string;
  /** Render edilen gerçek piksel genişliği (CSS pikseli değil). */
  width: number;
  height: number;
};

type RenderMode = "page" | "thumb";

class TaskQueue {
  private active = 0;
  private readonly queue: Array<() => void> = [];

  constructor(private readonly limit: number) {}

  run<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const start = () => {
        this.active += 1;
        task()
          .then(resolve, reject)
          .finally(() => {
            this.active -= 1;
            const next = this.queue.shift();
            if (next) next();
          });
      };

      if (this.active < this.limit) start();
      else this.queue.push(start);
    });
  }
}

const MAX_PAGE_RENDER_WIDTH = 2200;
const MAX_PAGE_RENDER_PIXELS = 7_000_000;
const MAX_THUMB_RENDER_WIDTH = 360;
const MAX_THUMB_RENDER_PIXELS = 500_000;

function isCancelledRender(error: unknown): boolean {
  return (
    error instanceof Error && error.name === "RenderingCancelledException"
  );
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Sayfa görüntüsü oluşturulamadı."));
      },
      "image/webp",
      quality
    );
  });
}

function describeLoadError(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "MissingPDFException") {
      return "Dergi dosyası bulunamadı. Yayın hazır olduğunda tekrar deneyin.";
    }
    if (error.name === "InvalidPDFException") {
      return "Dergi dosyası geçerli bir PDF olarak okunamadı.";
    }
    if (error.name === "UnexpectedResponseException") {
      return "Dergi dosyasına ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.";
    }
  }
  return "Dergi yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
}

export function usePdfDocument(pdfUrl: string) {
  const [status, setStatus] = useState<MagazineDocumentStatus>("loading");
  const [progress, setProgress] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState(0);
  const [attempt, setAttempt] = useState(0);

  const docRef = useRef<PDFDocumentProxy | null>(null);
  const loadingTaskRef = useRef<{ destroy: () => Promise<void> } | null>(null);
  const tasksRef = useRef(new Map<string, RenderTask>());
  const thumbnailCacheRef = useRef(new Map<number, string>());
  const pageQueueRef = useRef(new TaskQueue(2));
  const thumbQueueRef = useRef(new TaskQueue(1));
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    const generation = attempt + 1;
    const renderTasks = tasksRef.current;
    const thumbnailCache = thumbnailCacheRef.current;

    const run = async () => {
      setStatus("loading");
      setProgress(null);
      setError(null);
      setPageCount(0);
      setRatio(0);
      setDocumentId(generation);

      try {
        const pdfjs = await import("pdfjs-dist");
        if (disposed) return;

        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf/pdf.worker.min.mjs";

        const loadingTask = pdfjs.getDocument({
          url: pdfUrl,
          cMapUrl: "/pdf/cmaps/",
          cMapPacked: true,
          standardFontDataUrl: "/pdf/standard_fonts/",
          wasmUrl: "/pdf/wasm/",
          iccUrl: "/pdf/iccs/",
          disableAutoFetch: true,
          disableStream: true,
          rangeChunkSize: 262144,
        });

        loadingTaskRef.current = loadingTask;
        loadingTask.onProgress = (data: { loaded: number; total: number }) => {
          if (disposed || !data.total) return;
          setProgress(Math.min(1, data.loaded / data.total));
        };

        const pdfDocument = await loadingTask.promise;
        if (disposed) {
          await loadingTask.destroy().catch(() => undefined);
          return;
        }

        if (!pdfDocument.numPages) {
          throw new Error("PDF dosyası boş görünüyor.");
        }

        const firstPage = await pdfDocument.getPage(1);
        const viewport = firstPage.getViewport({ scale: 1 });

        if (disposed) return;

        docRef.current = pdfDocument;
        setRatio(viewport.width / viewport.height);
        setPageCount(pdfDocument.numPages);
        setProgress(1);
        setStatus("ready");
        setDocumentId(generation);
      } catch (loadError) {
        if (disposed) return;
        console.error("Dergi PDF'i yüklenemedi:", loadError);
        setError(describeLoadError(loadError));
        setStatus("error");
        setDocumentId(generation);
      }
    };

    void run();

    return () => {
      disposed = true;

      for (const task of renderTasks.values()) {
        try {
          task.cancel();
        } catch {
          // PDF.js görevi zaten bitmiş olabilir.
        }
      }
      renderTasks.clear();

      const loadingTask = loadingTaskRef.current;
      loadingTaskRef.current = null;
      if (loadingTask) {
        void loadingTask.destroy().catch(() => undefined);
      }

      docRef.current = null;

      for (const url of thumbnailCache.values()) {
        URL.revokeObjectURL(url);
      }
      thumbnailCache.clear();
    };
  }, [pdfUrl, attempt]);

  const renderPage = useCallback(
    async (
      pageIndex: number,
      cssWidth: number,
      mode: RenderMode = "page"
    ): Promise<MagazinePageRender | null> => {
      const pdfDocument = docRef.current;
      if (!pdfDocument) {
        throw new Error("PDF dokümanı hazır değil.");
      }

      const page = await pdfDocument.getPage(pageIndex + 1);
      const baseViewport = page.getViewport({ scale: 1 });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const requestedWidth =
        mode === "thumb" ? cssWidth * 2 : cssWidth * dpr;
      let pixelWidth = Math.max(
        60,
        Math.min(
          requestedWidth,
          mode === "thumb" ? MAX_THUMB_RENDER_WIDTH : MAX_PAGE_RENDER_WIDTH
        )
      );

      let pixelHeight = (baseViewport.height / baseViewport.width) * pixelWidth;
      const maxPixels =
        mode === "thumb" ? MAX_THUMB_RENDER_PIXELS : MAX_PAGE_RENDER_PIXELS;

      if (pixelWidth * pixelHeight > maxPixels) {
        const factor = Math.sqrt(maxPixels / (pixelWidth * pixelHeight));
        pixelWidth *= factor;
        pixelHeight *= factor;
      }

      const viewport = page.getViewport({
        scale: pixelWidth / baseViewport.width,
      });

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(viewport.width));
      canvas.height = Math.max(1, Math.round(viewport.height));

      const context = canvas.getContext("2d", { alpha: false });
      if (!context) {
        throw new Error("Tarayıcı sayfa tuvali oluşturamadı.");
      }
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const taskKey = `${mode}:${pageIndex}`;
      const previousTask = tasksRef.current.get(taskKey);
      if (previousTask) {
        try {
          previousTask.cancel();
        } catch {
          // Önceki görev çoktan tamamlanmış olabilir.
        }
      }

      const task = page.render({
        canvas,
        viewport,
        intent: "display",
      });
      tasksRef.current.set(taskKey, task);

      try {
        await task.promise;
      } catch (renderError) {
        if (isCancelledRender(renderError)) return null;
        throw renderError;
      } finally {
        if (tasksRef.current.get(taskKey) === task) {
          tasksRef.current.delete(taskKey);
        }
      }

      const blob = await canvasToBlob(
        canvas,
        mode === "thumb" ? 0.82 : 0.94
      );

      return {
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
      };
    },
    []
  );

  const renderDocumentPage = useCallback(
    (pageIndex: number, cssWidth: number) =>
      pageQueueRef.current.run(() => renderPage(pageIndex, cssWidth, "page")),
    [renderPage]
  );

  const renderThumbnail = useCallback(
    async (pageIndex: number): Promise<string> => {
      const cached = thumbnailCacheRef.current.get(pageIndex);
      if (cached) return cached;

      return thumbQueueRef.current.run(async () => {
        const secondCheck = thumbnailCacheRef.current.get(pageIndex);
        if (secondCheck) return secondCheck;

        const result = await renderPage(pageIndex, 140, "thumb");
        if (!result) {
          throw new Error("Küçük resim oluşturulamadı.");
        }

        thumbnailCacheRef.current.set(pageIndex, result.url);
        return result.url;
      });
    },
    [renderPage]
  );

  const reload = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  return {
    status,
    progress,
    pageCount,
    ratio,
    error,
    documentId,
    reload,
    renderPage: renderDocumentPage,
    renderThumbnail,
  };
}
