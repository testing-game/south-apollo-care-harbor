/** Shared rules for hospital videos: upload checks, size guidance and YouTube/Vimeo/direct link parsing. */

export const HERO_VIDEO_MAX_MB = 20;
export const INTRO_VIDEO_MAX_MB = 100;

export const HERO_VIDEO_HINT =
  "Recommended: 1920×565 px (about 3.4:1, same shape as banner pictures), MP4 (H.264) or WebM, 5–15 seconds, no sound needed, under 20 MB. Keep important content in the middle.";
export const HERO_POSTER_HINT = "Shown while the video loads and on devices that block autoplay. 1920×565 px.";
export const INTRO_VIDEO_HINT =
  "Recommended: 16:9 landscape, 1920×1080 px, MP4 (H.264) or WebM, up to 100 MB. For longer videos, upload to YouTube and paste the link instead.";
export const INTRO_POSTER_HINT = "16:9 landscape, 1920×1080 px recommended. Shown with a play button until a visitor clicks.";

export type VideoExt = "mp4" | "webm";
type FileLike = { name: string; type: string; size: number };

export function videoExt(file: FileLike): VideoExt | null {
  const t = file.type.toLowerCase();
  const n = file.name.toLowerCase();
  if (t === "video/mp4" || n.endsWith(".mp4")) return "mp4";
  if (t === "video/webm" || n.endsWith(".webm")) return "webm";
  return null;
}

export function videoFileProblem(file: FileLike, maxMb: number): string | null {
  if (!videoExt(file)) return "Choose an MP4 or WebM video file";
  if (file.size > maxMb * 1024 * 1024) return `Video is too large — keep it under ${maxMb} MB`;
  return null;
}

export function videoStoragePath(folder: string, original: string, ext: VideoExt, stamp = Date.now()) {
  const base = original.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "video";
  return `${folder}/videos/${stamp}-${base}.${ext}`;
}

export type VideoSource =
  | { kind: "youtube"; id: string; embedUrl: string; thumbnail: string }
  | { kind: "vimeo"; id: string; embedUrl: string }
  | { kind: "file"; src: string };

/** Understand a pasted or uploaded video address; null when it is not a usable http(s) video link. */
export function parseVideoUrl(raw: string | null | undefined): VideoSource | null {
  const value = (raw ?? "").trim();
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^(www\.|m\.)/, "");

  if (host === "youtu.be" || host === "youtube.com" || host === "youtube-nocookie.com") {
    const id =
      host === "youtu.be"
        ? url.pathname.split("/")[1]
        : url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/)?.[1];
    if (!id || !/^[\w-]{11}$/.test(id)) return null;
    return { kind: "youtube", id, embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const at = parts.findIndex((p) => /^\d+$/.test(p));
    if (at < 0) return null;
    const id = parts[at]!;
    const hash = url.searchParams.get("h") ?? (parts[at + 1] && /^[a-f0-9]+$/i.test(parts[at + 1]!) ? parts[at + 1] : null);
    return { kind: "vimeo", id, embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1${hash ? `&h=${hash}` : ""}` };
  }

  return { kind: "file", src: url.toString() };
}

export type BannerMedia = { media_type?: unknown; image_url?: unknown; video_url?: unknown };

/** What stops a hero slide from being saved, or null when it is ready. */
export function bannerMediaProblem(row: BannerMedia): string | null {
  if (row.media_type === "video") return String(row.video_url ?? "").trim() ? null : "Upload a short video for this slide";
  return String(row.image_url ?? "").trim() ? null : "Upload a banner image";
}
