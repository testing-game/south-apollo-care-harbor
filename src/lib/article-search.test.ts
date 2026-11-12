import { describe, expect, it } from "vitest";
import { filterPosts, filterStories } from "./article-search";

const post = { excerpt: "", content: "", author_name: null as string | null, type: "news", published_date: "2026-11-01" };
const posts = [
  { ...post, title: "New Cath Lab Opens", excerpt: "Cardiac care expands" },
  { ...post, title: "Free Eye Camp", content: "Cataract screening for elders", published_date: "2026-03-15" },
  { ...post, title: "Managing Diabetes", type: "blog", author_name: "Dr. Rahman" },
];
const stories = [
  { patient_name: "Ayesha Begum", treatment_title: "Knee Replacement — Orthopaedics", story_content: "Walking again after surgery" },
  { patient_name: "Karim Uddin", treatment_title: "Bypass Surgery", story_content: "Cardiology team saved my life" },
];

describe("news and blog search", () => {
  it("returns everything for an empty query", () => {
    expect(filterPosts(posts, "  ")).toHaveLength(3);
  });
  it("matches title, summary and content, case-insensitively", () => {
    expect(filterPosts(posts, "cath").map((p) => p.title)).toEqual(["New Cath Lab Opens"]);
    expect(filterPosts(posts, "CARDIAC").map((p) => p.title)).toEqual(["New Cath Lab Opens"]);
    expect(filterPosts(posts, "cataract").map((p) => p.title)).toEqual(["Free Eye Camp"]);
  });
  it("matches the published date and the author", () => {
    expect(filterPosts(posts, "mar 2026").map((p) => p.title)).toEqual(["Free Eye Camp"]);
    expect(filterPosts(posts, "rahman").map((p) => p.title)).toEqual(["Managing Diabetes"]);
  });
});

describe("patient story search", () => {
  it("matches patient name, treatment and story content", () => {
    expect(filterStories(stories, "ayesha").map((s) => s.patient_name)).toEqual(["Ayesha Begum"]);
    expect(filterStories(stories, "orthopaedics").map((s) => s.patient_name)).toEqual(["Ayesha Begum"]);
    expect(filterStories(stories, "cardiology").map((s) => s.patient_name)).toEqual(["Karim Uddin"]);
    expect(filterStories(stories, "dental")).toEqual([]);
  });
});
