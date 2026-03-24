interface TagProps {
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "outline";
}

export function Tag({ label, variant = "primary" }: TagProps) {
  const variants = {
    primary: "bg-primary/15 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    tertiary: "bg-tertiary/15 text-tertiary",
    outline: "bg-surface-container text-on-surface-variant",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-[family-name:var(--font-label)] tracking-wider uppercase ${variants[variant]}`}
    >
      {label}
    </span>
  );
}
