const GITHUB_USERNAME = "naotochan";
const TOPIC = "portfolio-showcase";
const PREVIEW_FILES = ["preview.jpg", "preview.png", "preview.webp"] as const;

export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
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

        return {
          name,
          description: (r.description as string) || "",
          url: r.html_url as string,
          homepage: (r.homepage as string) || null,
          language: (r.language as string) || null,
          topics: ((r.topics as string[]) || []).filter((t) => t !== TOPIC),
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
