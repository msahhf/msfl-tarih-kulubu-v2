/**
 * Sayfa yayılımı (spread) hesapları.
 *
 * StPageFlip'in "showCover" davranışı: ilk sayfa tek başına, kalan sayfalar
 * ikişerli çift olarak gösterilir. Bu yardımcılar aynı düzeni hem okuyucu
 * gezinmesinde hem küçük resimlerde tek yerden uygular.
 */
export type SpreadLayout = {
  portrait: boolean;
  showCover: boolean;
};

/** Verilen sayfa indeksinin ait olduğu yayılımın ilk sayfa indeksi. */
export function getSpreadStart(pageIndex: number, layout: SpreadLayout): number {
  if (layout.portrait) return pageIndex;
  if (pageIndex <= 0) return 0;
  if (!layout.showCover) return pageIndex - (pageIndex % 2);

  // Kapak tek başına: 0 | 1-2 | 3-4 | ...
  const offset = pageIndex - 1;
  return 1 + offset - (offset % 2);
}

/** Verilen sayfanın bulunduğu yayılımda görünen sayfa indeksleri. */
export function getSpreadPages(
  pageIndex: number,
  pageCount: number,
  layout: SpreadLayout
): number[] {
  if (pageCount <= 0) return [];

  if (layout.portrait) {
    return pageIndex >= 0 && pageIndex < pageCount ? [pageIndex] : [];
  }

  const start = getSpreadStart(pageIndex, layout);
  if (start <= 0 && layout.showCover) {
    return pageCount > 0 ? [0] : [];
  }

  const pages = [start];
  if (start + 1 < pageCount) pages.push(start + 1);
  return pages.filter((index) => index >= 0 && index < pageCount);
}

/** Sonraki yayılımın ilk sayfa indeksi (yoksa sayfa sayısı). */
export function getNextSpreadStart(
  pageIndex: number,
  pageCount: number,
  layout: SpreadLayout
): number {
  const start = getSpreadStart(pageIndex, layout);
  if (layout.portrait) return Math.min(start + 1, pageCount);

  if (layout.showCover && start <= 0) return Math.min(1, pageCount);
  return Math.min(start + 2, pageCount);
}

/** Önceki yayılımın ilk sayfa indeksi (yoksa -1). */
export function getPrevSpreadStart(
  pageIndex: number,
  layout: SpreadLayout
): number {
  const start = getSpreadStart(pageIndex, layout);
  if (layout.portrait) return start - 1;

  if (layout.showCover && start <= 1) return -1;
  return start - 2;
}

/** Görünen sayfa aralığını "3" ya da "3–4" biçiminde etiketler. */
export function formatSpreadLabel(
  pages: number[],
  fallback: number
): string {
  if (!pages.length) return String(fallback + 1);
  const first = pages[0] + 1;
  const last = pages[pages.length - 1] + 1;
  return last > first ? `${first}–${last}` : String(first);
}
