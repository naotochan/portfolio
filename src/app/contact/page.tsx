import { getSiteConfig } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "@/components/content/ContactForm";
import { SocialLinks } from "@/components/content/SocialLinks";
import { GlassCard } from "@/components/ui/GlassCard";

export default function ContactPage() {
  const site = getSiteConfig();

  return (
    <div className="pt-12 md:pt-0 pb-32">
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Let's Create Together"
            subtitle="Have a project in mind? I'd love to hear about it."
            gradient
          />
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <ContactForm />

          <div className="space-y-8">
            {/* Availability */}
            <GlassCard hover={false}>
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </span>
                <span className="text-sm font-[family-name:var(--font-label)] text-primary tracking-wider uppercase">
                  {site.availability}
                </span>
              </div>
            </GlassCard>

            {/* Location */}
            <GlassCard hover={false}>
              <div className="text-xs font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider uppercase mb-2">
                Location
              </div>
              <p className="text-on-surface">{site.location}</p>
              <p className="text-sm text-on-surface-variant">{site.timezone}</p>
            </GlassCard>

            {/* Social Links */}
            <SocialLinks social={site.social} email={site.email} />
          </div>
        </div>
      </section>
    </div>
  );
}
