import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content";
import { Tag } from "@/components/ui/Tag";
import { MDXRemote } from "next-mdx-remote/rsc";

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta, content } = getBlogPostBySlug(slug);

  return (
    <div className="pt-12 md:pt-0 pb-32">
      <section className="px-8 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="font-[family-name:var(--font-label)] text-xs text-on-surface-variant tracking-wider uppercase mb-4">
            {new Date(meta.date).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-headline)] text-on-surface mb-4">
            {meta.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {meta.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-16 bg-surface-container-low">
        <div className="max-w-4xl mx-auto">
          <div className="text-on-surface-variant leading-relaxed [&_h2]:text-2xl [&_h2]:font-[family-name:var(--font-headline)] [&_h2]:font-bold [&_h2]:text-on-surface [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:mb-4">
            <MDXRemote source={content} />
          </div>
        </div>
      </section>
    </div>
  );
}
