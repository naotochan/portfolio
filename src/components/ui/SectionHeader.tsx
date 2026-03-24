interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
}

export function SectionHeader({ title, subtitle, gradient = false }: SectionHeaderProps) {
  return (
    <div className="mb-12">
      <h2
        className={`text-4xl md:text-5xl font-bold font-[family-name:var(--font-headline)] tracking-tight ${
          gradient ? "gradient-text" : "text-on-surface"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-on-surface-variant max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
