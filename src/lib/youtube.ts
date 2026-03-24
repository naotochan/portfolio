const PLAYLIST_ID = "PLk6zI8twAf6d6NYQbHL4fbUBRYVUbdXa_";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;

export interface YouTubeVideo {
  title: string;
  videoId: string;
  published: string;
  description: string;
  thumbnail: string;
}

export async function getYouTubePlaylist(): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(RSS_URL, { next: { revalidate: 3600 } });
    const xml = await res.text();
    return parseRSS(xml);
  } catch {
    return [];
  }
}

function parseRSS(xml: string): YouTubeVideo[] {
  const entries: YouTubeVideo[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    const videoId = extract(entry, /<yt:videoId>(.*?)<\/yt:videoId>/);
    const title = extract(entry, /<title>(.*?)<\/title>/);
    const published = extract(entry, /<published>(.*?)<\/published>/);
    const description = extract(entry, /<media:description>([\s\S]*?)<\/media:description>/).slice(0, 200);
    const thumbnail = videoId
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      : "";

    if (videoId && title) {
      entries.push({ title, videoId, published, description, thumbnail });
    }
  }

  return entries;
}

function extract(text: string, regex: RegExp): string {
  const m = text.match(regex);
  return m ? m[1].trim() : "";
}
