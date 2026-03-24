import { Tag } from "@/components/ui/Tag";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  description: string;
  tags: string[];
  date: string;
  slug?: string;
  externalUrl?: string;
  source?: string;
}

export function BlogCard({ title, description, tags, date, slug, externalUrl, source }: BlogCardProps) {
  const content = (
    <div className="bg-surface-container-low rounded-xl p-6 hover:bg-surface-container-high transition-all group h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-[family-name:var(--font-label)] text-xs text-on-surface-variant tracking-wider uppercase">
          {new Date(date).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
        </span>
        {source && (
          <span className="font-[family-name:var(--font-label)] text-xs text-primary/60 tracking-wider">
            {source}
          </span>
        )}
      </div>

      <h3 className="text-lg font-[family-name:var(--font-headline)] font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>

      <p className="text-sm text-on-surface-variant mb-4 line-clamp-3">
        {description}
      </p>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag key={tag} label={tag} variant="outline" />
        ))}
      </div>
    </div>
  );

  if (externalUrl) {
    return (
      <a href={externalUrl} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={`/blog/${slug}`}>
      {content}
    </Link>
  );
}
