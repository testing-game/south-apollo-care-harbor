import { supabase } from "@/integrations/supabase/client";

import { webpFileName, type MediaFolder } from "./media-name";
import { iconFileProblem, iconKind, iconStoragePath } from "./speciality-icon";
import { videoExt, videoFileProblem, videoStoragePath } from "./video";
export type { MediaFolder };

/** Convert any image to WebP in the browser, upload it, and return a long-lived URL. */
export async function uploadWebp(file: File, folder: MediaFolder): Promise<string> {
  const { default: imageCompression } = await import("browser-image-compression");
  const webp = await imageCompression(file, { fileType: "image/webp", maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, initialQuality: 0.85 });
  const path = webpFileName(folder, file.name);
  const { error } = await supabase.storage.from("hospital-media").upload(path, webp, { contentType: "image/webp", upsert: false });
  if (error) throw new Error(error.message);
  // The bucket is private (workspace policy), so store a 10-year signed URL.
  const { data, error: signError } = await supabase.storage.from("hospital-media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signError || !data) throw new Error(signError?.message ?? "Could not create image link");
  return data.signedUrl;
}

/** Upload a speciality icon unchanged (SVG must stay vector) and return a long-lived URL. */
export async function uploadIcon(file: File): Promise<string> {
  const problem = iconFileProblem(file);
  const kind = iconKind(file);
  if (problem || !kind) throw new Error(problem ?? "Choose an SVG or PNG icon file");
  const path = iconStoragePath(file.name, kind);
  const contentType = kind === "svg" ? "image/svg+xml" : "image/png";
  const { error } = await supabase.storage.from("hospital-media").upload(path, file, { contentType, upsert: false, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  const { data, error: signError } = await supabase.storage.from("hospital-media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signError || !data) throw new Error(signError?.message ?? "Could not create icon link");
  return data.signedUrl;
}

/** Upload an MP4/WebM video unchanged and return a long-lived URL (signed URLs support streaming/seeking). */
export async function uploadVideo(file: File, folder: MediaFolder, maxMb: number): Promise<string> {
  const problem = videoFileProblem(file, maxMb);
  const ext = videoExt(file);
  if (problem || !ext) throw new Error(problem ?? "Choose an MP4 or WebM video file");
  const path = videoStoragePath(folder, file.name, ext);
  const { error } = await supabase.storage.from("hospital-media").upload(path, file, { contentType: `video/${ext}`, upsert: false, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  const { data, error: signError } = await supabase.storage.from("hospital-media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signError || !data) throw new Error(signError?.message ?? "Could not create video link");
  return data.signedUrl;
}
