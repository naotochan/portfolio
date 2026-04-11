const CAMPAIGN_ID = "15634905";

export interface PatreonPost {
  title: string;
  url: string;
  published: string;
  description: string;
}

export async function getPatreonPosts(): Promise<PatreonPost[]> {
  const token = process.env.PATREON_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(
      `https://www.patreon.com/api/oauth2/v2/campaigns/${CAMPAIGN_ID}/posts?fields%5Bpost%5D=title,published_at,url,content&page%5Bcount%5D=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];

    const json = await res.json();
    return (json.data || []).map(
      (post: { attributes: { title: string; published_at: string; url: string; content: string } }) => {
        const { title, published_at, url, content } = post.attributes;
        const plain = (content || "").replace(/<[^>]*>/g, "").slice(0, 200);
        return {
          title,
          url: `https://www.patreon.com${url}`,
          published: published_at ? new Date(published_at).toISOString() : "",
          description: plain,
        };
      }
    );
  } catch {
    return [];
  }
}
