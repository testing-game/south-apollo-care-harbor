export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

/** Weekday name for a YYYY-MM-DD date, independent of the viewer's timezone. */
export function weekdayOf(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y!, m! - 1, d!)).getUTCDay()]!;
}

/** Today's date (YYYY-MM-DD) in Bangladesh time, where the hospital operates. */
export function todayInDhaka(now = new Date()): string {
  return new Date(now.getTime() + 6 * 3600_000).toISOString().slice(0, 10);
}

export function isOnDuty(doctor: { is_active: boolean; visiting_days: string[] }, isoDate: string) {
  return doctor.is_active && doctor.visiting_days.includes(weekdayOf(isoDate));
}

/** Next `count` dates (from `fromIso`, inclusive) when a doctor visits. Doctors without set days visit any day. */
export function upcomingVisitDates(visitingDays: string[], fromIso: string, count = 8, horizon = 90): string[] {
  const [y, m, d] = fromIso.split("-").map(Number);
  const out: string[] = [];
  for (let i = 0; i <= horizon && out.length < count; i++) {
    const iso = new Date(Date.UTC(y!, m! - 1, d! + i)).toISOString().slice(0, 10);
    if (visitingDays.length === 0 || visitingDays.includes(weekdayOf(iso))) out.push(iso);
  }
  return out;
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!)).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function youtubeEmbed(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}
