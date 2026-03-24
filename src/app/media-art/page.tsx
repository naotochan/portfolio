import { getAllMediaArt } from "@/lib/content";
import { getYouTubePlaylist } from "@/lib/youtube";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MediaArtCard } from "@/components/content/MediaArtCard";

export default async function MediaArtPage() {
  const jsonWorks = getAllMediaArt();
  const ytVideos = await getYouTubePlaylist();

  // YouTube の videoId を持つ JSON エントリの ID を集める（重複排除用）
  const jsonVideoIds = new Set(jsonWorks.map((w) => w.youtube).filter(Boolean));

  // YouTube プレイリストから、JSON に既に存在しないものだけ追加
  const ytOnly = ytVideos
    .filter((v) => !jsonVideoIds.has(v.videoId))
    .map((v) => ({
      title: v.title,
      description: v.description,
      date: v.published,
      tags: ["TouchDesigner"],
      youtube: v.videoId,
    }));

  // JSON（手動）が先、YouTube 自動取得が後。全体を日付降順
  const allWorks = [...jsonWorks, ...ytOnly].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="pt-12 md:pt-0 pb-32">
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Media Art"
            subtitle="Interactive installations, generative art, and audio-visual experiences"
            gradient
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allWorks.map((work) => (
              <MediaArtCard key={work.youtube ?? work.title} {...work} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
