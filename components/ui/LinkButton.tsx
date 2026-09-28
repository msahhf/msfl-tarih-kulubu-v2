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
  const baseStyles = "inline-block px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90";

  const variants = {
    primary: "bg-accent text-accent-foreground",
    secondary: "border border-border hover:bg-surface",
    ghost: "hover:bg-surface",
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
