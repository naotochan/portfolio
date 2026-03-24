const GITHUB_USERNAME = "naotochan";
const TOPIC = "portfolio-showcase";

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
}

export async function getPortfolioRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const repos = await res.json();

    return repos
      .filter((r: Record<string, unknown>) =>
        Array.isArray(r.topics) && (r.topics as string[]).includes(TOPIC)
      )
      .map((r: Record<string, unknown>) => {
        const name = r.name as string;
        const branch = (r.default_branch as string) || "main";
        return {
          name,
          description: (r.description as string) || "",
          url: r.html_url as string,
          homepage: (r.homepage as string) || null,
          language: (r.language as string) || null,
          topics: ((r.topics as string[]) || []).filter((t) => t !== TOPIC),
          stars: (r.stargazers_count as number) || 0,
          updatedAt: r.updated_at as string,
          iconUrl: `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${name}/${branch}/icon.png`,
        };
      })
      .sort((a: GitHubRepo, b: GitHubRepo) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  } catch {
    return [];
  }
}
