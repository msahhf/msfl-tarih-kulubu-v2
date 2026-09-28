export function SectionHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className || ""}`}>
      <h2 className="text-3xl font-display font-bold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg">{description}</p>
      )}
    </div>
  );
}
