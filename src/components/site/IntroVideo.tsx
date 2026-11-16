import { useState } from "react";
import { Play } from "lucide-react";
import { parseVideoUrl } from "@/lib/video";

type IntroVideoData = { video_url: string; poster_url: string; title: string };

/** Poster with a play button; the real player (file, YouTube or Vimeo) loads only after a click so the page stays fast. */
export function IntroVideoPlayer({ video }: { video: IntroVideoData }) {
  const [playing, setPlaying] = useState(false);
  const source = parseVideoUrl(video.video_url);
  if (!source) return null;
  const title = video.title || "Hospital intro video";
  const poster = video.poster_url || (source.kind === "youtube" ? source.thumbnail : "");

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-navy shadow-lg ring-1 ring-sky/30">
      {playing ? (
        source.kind === "file" ? (
          <video src={source.src} poster={poster || undefined} controls autoPlay playsInline className="h-full w-full bg-navy object-contain" aria-label={title} />
        ) : (
          <iframe src={source.embedUrl} title={title} className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        )
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${title}`} className="group absolute inset-0 h-full w-full text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky">
          {poster ? (
            <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
          ) : source.kind === "file" ? (
            <video src={`${source.src}#t=0.1`} muted playsInline preload="metadata" className="h-full w-full object-cover" aria-hidden tabIndex={-1} />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-navy to-navy-deep" />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-navy-deep/10 to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
            <span className="absolute h-20 w-20 animate-ping rounded-full bg-sky/40 motion-reduce:animate-none md:h-24 md:w-24" />
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-sky text-navy shadow-lg transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none md:h-20 md:w-20">
              <Play className="ml-1 h-7 w-7 fill-current md:h-8 md:w-8" />
            </span>
          </span>
          {video.title && <span className="absolute inset-x-0 bottom-0 p-5 text-sm font-semibold text-primary-foreground md:p-6 md:text-base">{video.title}</span>}
        </button>
      )}
    </div>
  );
}
