const NOTE_USERNAME = "humble_chives594";
const RSS_URL = `https://note.com/${NOTE_USERNAME}/rss`;

export interface NoteArticle {
  title: string;
  url: string;
  published: string;
  description: string;
}

export async function getNoteArticles(): Promise<NoteArticle[]> {
  try {
    const res = await fetch(RSS_URL, { next: { revalidate: 3600 } });
    const xml = await res.text();
    return parseRSS(xml);
  } catch {
    return [];
  }
}

function parseRSS(xml: string): NoteArticle[] {
  const articles: NoteArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const title = extract(item, /<title><!\[CDATA\[(.*?)\]\]><\/title>/)
      || extract(item, /<title>(.*?)<\/title>/);
    const url = extract(item, /<link>(.*?)<\/link>/);
    const pubDate = extract(item, /<pubDate>(.*?)<\/pubDate>/);
    const description = (
      extract(item, /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)
      || extract(item, /<description>([\s\S]*?)<\/description>/)
    ).replace(/<[^>]*>/g, "").slice(0, 200);

    if (title && url) {
      articles.push({
        title,
        url,
        published: pubDate ? new Date(pubDate).toISOString() : "",
        description,
      });
    }
  }

  return articles;
}

function extract(text: string, regex: RegExp): string {
  const m = text.match(regex);
  return m ? m[1].trim() : "";
}
