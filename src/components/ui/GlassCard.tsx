import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
  return (
    <div
      className={`glass rounded-xl p-6 ${
        hover ? "hover:bg-surface-container-high transition-all hover:scale-[1.02]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
