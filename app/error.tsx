"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <h1 className="text-6xl font-display font-bold text-destructive">
          Hata
        </h1>
        <h2 className="text-2xl font-heading font-semibold">
          Bir şeyler yanlış gitti
        </h2>
        <p className="text-muted-foreground">
          Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-surface transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
