import { todayInDhaka } from "./schedule";

/** Online (public) same-day bookings close at this Dhaka hour; staff bookings are never restricted. */
export const SAME_DAY_CUTOFF_HOUR = 21;

export const SAME_DAY_CUTOFF_MESSAGE =
  "Same-day online appointments close at 9:00 PM. Please select tomorrow or a future date, or call our helpline (+8801885941937) for urgent assistance.";

/** Current hour (0–23) in Bangladesh time (UTC+6, no daylight saving). */
export function dhakaHour(now = new Date()): number {
  return new Date(now.getTime() + 6 * 3600_000).getUTCHours();
}

/** True from 9:00 PM Dhaka time until midnight. */
export function isPastSameDayCutoff(now = new Date()): boolean {
  return dhakaHour(now) >= SAME_DAY_CUTOFF_HOUR;
}

/** Whether a public visitor may still book this YYYY-MM-DD date right now. */
export function isPublicDateBookable(isoDate: string, now = new Date()): boolean {
  const today = todayInDhaka(now);
  if (isoDate < today) return false;
  return !(isoDate === today && isPastSameDayCutoff(now));
}
