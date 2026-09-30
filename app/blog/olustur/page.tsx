import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { createPostAction } from "@/lib/blog/actions";
import { Container } from "@/components/ui/Container";
import { ImageUploader } from "@/components/blog/ImageUploader";
import Link from "next/link";

interface CreateBlogPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function CreateBlogPage({ searchParams }: CreateBlogPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  const resolvedSearch = await searchParams;

  return (
    <Container className="py-16">
      <div className="max-w-3xl mx-auto space-y-8 bg-surface p-8 sm:p-12 rounded-xl border border-border">
        <header className="space-y-4 border-b border-border pb-6">
          <h1 className="text-3xl font-display font-bold">Yeni Blog Yazısı Oluştur</h1>
          <p className="text-muted-foreground text-sm">
            Tarih Kulübü arşivine yeni bir araştırma veya yazı ekle.
          </p>
        </header>

        {resolvedSearch.error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
            {resolvedSearch.error}
          </div>
        )}

        <form action={createPostAction} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="title">
              Yazı Başlığı
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              minLength={3}
              maxLength={200}
              placeholder="Örn: Osmanlı Döneminde Eğitim ve Bilim"
              className="w-full p-3 bg-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground" id="images-label">
              Görseller (en fazla 5)
            </span>
            <p className="text-xs text-muted-foreground">
              Önerilen boyut: 1600×900 • Her biri en fazla 6MB • JPEG/PNG/GIF/WebP
            </p>
            <div role="group" aria-labelledby="images-label">
              <ImageUploader name="imageUrls" maxImages={5} folder="blog" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="content">
              İçerik (HTML destekli)
            </label>
            <textarea
              name="content"
              id="content"
              rows={10}
              required
              placeholder="Yazı içeriğini buraya giriniz..."
              className="w-full p-3 bg-background rounded-lg border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="p-4 bg-surface rounded-lg border border-border text-xs text-muted-foreground">
            <strong className="text-foreground">Uyarı:</strong> Yanıltıcı tarih
            bilgileri ve telif ihlali içeren içerikler paylaşmayınız.
          </div>

          <div className="flex items-center justify-between pt-4">
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              ← Vazgeç
            </Link>
            <button
              type="submit"
              className="px-6 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Yazıyı Yayımla
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}
