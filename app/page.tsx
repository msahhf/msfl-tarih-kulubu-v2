export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <h1 className="text-5xl font-display font-bold tracking-tight">
          MSFL Tarih Kulübü
        </h1>
        <p className="text-xl text-muted-foreground">
          Modern digital archive ve history club platformu
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
            Keşfet
          </button>
          <a
            href="#"
            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-surface transition-colors"
          >
            Hakkında
          </a>
        </div>
      </div>
    </main>
  );
}
