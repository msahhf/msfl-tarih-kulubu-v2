export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "accent" | "destructive";
  className?: string;
}) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-semibold uppercase tracking-[0.08em]";

  const variants = {
    default: "bg-surface border border-border text-muted",
    accent: "bg-accent text-accent-foreground border border-accent",
    destructive: "bg-destructive text-destructive-foreground border border-destructive",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className || ""}`}>
      {children}
    </span>
  );
}
