import { describe, expect, it } from "vitest";
import { SPECIALITIES, specialityBatch, filterSpecialities } from "./specialities";

describe("Specialities browsing", () => {
  it("uses a dedicated Figma artwork reference for every speciality with no fallback", () => {
    expect(SPECIALITIES.every((speciality) => speciality.image.startsWith("speciality-"))).toBe(true);
    expect(new Set(SPECIALITIES.map((speciality) => speciality.image)).size).toBe(44);
    expect(SPECIALITIES.find((speciality) => speciality.title === "Nephrology")?.image).toBe("speciality-variant112.png");
    expect(SPECIALITIES.find((speciality) => speciality.title === "Rheumatology")?.overlay).toBe("speciality-vector.svg");
  });
  it("shows strictly eight cards in every homepage view", () => {
    for (let page = 0; page < 6; page++) {
      expect(specialityBatch(page)).toHaveLength(8);
      expect(new Set(specialityBatch(page).map((s) => s.title)).size).toBe(8);
    }
  });
  it("moves forward and clamps the first and last batches", () => {
    expect(specialityBatch(0)[0]?.title).toBe("Accident & Emergency");
    expect(specialityBatch(1)[0]?.title).toBe("Critical Care Units");
    expect(specialityBatch(-1)).toEqual(specialityBatch(0));
    expect(specialityBatch(99)).toEqual(specialityBatch(5));
    expect(specialityBatch(5).at(-1)?.title).toBe("Urology");
  });
  it("includes all 44 distinct supplied specialities", () => {
    expect(SPECIALITIES).toHaveLength(44);
    expect(new Set(SPECIALITIES.map((s) => s.title)).size).toBe(44);
    const visible = new Set(Array.from({ length: 6 }, (_, page) => specialityBatch(page)).flat());
    expect(visible.size).toBe(44);
  });
  it("filters titles instantly without case or surrounding-space sensitivity", () => {
    expect(filterSpecialities("  CARDIOLOGY  ").map((s) => s.title)).toEqual(["Cardiology Care Centre", "Paediatric Cardiology"]);
    expect(filterSpecialities("no-such-speciality")).toEqual([]);
    expect(filterSpecialities("")).toHaveLength(44);
  });
});