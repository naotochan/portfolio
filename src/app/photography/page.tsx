import { getAllPhotoSeries } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PhotoSeriesCard } from "@/components/content/PhotoSeriesCard";
import { ContentGrid } from "@/components/ui/ContentGrid";

export default function PhotographyPage() {
  const series = getAllPhotoSeries();

  return (
    <div className="pt-12 md:pt-0 pb-32">
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Photography"
            subtitle="Capturing moments, textures, and light through the lens"
            gradient
          />
          <ContentGrid>
            {series.map((s) => (
              <PhotoSeriesCard key={s.title} {...s} />
            ))}
          </ContentGrid>
        </div>
      </section>
    </div>
  );
}
