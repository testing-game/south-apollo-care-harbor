import { describe, expect, it } from "vitest";
import { bioParagraphs, isDoctorId, orderedVisitingDays } from "./doctors";

describe("doctor profile helpers", () => {
  it("accepts only row ids as profile addresses", () => {
    expect(isDoctorId("3f2b8c1e-9a4d-4e2b-8f61-0c5d7a9b1e23")).toBe(true);
    expect(isDoctorId("dr-jahid")).toBe(false);
  });

  it("lists visiting days Saturday first", () => {
    expect(orderedVisitingDays(["Monday", "Saturday", "Friday", "Sunday"])).toEqual(["Saturday", "Sunday", "Monday", "Friday"]);
  });

  it("splits the biography into paragraphs on blank lines", () => {
    expect(bioParagraphs("First line\nstill first\n\n  Second  ")).toEqual(["First line\nstill first", "Second"]);
    expect(bioParagraphs("   ")).toEqual([]);
  });
});
