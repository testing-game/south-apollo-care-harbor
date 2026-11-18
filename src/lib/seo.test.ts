import { describe, expect, it } from "vitest";
import { breadcrumbJsonLd, hospitalJsonLd, keywordList, medicalSpecialties, pageHead, physicianJsonLd } from "./seo";
import { sitemapHints } from "./sitemap";

const metaValue = (head: ReturnType<typeof pageHead>, key: string) =>
  head.meta.find((m) => ("name" in m && m.name === key) || ("property" in m && m.property === key)) as { content: string } | undefined;

describe("pageHead", () => {
  const head = pageHead({ path: "/doctors/abc", title: "Dr. A | South Apollo", description: "Profile", crumbs: [{ name: "Find a Doctor", path: "/doctors" }] });

  it("points canonical and og:url at the page itself on the public domain", () => {
    expect(head.links).toEqual([{ rel: "canonical", href: "https://sa.jahidzone.cv/doctors/abc" }]);
    expect(metaValue(head, "og:url")?.content).toBe("https://sa.jahidzone.cv/doctors/abc");
  });

  it("sets the Bangladesh English locale", () => {
    expect(metaValue(head, "og:locale")?.content).toBe("en_BD");
  });

  it("always includes the hospital's core search terms", () => {
    expect(metaValue(head, "keywords")?.content).toContain("South Apollo Medical College Hospital");
    expect(metaValue(head, "keywords")?.content).toContain("Best Hospital in Barishal");
  });

  it("ignores share images that are not absolute https URLs", () => {
    expect(metaValue(pageHead({ path: "/", title: "t", description: "d", image: "/local.png" }), "og:image")).toBeUndefined();
  });
});

describe("structured data", () => {
  it("starts every breadcrumb trail at Home", () => {
    const list = breadcrumbJsonLd([{ name: "About Us", path: "/about" }])["itemListElement"] as { name: string; item: string }[];
    expect(list.map((i) => i.name)).toEqual(["Home", "About Us"]);
    expect(list[1]?.item).toBe("https://sa.jahidzone.cv/about");
  });

  it("lists both hospital phone numbers and Barishal location", () => {
    const h = hospitalJsonLd(["Cardiology Care Centre"]);
    const phones = (h["contactPoint"] as { telephone: string }[]).map((c) => c.telephone);
    expect(phones).toEqual(["+8801885941937", "+8801324165631"]);
    expect(h["alternateName"]).toContain("South Apollo Medical College");
    expect((h["address"] as { addressLocality: string }).addressLocality).toBe("Barishal");
  });

  it("maps department names to schema.org specialties and skips unknown ones", () => {
    expect(medicalSpecialties(["Cardiology Care Centre", "Paediatrics", "Counselling Centre"])).toEqual([
      "https://schema.org/Cardiovascular",
      "https://schema.org/Pediatric",
      "https://schema.org/Psychiatric",
    ]);
    expect(medicalSpecialties(["Critical Care Units"])).toEqual([]);
  });

  it("ties each doctor to the hospital and splits degrees without breaking brackets", () => {
    const p = physicianJsonLd({ id: "x", name: "Dr. A", designation: "Consultant", degrees: "MBBS (Dhaka), DCH (Child, Health)", institution: "", department: "Paediatrics", image: "", bio: "" });
    expect((p["hospitalAffiliation"] as { name: string }).name).toBe("South Apollo Medical College Hospital");
    expect((p["hasCredential"] as { name: string }[]).map((c) => c.name)).toEqual(["MBBS (Dhaka)", "DCH (Child, Health)"]);
  });
});

describe("keywords and sitemap hints", () => {
  it("removes duplicate keywords regardless of case", () => {
    expect(keywordList(["south apollo"]).split(", ").filter((k) => k.toLowerCase() === "south apollo")).toHaveLength(1);
  });

  it("gives the homepage top crawl priority and policy pages the lowest", () => {
    expect(sitemapHints("/").priority).toBe(1);
    expect(sitemapHints("/privacy-policy").priority).toBe(0.3);
    expect(sitemapHints("/doctors/abc").priority).toBe(0.8);
  });
});
