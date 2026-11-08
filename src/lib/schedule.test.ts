import { describe, expect, it } from "vitest";
import { isOnDuty, todayInDhaka, upcomingVisitDates, weekdayOf, youtubeEmbed } from "./schedule";
import { webpFileName } from "./media-name";

describe("Doctor schedules", () => {
  it("names weekdays from calendar dates", () => {
    expect(weekdayOf("2026-11-08")).toBe("Sunday");
    expect(weekdayOf("2026-11-14")).toBe("Saturday");
  });
  it("counts a doctor on duty only on visiting days and while active", () => {
    const d = { is_active: true, visiting_days: ["Saturday", "Monday"] };
    expect(isOnDuty(d, "2026-11-14")).toBe(true);
    expect(isOnDuty(d, "2026-11-08")).toBe(false);
    expect(isOnDuty({ ...d, is_active: false }, "2026-11-14")).toBe(false);
  });
  it("uses Bangladesh time for today", () => {
    expect(todayInDhaka(new Date("2026-11-08T19:00:00Z"))).toBe("2026-11-09");
  });
  it("offers only visiting dates for booking", () => {
    expect(upcomingVisitDates(["Monday"], "2026-11-08", 2)).toEqual(["2026-11-09", "2026-11-16"]);
  });
  it("extracts YouTube embeds", () => {
    expect(youtubeEmbed("https://youtu.be/dQw4w9WgXcQ")).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(youtubeEmbed("not a link")).toBeNull();
  });
});

describe("Media uploads", () => {
  it("stores every upload as a .webp file in its folder", () => {
    expect(webpFileName("doctors", "Dr Photo.JPG", 1)).toBe("doctors/1-dr-photo.webp");
  });
});
