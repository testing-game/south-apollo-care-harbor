const files = import.meta.glob<{ url: string }>("../assets/site/*.asset.json", {
  eager: true,
  import: "default",
});

/** Resolve an uploaded design image by its original filename, e.g. asset("logo.png"). */
export function asset(name: string): string {
  return files[`../assets/site/${name}.asset.json`]?.url ?? "";
}
