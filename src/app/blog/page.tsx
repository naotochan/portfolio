import { getAllBlogPosts } from "@/lib/content";
import { getNoteArticles } from "@/lib/note";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BlogCard } from "@/components/content/BlogCard";
import { ContentGrid } from "@/components/ui/ContentGrid";

export default async function BlogPage() {
  const mdxPosts = getAllBlogPosts();
  const noteArticles = await getNoteArticles();

  const notePosts = noteArticles.map((a) => ({
    title: a.title,
    description: a.description,
    date: a.published,
    tags: [] as string[],
    externalUrl: a.url,
    source: "note",
  }));

  const allPosts = [
    ...mdxPosts.map((p) => ({ ...p, externalUrl: undefined, source: undefined })),
    ...notePosts,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="pt-12 md:pt-0 pb-32">
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Blog"
            subtitle="Thoughts, tutorials, and creative coding explorations"
            gradient
          />
          <ContentGrid columns={3}>
            {allPosts.map((post) => (
              <BlogCard
                key={post.externalUrl ?? post.slug}
                title={post.title}
                description={post.description}
                tags={post.tags}
                date={post.date}
                slug={"slug" in post ? post.slug : undefined}
                externalUrl={post.externalUrl}
                source={post.source}
              />
            ))}
          </ContentGrid>
        </div>
      </section>
    </div>
  );
}
