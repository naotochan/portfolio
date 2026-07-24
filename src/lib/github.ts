const GITHUB_USERNAME = "naotochan";
const TOPIC = "portfolio-showcase";
const PREVIEW_FILES = ["preview.jpg", "preview.png", "preview.webp"] as const;
const DEMO_IMAGE_RE = /\.(png|jpe?g|webp)$/i;
const DEMO_PRIORITY = [
  "usage.png",
  "editor.png",
  "preview.png",
  "preview.jpg",
  "preview.webp",
  "demo.png",
  "screenshot.png",
] as const;

/** GitHub topic → display label for target OS / platform */
const PLATFORM_TOPIC_LABELS: Record<string, string> = {
  macos: "macOS",
  "mac-os": "macOS",
  osx: "macOS",
  ios: "iOS",
  ipados: "iPadOS",
  android: "Android",
  windows: "Windows",
  linux: "Linux",
  web: "Web",
  browser: "Web",
  esp32: "ESP32",
  embedded: "Embedded",
  "cross-platform": "Cross-platform",
};

const PLATFORM_TEXT_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\bmac\s?os\b|\bos\s?x\b/i, label: "macOS" },
  { re: /\bipad\s?os\b/i, label: "iPadOS" },
  { re: /\bios\b/i, label: "iOS" },
  { re: /\bandroid\b/i, label: "Android" },
  { re: /\bwindows\b/i, label: "Windows" },
  { re: /\blinux\b/i, label: "Linux" },
  { re: /esp32/i, label: "ESP32" },
  { re: /\bweb\b/i, label: "Web" },
];

export interface GitHubRepo {
  name: string;
  displayName: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  platform: string;
  topics: string[];
  stars: number;
  createdAt: string;
  updatedAt: string;
  iconUrl: string | null;
  imageUrl: string | null;
}

function rawUrl(name: string, branch: string, file: string) {
  return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${name}/${branch}/${file}`;
}

function withCacheBust(url: string | null, version: string | null | undefined): string | null {
  if (!url || !version) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${encodeURIComponent(version)}`;
}

