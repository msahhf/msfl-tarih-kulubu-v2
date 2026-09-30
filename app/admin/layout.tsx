import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { adminLogoutAction } from "@/lib/admin/auth";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin/dashboard", label: "Panel" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar" },
  { href: "/admin/bloglar", label: "Bloglar" },
  { href: "/admin/yorumlar", label: "Yorumlar" },
  { href: "/admin/destek", label: "Destek" },
  { href: "/admin/tarihte-bugun", label: "Tarihte Bugün" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <Container className="py-10">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Yönetim
            </span>
            <h1 className="text-2xl font-display font-bold">Admin Paneli</h1>
          </div>
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="px-4 py-2 bg-destructive/10 text-destructive text-sm font-medium rounded-lg hover:bg-destructive/20 transition-colors"
            >
              Admin Çıkışı
            </button>
          </form>
        </div>

        <nav aria-label="Admin bölümleri" className="flex flex-wrap gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg bg-surface hover:bg-accent/10 hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div>{children}</div>
      </div>
    </Container>
  );
}
