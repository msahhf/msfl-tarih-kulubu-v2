"use client";

import { useRef, useState } from "react";

export interface UploadedImage {
  url: string;
  fileId: string;
}

interface ImageUploaderProps {
  name: string;
  initialImages?: UploadedImage[];
  maxImages?: number;
  folder?: string;
}

const MAX_SIZE_BYTES = 6 * 1024 * 1024;

export function ImageUploader({
  name,
  initialImages = [],
  maxImages = 5,
  folder = "blog",
}: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remaining = maxImages - images.length;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const selected = Array.from(files).slice(0, remaining);
    if (selected.length === 0) {
      setError(`En fazla ${maxImages} görsel eklenebilir.`);
      return;
    }

    setUploading(true);
    try {
      const uploaded: UploadedImage[] = [];
      for (const file of selected) {
        if (!file.type.startsWith("image/")) {
          throw new Error(`"${file.name}" bir görsel dosyası değil.`);
        }
        if (file.size > MAX_SIZE_BYTES) {
          throw new Error(`"${file.name}" çok büyük (en fazla 6MB).`);
        }

        const fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Dosya okunamadı."));
          reader.readAsDataURL(file);
        });

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileBase64, fileName: file.name, folder }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Yükleme başarısız oldu.");
        }
        uploaded.push({ url: data.url, fileId: data.fileId });
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme sırasında hata oluştu.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function removeImage(index: number) {
    const target = images[index];
    setImages((prev) => prev.filter((_, i) => i !== index));
    // Server action owns authoritative deletion on submit; for already-saved
    // images removed in edit mode, best-effort cleanup via delete API.
    if (target?.fileId) {
      try {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId: target.fileId }),
        });
      } catch {
        // Non-fatal: server action reconciles remaining fileIds on submit.
      }
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={img.fileId || img.url} className="relative group rounded-lg overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={`Yüklenen görsel ${i + 1}`} className="h-28 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label={`Görsel ${i + 1}'i kaldır`}
                className="absolute top-1 right-1 px-2 py-1 text-xs font-semibold bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              >
                Kaldır
              </button>
            </div>
          ))}
        </div>
      )}

      {remaining > 0 ? (
        <div className="flex items-center gap-3">
          <label
            htmlFor={`${name}-picker`}
            className="cursor-pointer px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-surface/80 transition-colors"
          >
            {uploading ? "Yükleniyor…" : "Görsel Yükle"}
          </label>
          <input
            ref={fileInputRef}
            id={`${name}-picker`}
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
            className="sr-only"
          />
          <span className="text-xs text-muted-foreground">
            {images.length}/{maxImages} görsel • En fazla 6MB • JPEG/PNG/GIF/WebP
          </span>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">En fazla {maxImages} görsele ulaşıldı.</p>
      )}

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
