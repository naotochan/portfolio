"use client";

import { Tag } from "@/components/ui/Tag";
import Image from "next/image";
import { useState } from "react";

interface AppCardProps {
  title: string;
  description: string;
  platform: string;
  tags: string[];
  iconUrl?: string | null;
  imageUrl?: string | null;
  image?: string | null;
  links?: {
    appStore?: string;
    playStore?: string;
    github?: string;
  };
  featured?: boolean;
}

export function AppCard({
  title,
  description,
  platform,
  tags,
  iconUrl,
  imageUrl,
  image,
  links,
  featured,
}: AppCardProps) {
  const [iconError, setIconError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const previewSrc = imageUrl ?? image;

  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container-high transition-all hover:scale-[1.02] group">
      <div className="p-6">
        {/* App icon */}
        <div className="w-16 h-16 rounded-2xl bg-surface-container-highest mb-4 overflow-hidden flex items-center justify-center">
          {iconUrl && !iconError ? (
            <Image
              src={iconUrl}
              alt={`${title} icon`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              onError={() => setIconError(true)}
            />
          ) : (
            <span className="text-on-surface-variant text-lg font-[family-name:var(--font-headline)] font-bold">
              {title.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          {featured && (
            <span className="text-xs font-[family-name:var(--font-label)] text-secondary tracking-wider uppercase">
              Featured
            </span>
          )}
          <span className="text-xs font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider uppercase">
            {platform}
          </span>
        </div>

        <h3 className="text-xl font-[family-name:var(--font-headline)] font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-on-surface-variant mb-4 line-clamp-3">
          {description}
        </p>

        {previewSrc && !imageError && (
          <div className="aspect-video rounded-lg bg-surface-container-highest overflow-hidden mb-4">
            <Image
              src={previewSrc}
              alt={`${title} preview`}
              width={800}
              height={450}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Tag key={tag} label={tag} variant="outline" />
          ))}
        </div>

        {links && (
          <div className="flex gap-3">
            {links.github && (
              <a href={links.github} target="_blank" rel="noopener noreferrer" className="text-xs font-[family-name:var(--font-label)] text-primary hover:underline underline-offset-4">
                GitHub →
              </a>
            )}
            {links.appStore && (
              <a href={links.appStore} target="_blank" rel="noopener noreferrer" className="text-xs font-[family-name:var(--font-label)] text-primary hover:underline underline-offset-4">
                App Store →
              </a>
            )}
            {links.playStore && (
              <a href={links.playStore} target="_blank" rel="noopener noreferrer" className="text-xs font-[family-name:var(--font-label)] text-primary hover:underline underline-offset-4">
                Play Store →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