function stripMarkdown(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRepoImagePath(src: string): string | null {
  const trimmed = src.trim();
  if (
    !trimmed ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("//")
  ) {
    return null;
  }
  return trimmed.replace(/^\.\//, "");
}

async function headOk(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      next: { revalidate: 3600 },
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function resolveReadmePreviewUrl(name: string, branch: string): Promise<string | null> {
  try {
    const res = await fetch(rawUrl(name, branch, "README.md"), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const text = await res.text();
    const beforeGallery = text.split(/^##\s+(Screenshots|スクリーンショット)/im)[0] ?? text;

    const htmlImg = beforeGallery.match(/<img[^>]+src=["']([^"']+)["']/i);
    const mdImg = beforeGallery.match(/!\[[^\]]*\]\(([^)]+)\)/);
    const candidates = [htmlImg?.[1], mdImg?.[1]].filter(Boolean) as string[];

    for (const src of candidates) {
      const path = normalizeRepoImagePath(src);
      if (!path) continue;
      const url = rawUrl(name, branch, path);
      if (await headOk(url)) return url;
    }
  } catch {
    // no README preview
  }

  return null;
}

function pickDemoImage(
  files: { name: string; download_url: string | null; type: string }[]
): string | null {
  const images = files.filter(
    (f) => f.type === "file" && DEMO_IMAGE_RE.test(f.name) && f.download_url
  );
  if (images.length === 0) return null;

  const byPriority = [...images].sort((a, b) => {
    const aIndex = DEMO_PRIORITY.indexOf(a.name as (typeof DEMO_PRIORITY)[number]);
    const bIndex = DEMO_PRIORITY.indexOf(b.name as (typeof DEMO_PRIORITY)[number]);
    const aRank = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
    const bRank = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
    return aRank - bRank;
  });

  return byPriority[0]?.download_url ?? null;
}

async function resolvePreviewUrl(name: string, branch: string): Promise<string | null> {
  for (const file of PREVIEW_FILES) {
    const url = rawUrl(name, branch, file);
    if (await headOk(url)) return url;
  }

  const readmePreview = await resolveReadmePreviewUrl(name, branch);
  if (readmePreview) return readmePreview;

  // Fallback: docs/demo/ (e.g. Flow usage.png, Pashatt editor.png)
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${name}/contents/docs/demo?ref=${branch}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const files = (await res.json()) as { name: string; download_url: string | null; type: string }[];
      const imageUrl = pickDemoImage(files);
      if (imageUrl) return imageUrl;
    }
  } catch {
    // no docs/demo
  }

  return null;
}

async function resolveIconUrl(name: string, branch: string): Promise<string | null> {
  // Prefer newer bundle/brand icons over a possibly stale root icon.png
  const candidates = [
    "docs/brand/simpleshot-icon-1024.png",
    "docs/brand/icon-1024.png",
    "docs/brand/icon.png",
    "src-tauri/icons/icon.png",
    "icon.png",
  ] as const;

  for (const file of candidates) {
    const url = rawUrl(name, branch, file);
    try {
      const res = await fetch(url, {
        method: "HEAD",
        next: { revalidate: 3600 },
      });
      if (res.ok) return url;
    } catch {
      // try next
    }
  }

  return null;
}

async function resolveDisplayMeta(
  name: string,
  branch: string,
  fallbackDescription: string
): Promise<{ displayName: string; description: string }> {
  let displayName = name;
  let description = fallbackDescription;

  // Prefer Tauri productName when present (e.g. SimpleSHOT)
  try {
    const res = await fetch(rawUrl(name, branch, "src-tauri/tauri.conf.json"), {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const conf = (await res.json()) as { productName?: string };
      if (conf.productName?.trim()) {
        displayName = conf.productName.trim();
      }
    }
  } catch {
    // not a Tauri app
  }

  // README H1 / lead paragraph — authoritative display copy
  try {
    const res = await fetch(rawUrl(name, branch, "README.md"), {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const text = await res.text();
      const h1Index = text.search(/^#\s+.+$/m);
      if (h1Index >= 0) {
        const fromTitle = text.slice(h1Index);
        const h1 = fromTitle.match(/^#\s+(.+)$/m);
        if (h1?.[1]?.trim()) {
          displayName = h1[1].trim();
        }

        const afterTitle = fromTitle.replace(/^#\s+.+$/m, "").trimStart();
        const lead = afterTitle
          .split(/\n\s*\n/)
          .map((block) =>
            block
              .split("\n")
              .map((line) => line.trim())
              .filter(
                (line) =>
                  line &&
                  !line.startsWith("#") &&
                  !line.startsWith("<") &&
                  !line.startsWith("!") &&
                  !line.startsWith("[") &&
                  !line.startsWith("---") &&
                  !line.startsWith("**")
              )
              .join(" ")
              .replace(/\s+/g, " ")
              .trim()
          )
          .find(
            (block) =>
              block.length > 12 &&
              !block.includes("|") &&
              !/\[English\]|\[日本語\]|日本語\s*[·•]/.test(block)
          );

        if (lead) {
          description = stripMarkdown(lead);
        }
      }
    }
  } catch {
    // keep fallbacks
  }

  return { displayName, description };
}

function resolvePlatform(topics: string[], description: string, name: string): string {
  const fromTopics = topics
    .map((t) => PLATFORM_TOPIC_LABELS[t.toLowerCase()])
    .filter((label): label is string => Boolean(label));

  if (fromTopics.length > 0) {
    return [...new Set(fromTopics)].join(" / ");
  }

  const haystack = `${description} ${name}`;
  const fromText = PLATFORM_TEXT_PATTERNS
    .filter(({ re }) => re.test(haystack))
    .map(({ label }) => label);

  if (fromText.length > 0) {
    return [...new Set(fromText)].join(" / ");
  }

  return "App";
}

export async function getPortfolioRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const repos = await res.json();

    // Newest update first
    const showcase = repos
      .filter((r: Record<string, unknown>) =>
        Array.isArray(r.topics) && (r.topics as string[]).includes(TOPIC)
      )
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
        new Date(b.updated_at as string).getTime() - new Date(a.updated_at as string).getTime()
      );

    return Promise.all(
      showcase.map(async (r: Record<string, unknown>) => {
        const name = r.name as string;
        const branch = (r.default_branch as string) || "main";
        const topics = ((r.topics as string[]) || []).filter((t) => t !== TOPIC);
        const fallbackDescription = (r.description as string) || "";

        const [imageUrl, iconUrl, displayMeta] = await Promise.all([
          resolvePreviewUrl(name, branch),
          resolveIconUrl(name, branch),
          resolveDisplayMeta(name, branch, fallbackDescription),
        ]);

        return {
          name,
          displayName: displayMeta.displayName,
          description: displayMeta.description,
          url: r.html_url as string,
          homepage: (r.homepage as string) || null,
          language: (r.language as string) || null,
          platform: resolvePlatform(
            topics,
            `${fallbackDescription} ${displayMeta.description}`,
            name
          ),
          topics: topics.filter((t) => !(t.toLowerCase() in PLATFORM_TOPIC_LABELS)),
          stars: (r.stargazers_count as number) || 0,
          createdAt: r.created_at as string,
          updatedAt: r.updated_at as string,
          iconUrl,
          imageUrl: withCacheBust(imageUrl, r.updated_at as string),
        };
      })
    );
  } catch {
    return [];
  }
}
