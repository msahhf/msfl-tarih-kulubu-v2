import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/kullanici/oturumAc",
        destination: "/giris",
        permanent: true,
      },
      {
        source: "/kayitOl",
        destination: "/kayit",
        permanent: true,
      },
      {
        source: "/sifre-unuttum",
        destination: "/sifremi-unuttum",
        permanent: true,
      },
      {
        source: "/@:username",
        destination: "/u/:username",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
