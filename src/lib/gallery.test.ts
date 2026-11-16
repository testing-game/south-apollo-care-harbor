import { describe, expect, it } from "vitest";
import { GALLERY_MAX_IMAGES, addGalleryImages, galleryImages, galleryRoom, lightboxStep, removeGalleryImage } from "./gallery";

describe("news photo gallery", () => {
  it("drops blanks, duplicates and non-strings while keeping order", () => {
    expect(galleryImages(["a", "", " b ", "a", 3, null])).toEqual(["a", "b"]);
    expect(galleryImages(null)).toEqual([]);
  });

  it("adds new photos after existing ones", () => {
    expect(addGalleryImages(["a"], ["b", "c", "a"])).toEqual(["a", "b", "c"]);
  });

  it("never stores more than the limit", () => {
    const many = Array.from({ length: GALLERY_MAX_IMAGES + 5 }, (_, i) => `u${i}`);
    expect(addGalleryImages([], many)).toHaveLength(GALLERY_MAX_IMAGES);
    expect(galleryRoom(many.slice(0, GALLERY_MAX_IMAGES - 2))).toBe(2);
  });

  it("removes only the chosen photo", () => {
    expect(removeGalleryImage(["a", "b", "c"], 1)).toEqual(["a", "c"]);
  });

  it("wraps next/previous around both ends of the gallery", () => {
    expect(lightboxStep(2, 1, 3)).toBe(0);
    expect(lightboxStep(0, -1, 3)).toBe(2);
    expect(lightboxStep(1, 1, 3)).toBe(2);
  });
});
