"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image sarmalayıcısı: uzak görsel yüklenemezse (kırık/ölü URL)
 * zarifçe yerel varsayılan görsele düşer. Böylece kırık görsel ikonu
 * kullanıcıya gösterilmez.
 */
export function SafeImage({
  src,
  fallbackSrc,
  alt,
  ...props
}: Omit<ImageProps, "src"> & { src: string; fallbackSrc?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [prevSrc, setPrevSrc] = useState(src);

  // Kaynak değişirse hata durumunu sıfırla (React'in önerdiği türetilmiş durum).
  if (src !== prevSrc) {
    setPrevSrc(src);
    setFailedSrc(null);
  }

  const currentSrc = failedSrc === src && fallbackSrc ? fallbackSrc : src;

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={fallbackSrc ? () => setFailedSrc(src) : undefined}
    />
  );
}
