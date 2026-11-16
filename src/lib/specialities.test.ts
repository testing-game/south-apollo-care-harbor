import { describe, expect, it } from "vitest";
import { SPECIALITIES, filterSpecialities, iconFileOf, specialityBatch, specialityPageCount, toSpeciality } from "./specialities";

const list = SPECIALITIES.map((s, i) => toSpeciality({ id: String(i), name: s.title, icon_url: `/__l5e/assets-v1/abc/${s.image}`, description: null }));

describe("Specialities browsing", () => {
  it("keeps a dedicated Figma artwork reference for every built-in speciality", () => {
    expect(SPECIALITIES.every((speciality) => speciality.image.startsWith("speciality-"))).toBe(true);
    expect(new Set(SPECIALITIES.map((speciality) => speciality.image)).size).toBe(44);
    expect(SPECIALITIES.find((speciality) => speciality.title === "Rheumatology")?.overlay).toBe("speciality-vector.svg");
  });
  it("keeps composite geometry for built-in icons stored in the database", () => {
    expect(list.find((s) => s.title === "Rheumatology")).toMatchObject({ artwork: "rheumatology", overlay: "speciality-vector.svg" });
    expect(list.find((s) => s.title === "Neurology")?.artwork).toBe("neurology");
    expect(list.find((s) => s.title === "Urology")?.artwork).toBeUndefined();
  });
  it("renders uploaded icons as-is, ignoring signed-link tokens", () => {
    const up = toSpeciality({ id: "x", name: "Cardiology", icon_url: "https://cdn.test/sign/hospital-media/specialities/1-heart.svg?token=abc", description: "  Heart care  " });
    expect(iconFileOf(up.iconUrl)).toBe("1-heart.svg");
    expect(up.artwork).toBeUndefined();
    expect(up.overlay).toBeUndefined();
    expect(up.description).toBe("Heart care");
  });
  it("shows strictly eight cards in every homepage view", () => {
    for (let page = 0; page < 6; page++) {
      expect(specialityBatch(list, page)).toHaveLength(8);
      expect(new Set(specialityBatch(list, page).map((s) => s.title)).size).toBe(8);
    }
  });
  it("moves forward and clamps the first and last batches", () => {
    expect(specialityBatch(list, 0)[0]?.title).toBe("Accident & Emergency");
    expect(specialityBatch(list, 1)[0]?.title).toBe("Critical Care Units");
    expect(specialityBatch(list, -1)).toEqual(specialityBatch(list, 0));
    expect(specialityBatch(list, 99)).toEqual(specialityBatch(list, 5));
    expect(specialityBatch(list, 5).at(-1)?.title).toBe("Urology");
  });
  it("shows every speciality when there are fewer than eight", () => {
    expect(specialityBatch(list.slice(0, 3), 0)).toHaveLength(3);
    expect(specialityPageCount(list.slice(0, 3))).toBe(1);
    expect(specialityPageCount([])).toBe(1);
    expect(specialityBatch([], 0)).toEqual([]);
  });
  it("filters titles instantly without case or surrounding-space sensitivity", () => {
    expect(filterSpecialities(list, "  CARDIOLOGY  ").map((s) => s.title)).toEqual(["Cardiology Care Centre", "Paediatric Cardiology"]);
    expect(filterSpecialities(list, "no-such-speciality")).toEqual([]);
    expect(filterSpecialities(list, "")).toHaveLength(44);
  });
});
