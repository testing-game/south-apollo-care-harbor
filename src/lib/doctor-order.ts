/** Doctors appear lowest serial first; equal serials fall back to who was added first. */
export type Orderable = { id: string; display_order: number; created_at: string };

export function compareDoctorOrder(a: Orderable, b: Orderable): number {
  return a.display_order - b.display_order || a.created_at.localeCompare(b.created_at);
}

export function sortDoctors<T extends Orderable>(rows: readonly T[]): T[] {
  return [...rows].sort(compareDoctorOrder);
}

/** Serial a newly added doctor gets: one after the current last doctor. */
export function nextSerial(rows: readonly Orderable[]): number {
  return rows.reduce((m, r) => Math.max(m, r.display_order), 0) + 1;
}

/**
 * Moves one doctor past its visible neighbour (the list staff can see, possibly filtered),
 * renumbers everyone 1..n and returns only the rows whose serial changed.
 */
export function moveDoctor(all: readonly Orderable[], visible: readonly Orderable[], id: string, dir: "up" | "down"): { id: string; display_order: number }[] {
  const shown = sortDoctors(visible);
  const at = shown.findIndex((r) => r.id === id);
  const neighbour = shown[dir === "up" ? at - 1 : at + 1];
  if (at < 0 || !neighbour) return [];
  const list = sortDoctors(all).filter((r) => r.id !== id);
  const moving = all.find((r) => r.id === id)!;
  const n = list.findIndex((r) => r.id === neighbour.id);
  list.splice(dir === "up" ? n : n + 1, 0, moving);
  return list.flatMap((r, i) => (r.display_order === i + 1 ? [] : [{ id: r.id, display_order: i + 1 }]));
}
