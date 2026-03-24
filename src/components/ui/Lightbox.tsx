"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { cloudinaryUrl } from "@/lib/cloudinary";

interface LightboxMeta {
  date?: string;
  camera?: string;
  location?: string;
  tags?: string[];
}

interface LightboxProps {
  photos: string[];
  title: string;
  description?: string;
  meta?: LightboxMeta;
  initialOpen?: boolean;
  onClose?: () => void;
}

export function Lightbox({ photos, title, description, meta, initialOpen, onClose }: LightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(initialOpen ? 0 : null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(initialOpen ?? false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Open: mount → next frame visible
  useEffect(() => {
    if (activeIndex !== null) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    }
  }, [activeIndex]);

  // initialOpen: trigger visible on mount
  useEffect(() => {
    if (initialOpen) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    }
  }, [initialOpen]);

  const close = useCallback(() => {
    setVisible(false);
    // Wait for transition to finish, then unmount
    setTimeout(() => {
      setMounted(false);
      setActiveIndex(null);
      onClose?.();
    }, 300);
  }, [onClose]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : photos.length - 1));
  }, [photos.length]);
  const next = useCallback(() => {
    setActiveIndex((i) => (i !== null && i < photos.length - 1 ? i + 1 : 0));
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, close, prev, next]);

  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  return (
    <>
      {/* Grid — hidden when used as modal-only */}
      {!initialOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="aspect-square overflow-hidden rounded-lg bg-surface-container-highest cursor-pointer group"
            >
              <Image
                src={cloudinaryUrl(photo, { width: 600, height: 600, crop: "fill", gravity: "auto" })}
                alt={`${title} - ${i + 1}`}
                width={600}
                height={600}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal overlay */}
      {mounted && (
        <div
          ref={overlayRef}
          className={`fixed inset-0 z-[100] overflow-y-auto transition-all duration-300 ease-in-out ${
            visible ? "bg-black/95 opacity-100" : "bg-black/0 opacity-0"
          }`}
          onClick={close}
        >
          <div className={`min-h-full flex flex-col items-center py-8 transition-transform duration-300 ease-in-out ${
            visible ? "translate-y-0" : "translate-y-4"
          }`}>
            {/* Top bar */}
            <div className="w-full max-w-5xl px-6 flex items-center justify-between mb-4">
              <div className="text-white/50 text-sm font-[family-name:var(--font-label)]">
                {activeIndex !== null ? activeIndex + 1 : 0} / {photos.length}
              </div>
              <button
                onClick={close}
                className="text-white/70 hover:text-white text-2xl"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Image + nav */}
            {activeIndex !== null && (
              <div className="relative w-full max-w-5xl px-6 flex items-center justify-center">
                {/* Prev */}
                {photos.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-2 md:left-0 text-white/40 hover:text-white text-5xl z-10 select-none"
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                )}

                <div
                  className="flex-1 flex justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={cloudinaryUrl(photos[activeIndex], { width: 1600, quality: 90, format: "auto" })}
                    alt={`${title} - ${activeIndex + 1}`}
                    width={1600}
                    height={1200}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg"
                    priority
                  />
                </div>

                {/* Next */}
                {photos.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-2 md:right-0 text-white/40 hover:text-white text-5xl z-10 select-none"
                    aria-label="Next"
                  >
                    ›
                  </button>
                )}
              </div>
            )}

            {/* Info below the image */}
            <div
              className="w-full max-w-3xl px-6 mt-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-[family-name:var(--font-headline)] font-semibold text-white/90 mb-2">
                {title}
              </h2>

              {/* Metadata row */}
              {meta && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                  {meta.date && (
                    <span className="text-xs font-[family-name:var(--font-label)] text-primary/80 tracking-wider uppercase">
                      {meta.date}
                    </span>
                  )}
                  {meta.camera && (
                    <span className="text-xs font-[family-name:var(--font-label)] text-white/50 tracking-wider">
                      {meta.camera}
                    </span>
                  )}
                  {meta.location && (
                    <span className="text-xs font-[family-name:var(--font-label)] text-white/50 tracking-wider">
                      {meta.location}
                    </span>
                  )}
                </div>
              )}

              {description && (
                <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap mb-3">
                  {description}
                </p>
              )}

              {/* Tags */}
              {meta?.tags && meta.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-[family-name:var(--font-label)] text-white/40 border border-white/10 rounded-full px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
