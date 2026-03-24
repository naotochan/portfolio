import { getAllPhotoSeries, getPhotoSeriesBySlug } from "@/lib/content";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Lightbox } from "@/components/ui/Lightbox";

export async function generateStaticParams() {
  const series = getAllPhotoSeries();
  return series.map((s) => ({ slug: s.slug }));
}

export default async function PhotoSeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = getPhotoSeriesBySlug(slug);

  return (
    <div className="pt-12 md:pt-0 pb-32">
      {/* Header */}
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {series.camera && (
              <span className="text-xs font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider uppercase">
                {series.camera}
              </span>
            )}
            {series.location && (
              <span className="text-xs font-[family-name:var(--font-label)] text-on-surface-variant tracking-wider">
                — {series.location}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-headline)] text-on-surface mb-4">
            {series.title}
          </h1>

          <p className="text-lg text-on-surface-variant leading-relaxed max-w-3xl mb-6">
            {series.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {series.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
      </section>

      {/* Photo gallery with lightbox */}
      <section className="px-8 py-16 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          {series.photos && series.photos.length > 0 ? (
            <Lightbox photos={series.photos} title={series.title} description={series.description} />
          ) : (
            <p className="text-on-surface-variant text-center">No photos yet</p>
          )}
        </div>
      </section>

      {/* Back */}
      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Button href="/photography" variant="tertiary">← Back to Photography</Button>
        </div>
      </section>
    </div>
  );
}
