import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

// Site config
export function getSiteConfig() {
  const filePath = path.join(contentDir, "site.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// About data
export function getAboutData() {
  const filePath = path.join(contentDir, "about.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// Projects
export interface ProjectMeta {
  title: string;
  description: string;
  tags: string[];
  date: string;
  image?: string;
  github?: string;
  featured?: boolean;
  slug: string;
}

export function getAllProjects(): ProjectMeta[] {
  const dir = path.join(contentDir, "projects");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return {
        ...data,
        slug: file.replace(/\.mdx$/, ""),
      } as ProjectMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProjectBySlug(slug: string) {
  const filePath = path.join(contentDir, "projects", `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { meta: { ...data, slug } as ProjectMeta, content };
}

// Blog posts
export interface BlogPostMeta {
  title: string;
  description: string;
  tags: string[];
  date: string;
  image?: string;
  slug: string;
}

export function getAllBlogPosts(): BlogPostMeta[] {
  const dir = path.join(contentDir, "blog");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return {
        ...data,
        slug: file.replace(/\.mdx$/, ""),
      } as BlogPostMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(slug: string) {
  const filePath = path.join(contentDir, "blog", `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { meta: { ...data, slug } as BlogPostMeta, content };
}

// Apps
export interface AppMeta {
  title: string;
  description: string;
  platform: string;
  tags: string[];
  date: string;
  image?: string;
  links?: {
    appStore?: string;
    playStore?: string;
    github?: string;
  };
  featured?: boolean;
}

export function getAllApps(): AppMeta[] {
  const dir = path.join(contentDir, "apps");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      return JSON.parse(raw) as AppMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Photography
export interface PhotoSeriesMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  photos?: string[];
  camera?: string;
  location?: string;
  slug: string;
}

export function getAllPhotoSeries(): PhotoSeriesMeta[] {
  const dir = path.join(contentDir, "photography");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      return {
        ...JSON.parse(raw),
        slug: file.replace(/\.json$/, ""),
      } as PhotoSeriesMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPhotoSeriesBySlug(slug: string): PhotoSeriesMeta {
  const filePath = path.join(contentDir, "photography", `${slug}.json`);
  const raw = fs.readFileSync(filePath, "utf-8");
  return { ...JSON.parse(raw), slug } as PhotoSeriesMeta;
}

// Media Art
export interface MediaArtMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  youtube?: string;
  media?: string[];
  tools?: string[];
  exhibition?: string;
}

export function getAllMediaArt(): MediaArtMeta[] {
  const dir = path.join(contentDir, "media-art");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      return JSON.parse(raw) as MediaArtMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
