interface SectionTitleProps {
  kicker?: string;
  title: string;
  description?: string;
}

export function SectionTitle({ kicker, title, description }: SectionTitleProps) {
  return (
    <header className="space-y-1">
      {kicker ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">{kicker}</p> : null}
      <h2 className="text-2xl font-semibold">{title}</h2>
      {description ? <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p> : null}
    </header>
  );
}
