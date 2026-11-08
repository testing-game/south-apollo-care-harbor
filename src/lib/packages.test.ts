import { describe, expect, it } from "vitest";
import { filterPackages, packageBadge, testBookingSchema } from "./packages";

const pkgs = [
  { title: "Heart Check (For Men)", included_tests: ["ECG", "Lipid Profile"], is_featured: true },
  { title: "Whole Body Check (For Women Above 45 Years)", included_tests: ["CBC"], is_featured: true },
  { title: "Health Check General (Male Below 40)", included_tests: [], is_featured: false },
];

describe("filterPackages", () => {
  it("matches package titles case-insensitively", () => {
    expect(filterPackages(pkgs, "whole BODY").map((p) => p.title)).toEqual(["Whole Body Check (For Women Above 45 Years)"]);
  });
  it("matches included test names", () => {
    expect(filterPackages(pkgs, "lipid").map((p) => p.title)).toEqual(["Heart Check (For Men)"]);
  });
  it("returns nothing when no package or test matches", () => {
    expect(filterPackages(pkgs, "mri")).toEqual([]);
  });
});

describe("packageBadge", () => {
  it("marks whole body packages as Comprehensive", () => {
    expect(packageBadge(pkgs[1]!, pkgs)).toBe("Comprehensive");
  });
  it("marks featured packages as Recommended when not all are featured", () => {
    expect(packageBadge(pkgs[0]!, pkgs)).toBe("Recommended");
  });
  it("gives no Recommended badge when every package is featured", () => {
    const all = pkgs.map((p) => ({ ...p, is_featured: true }));
    expect(packageBadge(all[0]!, all)).toBeNull();
  });
});

describe("testBookingSchema", () => {
  const ok = { name: "Rahima Begum", phone: "01913240139", age: "42", gender: "Female", date: "2026-11-20" };
  it("accepts a complete booking and converts age to a number", () => {
    expect(testBookingSchema.parse(ok).age).toBe(42);
  });
  it("rejects an age above 120", () => {
    expect(testBookingSchema.safeParse({ ...ok, age: "121" }).success).toBe(false);
  });
  it("requires a gender", () => {
    expect(testBookingSchema.safeParse({ ...ok, gender: "" }).success).toBe(false);
  });
});
