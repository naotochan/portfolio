import { getSiteConfig } from "@/lib/content";

export function Footer() {
  const site = getSiteConfig();

  return (
    <footer className="bg-surface-container-lowest py-12 px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 flex-wrap">
          {site.social.map((link: { label: string; url: string }) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-colors text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-sm text-on-surface-variant font-[family-name:var(--font-label)]">
          &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
