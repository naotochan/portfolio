import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { MDXRemote } from "next-mdx-remote/rsc";

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta, content } = getProjectBySlug(slug);

  return (
    <div className="pt-12 md:pt-0 pb-32">
      <section className="px-8 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {meta.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-headline)] text-on-surface mb-4">
            {meta.title}
          </h1>

          <p className="text-lg text-on-surface-variant mb-8">{meta.description}</p>

          {meta.github && (
            <Button href={meta.github} variant="secondary">
              View on GitHub
            </Button>
          )}
        </div>
      </section>

      <section className="px-8 py-16 bg-surface-container-low">
        <div className="max-w-4xl mx-auto prose-invert">
          <div className="text-on-surface-variant leading-relaxed [&_h2]:text-2xl [&_h2]:font-[family-name:var(--font-headline)] [&_h2]:font-bold [&_h2]:text-on-surface [&_h2]:mt-10 [&_h2]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-on-surface-variant [&_p]:mb-4">
            <MDXRemote source={content} />
          </div>
        </div>
      </section>
    </div>
  );
}
