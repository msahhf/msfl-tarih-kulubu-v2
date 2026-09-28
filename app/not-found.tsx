export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <h1 className="text-6xl font-display font-bold text-muted-foreground">
          404
        </h1>
        <h2 className="text-2xl font-heading font-semibold">
          Sayfa bulunamadı
        </h2>
        <p className="text-muted-foreground">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  );
}
