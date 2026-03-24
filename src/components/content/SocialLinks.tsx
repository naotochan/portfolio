import { GlassCard } from "@/components/ui/GlassCard";

interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

interface SocialLinksProps {
  social: SocialLink[];
  email?: string;
}

const iconMap: Record<string, string> = {
  github: "</>",
  twitter: "𝕏",
  instagram: "IG",
  youtube: "▶",
  patreon: "P",
  soundcloud: "☁",
  linkedin: "in",
  discord: "DC",
  tiktok: "TT",
  spotify: "♫",
  bandcamp: "BC",
  vimeo: "V",
  behance: "Bē",
  dribbble: "Dr",
  mastodon: "M",
  bluesky: "BS",
  threads: "@",
  mail: "✉",
};

export function SocialLinks({ social, email }: SocialLinksProps) {
  const links = [
    ...social.filter((l) => l.url),
    ...(email ? [{ label: "Email", url: `mailto:${email}`, icon: "mail" }] : []),
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {links.map((link) => (
        <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
          <GlassCard className="text-center hover:glow-primary">
            <div className="text-2xl mb-2 text-primary">
              {iconMap[link.icon] ?? link.label.charAt(0)}
            </div>
            <div className="text-sm font-[family-name:var(--font-label)] text-on-surface-variant">
              {link.label}
            </div>
          </GlassCard>
        </a>
      ))}
    </div>
  );
}
