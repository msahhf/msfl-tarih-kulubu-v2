import Link from "next/link";

export function LinkButton({
  children,
  href,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const baseStyles =
    "inline-block px-6 py-3 rounded-sm font-medium transition-colors duration-150 text-center";

  const variants = {
    primary:
      "bg-accent text-accent-foreground border border-accent hover:bg-accent-strong hover:border-accent-strong",
    secondary:
      "border border-border-strong text-foreground hover:border-accent hover:text-accent",
    ghost: "hover:bg-border/40 text-foreground",
  };

  return (
    <Link
      href={href}
      className={`${baseStyles} ${variants[variant]} ${className || ""}`}
    >
      {children}
    </Link>
  );
}
