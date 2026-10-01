import Image from "next/image";

/** Eski sitede (main branch, partials/social-media.handlebars) yer alan
 *  gerçek kulüp sosyal medya hesapları. */
export const SOCIAL_LINKS = [
  {
    key: "instagram",
    label: "Instagram",
    handle: "@msfltarihkulubu",
    href: "https://www.instagram.com/msfl_tarihkulubu/",
    icon: "/img/socialmedia/instagram.webp",
  },
  {
    key: "x",
    label: "X (Twitter)",
    handle: "@msfltarihkulubu",
    href: "https://x.com/msfltarihkulubu",
    icon: "/img/socialmedia/x.webp",
  },
  {
    key: "facebook",
    label: "Facebook",
    handle: "/msfltarihkulubu",
    href: "https://www.facebook.com/profile.php?id=61584218810881",
    icon: "/img/socialmedia/facebook.webp",
  },
  {
    key: "youtube",
    label: "YouTube",
    handle: "MSFL Tarih Kulübü",
    href: "https://www.youtube.com/@ghvmsfltarihkulubu",
    icon: "/img/socialmedia/youtube.webp",
  },
] as const;

/**
 * Kulübün sosyal medya bağlantıları.
 * `variant="bar"` navbar altındaki ince şerit, `variant="footer"` footer içi.
 */
export function SocialLinks({
  variant = "bar",
  className,
}: {
  variant?: "bar" | "footer";
  className?: string;
}) {
  if (variant === "footer") {
    return (
      <ul className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${className || ""}`}>
        {SOCIAL_LINKS.map((s) => (
          <li key={s.key}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <Image src={s.icon} alt="" width={18} height={18} aria-hidden="true" />
              <span>{s.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={`flex items-center justify-center gap-6 sm:gap-10 ${className || ""}`}>
      {SOCIAL_LINKS.map((s) => (
        <li key={s.key}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-accent transition-colors"
            aria-label={`${s.label}: ${s.handle}`}
          >
            <Image
              src={s.icon}
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:-translate-y-0.5"
            />
            <span className="hidden sm:inline">{s.handle}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
