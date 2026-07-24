"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface HorizontalCarouselProps {
  children: ReactNode;
  /** Accessible name for the carousel region */
  label?: string;
}

export function HorizontalCarousel({
  children,
  label = "Item carousel",
}: HorizontalCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    // Content width can change as images/embeds load
    if (el.firstElementChild) observer.observe(el.firstElementChild);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [children]);

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-item]");
    const amount = (card?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div className="relative" role="region" aria-label={label}>
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollByCard(-1)}
          className="absolute left-0 top-1/2 z-10 hidden md:flex -translate-y-1/2 -translate-x-1 w-10 h-10 items-center justify-center rounded-full bg-surface-container-highest/90 text-on-surface border border-outline-variant/40 hover:bg-surface-bright transition-colors"
        >
          ←
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollByCard(1)}
          className="absolute right-0 top-1/2 z-10 hidden md:flex -translate-y-1/2 translate-x-1 w-10 h-10 items-center justify-center rounded-full bg-surface-container-highest/90 text-on-surface border border-outline-variant/40 hover:bg-surface-bright transition-colors"
        >
          →
        </button>
      )}

      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}

export function HorizontalCarouselItem({ children }: { children: ReactNode }) {
  return (
    <div
      data-carousel-item
      className="w-[min(85vw,22rem)] shrink-0 snap-start"
    >
      {children}
    </div>
  );
}

