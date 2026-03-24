import { ReactNode } from "react";
import Link from "next/link";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  href,
  type = "button",
  onClick,
  className = "",
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium font-[family-name:var(--font-label)] tracking-wide transition-all";

  const variants = {
    primary: `${base} bg-gradient-to-br from-primary to-primary-container text-on-primary hover:shadow-[0_0_20px_rgba(58,220,204,0.3)]`,
    secondary: `${base} glass text-on-surface hover:bg-surface-container-high`,
    tertiary: `${base} text-primary hover:underline underline-offset-4`,
  };

  const classes = `${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
