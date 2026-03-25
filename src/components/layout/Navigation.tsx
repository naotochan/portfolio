"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/lib/i18n";

const navItems = [
  { label: "Home", sectionId: "home", href: "/" },
  { label: "About", sectionId: "about", href: "/about" },
  { label: "Media Art", sectionId: "media-art", href: "/media-art" },
  { label: "Photography", sectionId: "photography", href: "/photography" },
  { label: "Blog", sectionId: "blog", href: "/blog" },
  { label: "Apps", sectionId: "apps", href: "/apps" },
  { label: "Contact", sectionId: "contact", href: "/contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { lang, toggleLang } = useLang();

  useEffect(() => {
    if (!isHome) return;
    const ids = navItems.map((n) => n.sectionId);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [isHome]);

  const handleClick = useCallback(
    (item: (typeof navItems)[0], e: React.MouseEvent) => {
      if (isHome) {
        e.preventDefault();
        const el = document.getElementById(item.sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    },
    [isHome]
  );

  const isActive = (item: (typeof navItems)[0]) => {
    if (isHome) return activeSection === item.sectionId;
    return pathname === item.href;
  };

  return (
    <>
      {/* Desktop — lang toggle top-left */}
      <div className="fixed left-6 top-6 z-50 hidden md:flex items-center gap-1">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant/20 bg-surface/60 backdrop-blur-sm hover:border-primary/40 transition-all"
        >
          <span className={`text-xs font-[family-name:var(--font-label)] tracking-wider transition-colors ${lang === "ja" ? "text-primary" : "text-on-surface-variant/40"}`}>
            JA
          </span>
          <span className="text-on-surface-variant/20 text-xs">/</span>
          <span className={`text-xs font-[family-name:var(--font-label)] tracking-wider transition-colors ${lang === "en" ? "text-primary" : "text-on-surface-variant/40"}`}>
            EN
          </span>
        </button>
      </div>

      {/* Desktop — minimal right side dots + labels on hover */}
      <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-4">
        {navItems.map((item) => (
          <Link
            key={item.sectionId}
            href={isHome ? `#${item.sectionId}` : item.href}
            onClick={(e) => handleClick(item, e)}
            className="group flex items-center gap-3"
          >
            {/* Label — appears on hover */}
            <span
              className={`text-xs font-[family-name:var(--font-label)] tracking-wider transition-all duration-200 ${
                isActive(item)
                  ? "opacity-100 text-primary translate-x-0"
                  : "opacity-0 text-on-surface-variant translate-x-2 group-hover:opacity-70 group-hover:translate-x-0"
              }`}
            >
              {item.label}
            </span>
            {/* Dot */}
            <span
              className={`rounded-full transition-all duration-300 ${
                isActive(item)
                  ? "w-2.5 h-2.5 bg-primary shadow-[0_0_8px_rgba(58,220,204,0.5)]"
                  : "w-1.5 h-1.5 bg-on-surface-variant/30 group-hover:bg-on-surface-variant/60 group-hover:w-2 group-hover:h-2"
              }`}
            />
          </Link>
        ))}
      </nav>

      {/* Mobile — top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="px-6 py-4 flex items-center justify-between bg-surface/80 backdrop-blur-md">
          <Link href="/" className="font-[family-name:var(--font-headline)] text-lg font-bold text-primary">
            7010
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-outline-variant/20"
            >
              <span className={`text-xs font-[family-name:var(--font-label)] tracking-wider ${lang === "ja" ? "text-primary" : "text-on-surface-variant/40"}`}>JA</span>
              <span className="text-on-surface-variant/20 text-xs">/</span>
              <span className={`text-xs font-[family-name:var(--font-label)] tracking-wider ${lang === "en" ? "text-primary" : "text-on-surface-variant/40"}`}>EN</span>
            </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-on-surface p-2"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
          </div>
        </div>
        {isOpen && (
          <div className="bg-surface/90 backdrop-blur-lg px-6 py-4 flex flex-col gap-1 border-t border-outline-variant/10">
            {navItems.map((item) => (
              <Link
                key={item.sectionId}
                href={isHome ? `#${item.sectionId}` : item.href}
                onClick={(e) => handleClick(item, e)}
                className={`px-4 py-3 rounded-lg font-[family-name:var(--font-label)] text-sm tracking-wide transition-colors ${
                  isActive(item)
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
