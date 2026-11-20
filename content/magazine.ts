export type MagazineIssue = {
  slug: string;
  title: string;
  issueNumber: string;
  period: string;
  description: string;
  /**
   * Aynı origin'den servis edilen PDF yolu.
   *
   * Yeni sayı eklemek için PDF dosyasını `public/dergi/<slug>.pdf` altına
   * koyun ve aşağıdaki listeye kaydı ekleyin. Vercel'de public klasörü statik
   * olarak CDN üzerinden yayınlanır; ayrı bir backend veya veritabanı gerekmez.
   *
   * Çok büyük dosyalarda (yaklaşık 100 MB üzeri) PDF, ImageKit gibi mevcut
   * medya altyapısına yüklenip mutlak bir URL olarak da verilebilir. PDF.js
   * için uzak sunucunun CORS başlıklarına izin vermesi gerekir.
   */
  pdfUrl: string;
  publishedAt?: string;
};

/**
 * Yayımdaki sayılar. İlk sayı yayımlanana kadar liste bilinçli olarak boş:
 * örnek/deneme PDF'leri gerçek kulüp yayını gibi gösterilmez.
 */
export const magazineIssues: MagazineIssue[] = [
  {
    slug: "tarih-i-kadim-5-sayi",
    title: "Tarih-i Kadim",
    issueNumber: "5",
    period: "Kasım 2026",
    description:
      "MSFL Tarih Kulübü dergisinin 5. sayısı. 68 sayfa; kapak dosyası: Dijital Sömürgecilik.",
    pdfUrl: "/dergi/tarih-i-kadim-5-sayi.pdf",
    publishedAt: "2026-11-01",
  },
];

export function getCurrentMagazineIssue(): MagazineIssue | null {
  return magazineIssues[0] ?? null;
}
