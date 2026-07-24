"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface AppsCarouselProps {
  children: ReactNode;
}

export function AppsCarousel({ children }: AppsCarouselProps) {
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

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, []);

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-apps-carousel-item]");
    const amount = (card?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll apps left"
          onClick={() => scrollByCard(-1)}
          className="absolute left-0 top-1/2 z-10 hidden md:flex -translate-y-1/2 -translate-x-1 w-10 h-10 items-center justify-center rounded-full bg-surface-container-highest/90 text-on-surface border border-outline-variant/40 hover:bg-surface-bright transition-colors"
        >
          ←
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll apps right"
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

export function AppsCarouselItem({ children }: { children: ReactNode }) {
  return (
    <div
      data-apps-carousel-item
      className="w-[min(85vw,22rem)] shrink-0 snap-start"
    >
      {children}
    </div>
  );
}
