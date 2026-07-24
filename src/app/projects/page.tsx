import { getAllProjects } from "@/lib/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/content/ProjectCard";
import { HorizontalCarousel, HorizontalCarouselItem } from "@/components/ui/HorizontalCarousel";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="pt-12 md:pt-0 pb-32">
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Projects"
            subtitle="A collection of things I've built and experiments I've run"
            gradient
          />
          <HorizontalCarousel label="Projects">
            {projects.map((project) => (
              <HorizontalCarouselItem key={project.slug}>
                <ProjectCard {...project} />
              </HorizontalCarouselItem>
            ))}
          </HorizontalCarousel>
        </div>
      </section>
    </div>
  );
}
