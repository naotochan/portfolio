import { Tag } from "@/components/ui/Tag";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  slug: string;
  featured?: boolean;
}

export function ProjectCard({ title, description, tags, slug, featured }: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`}>
      <div className="bg-surface-container-low rounded-xl p-6 hover:bg-surface-container-high transition-all hover:scale-[1.02] group">
        {/* Image placeholder */}
        <div className="aspect-video rounded-lg bg-surface-container-highest mb-4 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm">
            Project Image
          </div>
        </div>

        {featured && (
          <span className="inline-block mb-2 text-xs font-[family-name:var(--font-label)] text-secondary tracking-wider uppercase">
            Featured
          </span>
        )}

        <h3 className="text-xl font-[family-name:var(--font-headline)] font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag} label={tag} variant="outline" />
          ))}
        </div>
      </div>
    </Link>
  );
}
