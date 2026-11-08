export type MediaFolder = "banners" | "doctors" | "stories" | "news" | "blogs" | "packages";

export function webpFileName(folder: MediaFolder, original: string, stamp = Date.now()) {
  const base = original.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "image";
  return `${folder}/${stamp}-${base}.webp`;
}
