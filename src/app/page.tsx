import { getSiteConfig, getAllBlogPosts, getAllApps, getAllPhotoSeries, getAllMediaArt, getAboutData, mergePortfolioApps } from "@/lib/content";
import { getYouTubePlaylist } from "@/lib/youtube";
import { getNoteArticles } from "@/lib/note";
import { getPatreonPosts } from "@/lib/patreon";
import { getPortfolioRepos } from "@/lib/github";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { HeroSection } from "@/components/content/HeroSection";
import { BlogCard } from "@/components/content/BlogCard";
import { AppCard } from "@/components/content/AppCard";
import { PhotoSeriesCard } from "@/components/content/PhotoSeriesCard";
import { MediaArtCard } from "@/components/content/MediaArtCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HorizontalCarousel, HorizontalCarouselItem } from "@/components/ui/HorizontalCarousel";
import { SkillBadge } from "@/components/content/SkillBadge";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { BilingualText } from "@/components/content/BilingualText";
import { SocialLinks } from "@/components/content/SocialLinks";

export default async function Home() {
  const site = getSiteConfig();
  const about = getAboutData();

  const jsonMediaArt = getAllMediaArt();
  const ytVideos = await getYouTubePlaylist();
  const jsonVideoIds = new Set(jsonMediaArt.map((w) => w.youtube).filter(Boolean));
  const ytOnly = ytVideos
    .filter((v) => !jsonVideoIds.has(v.videoId))
    .map((v) => ({
      title: v.title,
      description: v.description,
      date: v.published,
      tags: ["TouchDesigner"] as string[],
      youtube: v.videoId,
    }));
  const mediaArt = [...jsonMediaArt, ...ytOnly].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const photos = getAllPhotoSeries();

  const mdxPosts = getAllBlogPosts();
  const noteArticles = await getNoteArticles();
  const patreonPosts = await getPatreonPosts();
  const notePosts = noteArticles.map((a) => ({
    title: a.title,
    description: a.description,
    date: a.published,
    tags: [] as string[],
    externalUrl: a.url,
    source: "note" as const,
  }));
  const patreonItems = patreonPosts.map((p) => ({
    title: p.title,
    description: p.description,
    date: p.published,
    tags: [] as string[],
    externalUrl: p.url,
    source: "patreon" as const,
  }));
  const posts = [
    ...mdxPosts.map((p) => ({ ...p, externalUrl: undefined as undefined, source: undefined as undefined })),
    ...notePosts,
    ...patreonItems,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const jsonApps = getAllApps();
  const repos = await getPortfolioRepos();
  const apps = mergePortfolioApps(jsonApps, repos);

  return (
    <>
      <section id="home">
        <HeroSection
          name={site.name}
          tagline={site.tagline}
          description={site.description}
        />
      </section>

      {/* About */}
      <section id="about" className="px-8 py-16 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="About" subtitle={about.tagline} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left: bio + skills + exploring */}
            <div className="md:col-span-2">
              <div className="mb-8">
                <BilingualText
                  ja={about.bio_ja ?? about.bio}
                  en={about.bio}
                  className="text-on-surface-variant leading-relaxed mb-4 last:mb-0"
                />
              </div>

              <div className="space-y-6 mb-8">
                {about.skills.map((category: { category: string; items: string[] }) => (
                  <div key={category.category}>
                    <h3 className="text-sm font-[family-name:var(--font-label)] text-primary tracking-wider uppercase mb-3">
                      {category.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill: string) => (
                        <SkillBadge key={skill} name={skill} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="text-sm font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider uppercase mr-2">
                  Currently Exploring
                </span>
                {about.currentlyExploring.map((item: string) => (
                  <Tag key={item} label={item} variant="secondary" />
                ))}
              </div>
            </div>

            {/* Right: portrait */}
            <div className="md:col-span-1">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-highest sticky top-8">
                <Image
                  src={cloudinaryUrl("Portfolio_Profile_Image_l5tqxc", { width: 600, height: 800, crop: "fill", gravity: "auto" })}
                  alt="Profile"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Art */}
      <section id="media-art" className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Media Art" subtitle="Interactive installations and generative experiences" />
          <HorizontalCarousel label="Media Art">
            {mediaArt.map((work) => (
              <HorizontalCarouselItem key={work.youtube ?? work.title}>
                <MediaArtCard {...work} />
              </HorizontalCarouselItem>
            ))}
          </HorizontalCarousel>
          <div className="mt-8 text-center">
            <Button href="/media-art" variant="tertiary">View All Works →</Button>
          </div>
        </div>
      </section>

      {/* Photography */}
      <section id="photography" className="px-8 py-16 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Photography" subtitle="Capturing moments through the lens" />
          <HorizontalCarousel label="Photography">
            {photos.map((s) => (
              <HorizontalCarouselItem key={s.title}>
                <PhotoSeriesCard {...s} />
              </HorizontalCarouselItem>
            ))}
          </HorizontalCarousel>
          <div className="mt-8 text-center">
            <Button href="/photography" variant="tertiary">View All Photos →</Button>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section id="posts" className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Posts" subtitle="Thoughts and explorations" />
          <HorizontalCarousel label="Posts">
            {posts.map((post) => (
              <HorizontalCarouselItem key={post.externalUrl ?? post.slug}>
                <BlogCard
                  title={post.title}
                  description={post.description}
                  tags={post.tags}
                  date={post.date}
                  slug={"slug" in post ? post.slug : undefined}
                  externalUrl={post.externalUrl}
                  source={post.source}
                />
              </HorizontalCarouselItem>
            ))}
          </HorizontalCarousel>
          <div className="mt-8 text-center">
            <Button href="/blog" variant="tertiary">Read More →</Button>
          </div>
        </div>
      </section>

      {/* Apps */}
      <section id="apps" className="px-8 py-16 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Apps" subtitle="Mobile and desktop applications" />
          <HorizontalCarousel label="Apps">
            {apps.map((app) => (
              <HorizontalCarouselItem key={app.title}>
                <AppCard {...app} />
              </HorizontalCarouselItem>
            ))}
          </HorizontalCarousel>
          <div className="mt-8 text-center">
            <Button href="/apps" variant="tertiary">View All Apps →</Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Contact" subtitle="Get in touch" />
          <SocialLinks social={site.social} email={site.email} />
        </div>
      </section>
    </>
  );
}
