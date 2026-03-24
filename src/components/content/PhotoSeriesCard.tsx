"use client";

import Image from "next/image";
import { useState } from "react";
import { Tag } from "@/components/ui/Tag";
import { Lightbox } from "@/components/ui/Lightbox";
import { cloudinaryUrl } from "@/lib/cloudinary";

interface PhotoSeriesCardProps {
  title: string;
  description: string;
  date: string;
  tags: string[];
  photos?: string[];
  camera?: string;
  location?: string;
  slug: string;
}

function PhotoGrid({ photos, title }: { photos: string[]; title: string }) {
  const count = photos.length;

  if (count === 0) {
    return (
      <div className="aspect-video bg-surface-container-highest flex items-center justify-center text-on-surface-variant text-sm">
        No photos
      </div>
    );
  }

  if (count === 1) {
    return (
      <div className="aspect-video bg-surface-container-highest overflow-hidden">
        <Image
          src={cloudinaryUrl(photos[0], { width: 800, height: 450, crop: "fill", gravity: "auto" })}
          alt={`${title} - 1`}
          width={800}
          height={450}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-px bg-surface-container">
        {photos.slice(0, 2).map((photo, i) => (
          <div key={i} className="aspect-square bg-surface-container-highest overflow-hidden">
            <Image
              src={cloudinaryUrl(photo, { width: 400, height: 400, crop: "fill", gravity: "auto" })}
              alt={`${title} - ${i + 1}`}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-3 gap-px bg-surface-container">
        {photos.slice(0, 3).map((photo, i) => (
          <div key={i} className="aspect-square bg-surface-container-highest overflow-hidden">
            <Image
              src={cloudinaryUrl(photo, { width: 400, height: 400, crop: "fill", gravity: "auto" })}
              alt={`${title} - ${i + 1}`}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    );
  }

  const remaining = count - 3;
  return (
    <div className="grid grid-cols-2 gap-px bg-surface-container">
      <div className="row-span-2 bg-surface-container-highest overflow-hidden">
        <Image
          src={cloudinaryUrl(photos[0], { width: 600, height: 600, crop: "fill", gravity: "auto" })}
          alt={`${title} - 1`}
          width={600}
          height={600}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="bg-surface-container-highest overflow-hidden">
        <Image
          src={cloudinaryUrl(photos[1], { width: 400, height: 300, crop: "fill", gravity: "auto" })}
          alt={`${title} - 2`}
          width={400}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="relative bg-surface-container-highest overflow-hidden">
        <Image
          src={cloudinaryUrl(photos[2], { width: 400, height: 300, crop: "fill", gravity: "auto" })}
          alt={`${title} - 3`}
          width={400}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {remaining > 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-lg font-[family-name:var(--font-headline)] font-bold">
              +{remaining}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function PhotoSeriesCard({ title, description, date, tags, photos, camera, location }: PhotoSeriesCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container-high transition-all group"
      >
        <PhotoGrid photos={photos ?? []} title={title} />

        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-[family-name:var(--font-label)] text-primary tracking-wider uppercase">
              {date}
            </span>
            {location && (
              <span className="text-xs font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider">
                {location}
              </span>
            )}
          </div>

          <h3 className="text-xl font-[family-name:var(--font-headline)] font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
            {description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Tag key={tag} label={tag} variant="outline" />
              ))}
            </div>
            {camera && (
              <span className="text-xs font-[family-name:var(--font-label)] text-on-surface-variant">
                {camera}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modal with lightbox */}
      {isOpen && photos && photos.length > 0 && (
        <LightboxModal
          photos={photos}
          title={title}
          description={description}
          meta={{ date, camera, location, tags }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function LightboxModal({ photos, title, description, meta, onClose }: {
  photos: string[];
  title: string;
  description: string;
  meta: { date?: string; camera?: string; location?: string; tags?: string[] };
  onClose: () => void;
}) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Lightbox photos={photos} title={title} description={description} meta={meta} initialOpen onClose={onClose} />
    </div>
  );
}
