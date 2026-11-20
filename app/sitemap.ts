import type { MetadataRoute } from "next";
import { postRepository } from "@/lib/db/repositories";
import { SITE_URL } from "@/lib/site-url";

const BASE_URL = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/hakkinda",
    "/etkinlikler",
    "/dergi",
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
    const posts = await postRepository.findAll();
    const blogRoutes = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post._id.toString()}`,
      lastModified: new Date(post.date),
    }));
    return [...staticRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
