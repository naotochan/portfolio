interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-outline-variant/30" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={index} className="relative pl-12">
            {/* Dot */}
            <div className="absolute left-[11px] top-1.5 w-[10px] h-[10px] rounded-full bg-primary glow-primary" />

            <div className="font-[family-name:var(--font-label)] text-xs text-primary tracking-wider uppercase mb-1">
              {item.year}
            </div>
            <h3 className="text-lg font-[family-name:var(--font-headline)] font-semibold text-on-surface mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
