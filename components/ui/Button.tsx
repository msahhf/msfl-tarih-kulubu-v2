export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseStyles =
    "px-6 py-3 rounded-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-accent text-accent-foreground border border-accent hover:bg-accent-strong hover:border-accent-strong",
    secondary:
      "border border-border-strong text-foreground hover:border-accent hover:text-accent",
    ghost: "hover:bg-border/40 text-foreground",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
