import { describe, expect, it } from "vitest";
import { normalizeSocialUrl, socialLinkSchema, visibleSocialLinks } from "./social-links";

describe("social links", () => {
  it("hides links that are switched off or have no URL", () => {
    const shown = visibleSocialLinks([
      { platform: "facebook", url: "https://facebook.com/southapollo", is_active: true, display_order: 1 },
      { platform: "youtube", url: "https://youtube.com/@southapollo", is_active: false, display_order: 2 },
      { platform: "instagram", url: "", is_active: true, display_order: 3 },
    ]);
    expect(shown.map((l) => l.platform)).toEqual(["facebook"]);
  });
  it("adds https:// to a pasted address without a scheme", () => {
    expect(normalizeSocialUrl("facebook.com/southapollo")).toBe("https://facebook.com/southapollo");
  });
  it("rejects addresses that are not web links", () => {
    expect(normalizeSocialUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeSocialUrl("not a link")).toBeNull();
  });
  it("refuses to switch on a platform without a link", () => {
    expect(socialLinkSchema.safeParse({ url: "", is_active: true }).success).toBe(false);
    expect(socialLinkSchema.safeParse({ url: "", is_active: false }).success).toBe(true);
  });
});
