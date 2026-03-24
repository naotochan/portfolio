interface SkillBadgeProps {
  name: string;
}

export function SkillBadge({ name }: SkillBadgeProps) {
  return (
    <div className="bg-surface-container-high rounded-lg px-4 py-2 text-sm font-[family-name:var(--font-label)] text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-all">
      {name}
    </div>
  );
}
