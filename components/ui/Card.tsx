export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-surface border border-border border-t-2 border-t-accent rounded-md shadow-sm ${className || ""}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-6 ${className || ""}`}>{children}</div>;
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-6 pt-0 ${className || ""}`}>{children}</div>;
}
