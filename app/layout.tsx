import type { Metadata, Viewport } from "next";
import { Cardo, Arimo } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { SocialBar } from "@/components/layout/SocialBar";
import { Footer } from "@/components/layout/Footer";
import { MagazineFooter } from "@/components/layout/MagazineFooter";
import { MagazineNavbar } from "@/components/layout/MagazineNavbar";
import { SITE_URL } from "@/lib/site-url";

/**
 * Dergi, ayrı bir Netlify projesinde bağımsız yayınlanır. O derlemede
 * `NEXT_PUBLIC_MAGAZINE_SITE=1` verilir ve ana site gezinmesi yerine dergi
 * kabuğu (kendi üst/alt menüsü) gösterilir.
 */
const isMagazineSite = process.env.NEXT_PUBLIC_MAGAZINE_SITE === "1";
const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://msfltarihkulubu.netlify.app";

const cardo = Cardo({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-cardo",
  display: "swap",
});

const arimo = Arimo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-arimo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MSFL Tarih Kulübü",
    template: "%s | MSFL Tarih Kulübü",
  },
  description: "Mustafa Saffet Fen Lisesi Tarih Kulübü — dijital arşiv ve araştırma platformu",
  applicationName: "MSFL Tarih Kulübü",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "MSFL Tarih Kulübü",
    title: "MSFL Tarih Kulübü",
    description:
      "Mustafa Saffet Fen Lisesi Tarih Kulübü — dijital arşiv, araştırma ve dergi platformu.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MSFL Tarih Kulübü",
    description:
      "Mustafa Saffet Fen Lisesi Tarih Kulübü — dijital arşiv, araştırma ve dergi platformu.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#731919",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${cardo.variable} ${arimo.variable}`}>
      <body className="min-h-screen bg-background text-foreground flex flex-col antialiased">
        {isMagazineSite ? (
          <MagazineNavbar mainSiteUrl={MAIN_SITE_URL} />
        ) : (
          <>
            <Navbar />
            <SocialBar />
          </>
        )}
        <main className="flex-1">{children}</main>
        {isMagazineSite ? (
          <MagazineFooter mainSiteUrl={MAIN_SITE_URL} />
        ) : (
          <Footer />
        )}
      </body>
    </html>
  );
}
