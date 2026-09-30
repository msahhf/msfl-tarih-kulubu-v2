"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto p-8 text-center space-y-6 bg-white rounded-xl shadow-lg border border-neutral-200">
          <h1 className="text-5xl font-bold text-red-600">Kritik Hata</h1>
          <h2 className="text-xl font-semibold">Sistemde beklenmeyen bir sorun oluştu</h2>
          <p className="text-neutral-600 text-sm">
            {error?.message || "Sayfa yüklenirken kritik bir hata meydana geldi."}
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}
