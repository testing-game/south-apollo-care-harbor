/** Photo gallery rules shared by the staff News editor and the public article page. */

export const GALLERY_MAX_IMAGES = 40;
export const GALLERY_HINT = `Select several photos at once (up to ${GALLERY_MAX_IMAGES} per article). Each is converted to WebP; landscape 1600×1067 px (3:2) or larger looks best.`;

/** Clean a stored gallery value: keep non-empty unique URLs in their original order. */
export function galleryImages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of value) {
    if (typeof v !== "string") continue;
    const url = v.trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

/** How many more photos can still be added before hitting the limit. */
export function galleryRoom(current: unknown): number {
  return Math.max(0, GALLERY_MAX_IMAGES - galleryImages(current).length);
}

/** Append newly uploaded photos after the existing ones, without duplicates or exceeding the limit. */
export function addGalleryImages(current: unknown, added: string[]): string[] {
  return galleryImages([...galleryImages(current), ...added]).slice(0, GALLERY_MAX_IMAGES);
}

export function removeGalleryImage(current: unknown, index: number): string[] {
  return galleryImages(current).filter((_, i) => i !== index);
}

/** Next/previous index in the lightbox, wrapping around at both ends. */
export function lightboxStep(index: number, delta: number, length: number): number {
  if (length <= 0) return 0;
  return (((index + delta) % length) + length) % length;
}
