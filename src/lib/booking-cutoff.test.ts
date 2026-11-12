import { describe, expect, it } from "vitest";
import { isPastSameDayCutoff, isPublicDateBookable } from "./booking-cutoff";

// 2026-11-12 in Dhaka (UTC+6): 21:00 Dhaka = 15:00 UTC.
describe("Public same-day 9:00 PM cutoff (Dhaka time)", () => {
  it("allows booking today at 8:59 PM Dhaka", () => {
    const now = new Date("2026-11-12T14:59:00Z");
    expect(isPastSameDayCutoff(now)).toBe(false);
    expect(isPublicDateBookable("2026-11-12", now)).toBe(true);
  });
  it("blocks booking today from 9:00 PM Dhaka", () => {
    const now = new Date("2026-11-12T15:00:00Z");
    expect(isPastSameDayCutoff(now)).toBe(true);
    expect(isPublicDateBookable("2026-11-12", now)).toBe(false);
  });
  it("still allows tomorrow after 9:00 PM", () => {
    expect(isPublicDateBookable("2026-11-13", new Date("2026-11-12T17:30:00Z"))).toBe(true);
  });
  it("reopens same-day booking after midnight Dhaka", () => {
    const now = new Date("2026-11-12T18:05:00Z"); // 00:05 on 13 Nov in Dhaka
    expect(isPastSameDayCutoff(now)).toBe(false);
    expect(isPublicDateBookable("2026-11-13", now)).toBe(true);
  });
});
