import { getAllApps } from "@/lib/content";
import { getPortfolioRepos } from "@/lib/github";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppCard } from "@/components/content/AppCard";
import { HorizontalCarousel, HorizontalCarouselItem } from "@/components/ui/HorizontalCarousel";

export default async function AppsPage() {
  const jsonApps = getAllApps();
  const repos = await getPortfolioRepos();

  const repoApps = repos.map((r) => ({
    title: r.displayName,
    description: r.description,
    platform: r.platform,
    tags: r.topics,
    iconUrl: r.iconUrl,
    imageUrl: r.imageUrl,
    updatedAt: r.updatedAt,
    links: {
      github: r.url,
      ...(r.homepage ? { appStore: r.homepage } : {}),
    },
  }));

  // JSON apps first, then GitHub repos (deduped by title)
  const jsonTitles = new Set(jsonApps.map((a) => a.title.toLowerCase()));
  const allApps = [
    ...jsonApps,
    ...repoApps.filter((r) => !jsonTitles.has(r.title.toLowerCase())),
  ];

  return (
    <div className="pt-12 md:pt-0 pb-32">
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Apps"
            subtitle="Mobile and desktop applications I've built"
            gradient
          />
          <HorizontalCarousel label="Apps">
            {allApps.map((app) => (
              <HorizontalCarouselItem key={app.title}>
                <AppCard {...app} />
              </HorizontalCarouselItem>
            ))}
          </HorizontalCarousel>
        </div>
      </section>
    </div>
  );
}
