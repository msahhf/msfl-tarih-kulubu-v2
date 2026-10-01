import Image from "next/image";
import { Container } from "./Container";

/**
 * İçerik sayfaları için görsel başlık bandı — eski sitedeki bölüm arka
 * planlarının modern, responsive karşılığı.
 */
export function PageHero({
  title,
  eyebrow,
  description,
  image = "/img/bg/arsiv.webp",
  overlay = "bg-background/75",
  align = "center",
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  image?: string;
  overlay?: string;
  align?: "center" | "left";
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <Image
        src={image}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className={`absolute inset-0 ${overlay}`} aria-hidden="true" />
      <Container className="relative py-14 sm:py-20">
        <div
          className={`max-w-3xl space-y-3 ${
            align === "center" ? "mx-auto text-center" : "text-left"
          }`}
        >
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
