import type { Metadata, Viewport } from "next";
import { Cardo, Arimo } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { SocialBar } from "@/components/layout/SocialBar";
import { Footer } from "@/components/layout/Footer";

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
  title: "MSFL Tarih Kulübü",
  description: "Mustafa Saffet Fen Lisesi Tarih Kulübü — dijital arşiv ve araştırma platformu",
  metadataBase: new URL("https://msfl-tarih-kulubu.vercel.app"),
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
        <Navbar />
        <SocialBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
