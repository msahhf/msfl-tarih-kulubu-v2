export function SectionHeader({
  title,
  description,
  eyebrow,
  className,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className || ""}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <div aria-hidden="true" className="rule-double w-24" />
      {description && (
        <p className="text-muted-foreground text-base leading-relaxed max-w-2xl pt-1">
          {description}
        </p>
      )}
    </div>
  );
}
