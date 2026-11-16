/** Upload rules for speciality icons, matched to the built-in artwork (80×80 navy PNGs shown at 40×40). */
export const SPECIALITY_ICON_SPEC = {
  displayPx: 40,
  viewBox: "0 0 40 40",
  pngPx: 160,
  pngMinPx: 80,
  maxBytes: 200 * 1024,
  colour: "#002355",
} as const;

export const SPECIALITY_ICON_HINT =
  "SVG (preferred) or transparent PNG · square canvas, SVG viewBox 0 0 40 40 · PNG 160×160 px (min 80×80) · one colour, navy #002355, solid shapes or 2 px strokes · transparent background, about 2 px empty margin · max 200 KB. Turns white automatically on hover.";

export type IconKind = "svg" | "png";

export function iconKind(file: { type: string; name: string }): IconKind | null {
  const ext = file.name.toLowerCase().split(".").pop();
  if (file.type === "image/svg+xml" || (!file.type && ext === "svg")) return "svg";
  if (file.type === "image/png" || (!file.type && ext === "png")) return "png";
  return null;
}

/** Returns a plain-language problem with the chosen file, or null when it can be uploaded. */
export function iconFileProblem(file: { type: string; name: string; size: number }): string | null {
  if (!iconKind(file)) return "Choose an SVG or PNG icon file";
  if (file.size > SPECIALITY_ICON_SPEC.maxBytes) return "Icon is larger than 200 KB — export a smaller file";
  return null;
}

/** Warns (without blocking) when a PNG is not square or too small to stay sharp. */
export function pngSizeWarning(width: number, height: number): string | null {
  if (width !== height) return `Icon is ${width}×${height} px — use a square image so it isn't squashed`;
  if (width < SPECIALITY_ICON_SPEC.pngMinPx) return `Icon is only ${width}×${height} px — it may look blurry; use 160×160 px`;
  return null;
}

export function iconStoragePath(original: string, kind: IconKind, stamp = Date.now()) {
  const base = original.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "icon";
  return `specialities/${stamp}-${base}.${kind}`;
}

export function slugify(name: string) {
  return name.toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "speciality";
}

/** A slug for a new speciality that doesn't clash with any existing one. */
export function uniqueSlug(name: string, taken: readonly string[]) {
  const base = slugify(name);
  const used = new Set(taken);
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}
