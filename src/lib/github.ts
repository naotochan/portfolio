const GITHUB_USERNAME = "naotochan";
const TOPIC = "portfolio-showcase";
const PREVIEW_FILES = ["preview.jpg", "preview.png", "preview.webp"] as const;

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
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  platform: string;
  topics: string[];
  stars: number;
  updatedAt: string;
  iconUrl: string | null;
  imageUrl: string | null;
}

function rawUrl(name: string, branch: string, file: string) {
  return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${name}/${branch}/${file}`;
}

async function resolvePreviewUrl(name: string, branch: string): Promise<string | null> {
  for (const file of PREVIEW_FILES) {
    const url = rawUrl(name, branch, file);
    try {
      const res = await fetch(url, {
        method: "HEAD",
        next: { revalidate: 3600 },
      });
      if (res.ok) return url;
    } catch {
      // try next candidate
    }
  }
  return null;
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
        const imageUrl = await resolvePreviewUrl(name, branch);

        const topics = ((r.topics as string[]) || []).filter((t) => t !== TOPIC);
        const description = (r.description as string) || "";

        return {
          name,
          description,
          url: r.html_url as string,
          homepage: (r.homepage as string) || null,
          language: (r.language as string) || null,
          platform: resolvePlatform(topics, description, name),
          topics: topics.filter((t) => !(t.toLowerCase() in PLATFORM_TOPIC_LABELS)),
          stars: (r.stargazers_count as number) || 0,
          updatedAt: r.updated_at as string,
          iconUrl: rawUrl(name, branch, "icon.png"),
          imageUrl,
        };
      })
    );
  } catch {
    return [];
  }
}
