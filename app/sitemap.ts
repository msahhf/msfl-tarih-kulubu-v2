import type { MetadataRoute } from "next";
import { postRepository } from "@/lib/db/repositories";

const BASE_URL = "https://msfl-tarih-kulubu.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/hakkinda",
    "/etkinlikler",
    "/tarihte-bugun",
    "/blog",
    "/giris",
    "/kayit",
    "/yardim-destek",
    "/legal/acik-riza-metni",
    "/legal/gizlilik-politikasi",
    "/legal/iletisim",
    "/legal/kullanim-sartlari",
    "/legal/site-haritasi",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  try {
    const { posts } = await postRepository.findPaginated(1, 100);
    const blogRoutes = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post._id.toString()}`,
      lastModified: new Date(post.date),
    }));
    return [...staticRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
