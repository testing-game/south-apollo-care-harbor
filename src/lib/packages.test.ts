import { describe, expect, it } from "vitest";
import { PACKAGE_IMAGE_SIZES, filterPackages, homeCardImage, testBookingSchema } from "./packages";

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

describe("package banner sizes", () => {
  it("homepage banner is 1160x1280, a 29:32 portrait", () => {
    const { width, height } = PACKAGE_IMAGE_SIZES.home;
    expect([width, height]).toEqual([1160, 1280]);
    expect(width * 32).toBe(height * 29);
  });
  it("all packages page banner is 1600x1000, a 16:10 landscape", () => {
    const { width, height } = PACKAGE_IMAGE_SIZES.page;
    expect([width, height]).toEqual([1600, 1000]);
    expect(width * 10).toBe(height * 16);
  });
});

describe("homeCardImage", () => {
  it("uses the homepage banner when one is uploaded", () => {
    expect(homeCardImage({ home_image_url: "home.webp", image_url: "page.webp" })).toBe("home.webp");
  });
  it("falls back to the page banner when no homepage banner exists", () => {
    expect(homeCardImage({ home_image_url: "", image_url: "page.webp" })).toBe("page.webp");
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
