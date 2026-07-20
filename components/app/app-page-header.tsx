interface AppPageHeaderProps {
  title: string;
  description?: string;
}

export function AppPageHeader({ title, description }: AppPageHeaderProps) {
  if (!title && !description) return null;

  return (
    <div className="space-y-2">
      {title ? (
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      ) : null}
      {description ? (
        <p className="max-w-[65ch] text-sm text-muted-foreground leading-relaxed sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
