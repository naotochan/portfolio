import type { ReactNode } from "react";

interface ContentGridProps {
  children: ReactNode;
  columns?: 2 | 3;
}

export function ContentGrid({ children, columns = 2 }: ContentGridProps) {
  const columnClass =
    columns === 3
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      : "grid grid-cols-1 md:grid-cols-2 gap-6";

  return <div className={columnClass}>{children}</div>;
}
