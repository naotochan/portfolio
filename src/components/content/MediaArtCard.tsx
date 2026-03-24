import { Tag } from "@/components/ui/Tag";

interface MediaArtCardProps {
  title: string;
  description: string;
  date: string;
  tags: string[];
  youtube?: string;
  exhibition?: string;
}

export function MediaArtCard({ title, description, date, tags, youtube, exhibition }: MediaArtCardProps) {
  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container-high transition-all">
      {/* YouTube embed or placeholder */}
      <div className="aspect-video bg-surface-container-highest overflow-hidden">
        {youtube ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtube}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm">
            Media
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="font-[family-name:var(--font-label)] text-xs text-primary tracking-wider uppercase mb-2">
          {date}
        </div>

        <h3 className="text-lg font-[family-name:var(--font-headline)] font-semibold text-on-surface mb-2">
          {title}
        </h3>

        {exhibition && (
          <p className="text-xs font-[family-name:var(--font-label)] text-secondary mb-2">{exhibition}</p>
        )}

        <p className="text-sm text-on-surface-variant mb-4 line-clamp-3">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag} label={tag} variant="secondary" />
          ))}
        </div>
      </div>
    </div>
  );
}
