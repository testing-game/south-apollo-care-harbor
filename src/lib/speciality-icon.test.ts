import { describe, expect, it } from "vitest";
import { iconFileProblem, iconKind, iconStoragePath, pngSizeWarning, uniqueSlug } from "./speciality-icon";

describe("Speciality icon uploads", () => {
  it("accepts only SVG and PNG files", () => {
    expect(iconKind({ type: "image/svg+xml", name: "heart.svg" })).toBe("svg");
    expect(iconKind({ type: "image/png", name: "heart.png" })).toBe("png");
    expect(iconKind({ type: "", name: "heart.SVG" })).toBe("svg");
    expect(iconKind({ type: "image/jpeg", name: "heart.jpg" })).toBeNull();
    expect(iconFileProblem({ type: "image/webp", name: "a.webp", size: 10 })).toBe("Choose an SVG or PNG icon file");
  });
  it("rejects icons over 200 KB", () => {
    expect(iconFileProblem({ type: "image/svg+xml", name: "a.svg", size: 200 * 1024 })).toBeNull();
    expect(iconFileProblem({ type: "image/svg+xml", name: "a.svg", size: 200 * 1024 + 1 })).toMatch(/200 KB/);
  });
  it("warns about non-square or tiny PNGs", () => {
    expect(pngSizeWarning(160, 160)).toBeNull();
    expect(pngSizeWarning(80, 80)).toBeNull();
    expect(pngSizeWarning(160, 120)).toMatch(/square/);
    expect(pngSizeWarning(64, 64)).toMatch(/blurry/);
  });
  it("keeps the original format in the stored file name", () => {
    expect(iconStoragePath("Heart Icon.SVG", "svg", 5)).toBe("specialities/5-heart-icon.svg");
  });
  it("gives new specialities a slug that never clashes", () => {
    expect(uniqueSlug("Accident & Emergency", [])).toBe("accident-emergency");
    expect(uniqueSlug("Accident & Emergency", ["accident-emergency", "accident-emergency-2"])).toBe("accident-emergency-3");
  });
});
