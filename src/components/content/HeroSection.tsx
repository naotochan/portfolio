import { Button } from "@/components/ui/Button";
import { ParticleBackground } from "@/components/ui/ParticleBackground";

interface HeroSectionProps {
  name: string;
  tagline: string;
  description: string;
}

export function HeroSection({ name, tagline, description }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center px-8 py-24 overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-label)] text-sm text-primary tracking-[0.2em] uppercase mb-4">
            Portfolio
          </p>
          <h1 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-headline)] tracking-tight leading-[1.1] mb-6">
            <span className="text-on-surface">{name}</span>
            <br />
            <span className="gradient-text">{tagline}</span>
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed max-w-xl mb-10">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
