import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { embedCommand, inlineEmbedUrl, INTRO_AUTOPLAY_THRESHOLD, parseVideoUrl, type EmbedAction } from "@/lib/video";

type IntroVideoData = { video_url: string; poster_url: string; title: string };

const EMBED_ORIGIN = { youtube: "https://www.youtube-nocookie.com", vimeo: "https://player.vimeo.com" } as const;

/**
 * Intro video that starts buffering as soon as the page opens, plays muted once 40% of it is on screen
 * and pauses when scrolled away. Works for uploaded files and YouTube/Vimeo links; a corner button turns sound on.
 * Visitors who ask their device to reduce motion are never autoplayed — they press play themselves.
 */
export function IntroVideoPlayer({ video }: { video: IntroVideoData }) {
  const source = useMemo(() => parseVideoUrl(video.video_url), [video.video_url]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const inViewRef = useRef(false);
  const mutedRef = useRef(true);
  const [muted, setMuted] = useState(true);

  const send = (action: EmbedAction) => {
    if (!source || source.kind === "file") return;
    frameRef.current?.contentWindow?.postMessage(embedCommand(source.kind, action), EMBED_ORIGIN[source.kind]);
  };

  const play = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = mutedRef.current;
      v.play().catch(() => {
        // Browser refused to start with sound: fall back to muted so it still plays.
        if (!v.muted) { v.muted = true; mutedRef.current = true; setMuted(true); v.play().catch(() => {}); }
      });
      return;
    }
    send(mutedRef.current ? "mute" : "unmute");
    send("play");
  };
  const pause = () => {
    if (videoRef.current) videoRef.current.pause();
    else send("pause");
  };
  const controls = useRef({ play, pause });
  controls.current = { play, pause };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !source || typeof IntersectionObserver === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = !!entry && entry.isIntersecting && entry.intersectionRatio >= INTRO_AUTOPLAY_THRESHOLD - 0.01;
        if (visible === inViewRef.current) return;
        inViewRef.current = visible;
        if (visible) { if (!reduceMotion) controls.current.play(); }
        else controls.current.pause();
      },
      { threshold: [0, INTRO_AUTOPLAY_THRESHOLD] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [source]);

  if (!source) return null;
  const title = video.title || "Hospital intro video";

  const toggleSound = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    const v = videoRef.current;
    if (v) {
      v.muted = next;
      if (!next && v.paused) v.play().catch(() => {});
    } else {
      send(next ? "mute" : "unmute");
      if (!next) send("play");
    }
  };

  // Embedded players need a moment after loading before they accept commands, so apply the state a few times.
  const onFrameLoad = () => {
    for (const delay of [0, 600, 1500]) {
      window.setTimeout(() => {
        if (inViewRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) controls.current.play();
      }, delay);
    }
  };

  return (
    <div ref={wrapRef} className="relative aspect-video w-full overflow-hidden rounded-2xl bg-navy shadow-lg ring-1 ring-sky/30">
      {source.kind === "file" ? (
        <video
          ref={videoRef}
          src={source.src}
          poster={video.poster_url || undefined}
          preload="auto"
          muted
          playsInline
          controls
          onVolumeChange={(e) => { mutedRef.current = e.currentTarget.muted; setMuted(e.currentTarget.muted); }}
          className="h-full w-full bg-navy object-contain"
          aria-label={title}
        />
      ) : (
        <iframe
          ref={frameRef}
          src={inlineEmbedUrl(source)}
          title={title}
          onLoad={onFrameLoad}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      )}
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-navy-deep/80 px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-lg ring-1 ring-sky/50 backdrop-blur-sm transition-colors hover:bg-sky hover:text-navy focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky md:right-4 md:top-4 md:text-sm"
      >
        {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
        {muted ? "Sound on" : "Mute"}
      </button>
    </div>
  );
}
