import { supabase } from "@/integrations/supabase/client";

export type MediaFolder = "banners" | "doctors" | "stories" | "news" | "blogs" | "packages";

export function webpFileName(folder: MediaFolder, original: string, stamp = Date.now()) {
  const base = original.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image";
  return `${folder}/${stamp}-${base}.webp`;
}

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
