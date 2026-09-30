import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/hesap", "/api/", "/giris", "/kayit", "/sifremi-unuttum"],
      },
    ],
    sitemap: "https://msfl-tarih-kulubu.vercel.app/sitemap.xml",
  };
}
