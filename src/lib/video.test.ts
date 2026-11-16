import { describe, expect, it } from "vitest";
import { bannerMediaProblem, parseVideoUrl, videoFileProblem, videoStoragePath } from "./video";

describe("parseVideoUrl", () => {
  it("reads YouTube watch, short and shorts links", () => {
    for (const u of ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://youtu.be/dQw4w9WgXcQ?t=3", "https://youtube.com/shorts/dQw4w9WgXcQ"]) {
      const s = parseVideoUrl(u);
      expect(s?.kind).toBe("youtube");
      expect(s && "embedUrl" in s && s.embedUrl).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0");
    }
  });
  it("reads Vimeo links including unlisted hashes", () => {
    expect(parseVideoUrl("https://vimeo.com/76979871")).toMatchObject({ kind: "vimeo", embedUrl: "https://player.vimeo.com/video/76979871?autoplay=1" });
    expect(parseVideoUrl("https://vimeo.com/76979871/abc123")).toMatchObject({ embedUrl: "https://player.vimeo.com/video/76979871?autoplay=1&h=abc123" });
  });
  it("treats other web links as direct video files", () => {
    expect(parseVideoUrl("https://cdn.example.com/intro.mp4")).toEqual({ kind: "file", src: "https://cdn.example.com/intro.mp4" });
  });
  it("rejects empty, malformed and non-web links", () => {
    expect(parseVideoUrl("")).toBeNull();
    expect(parseVideoUrl("not a url")).toBeNull();
    expect(parseVideoUrl("javascript:alert(1)")).toBeNull();
    expect(parseVideoUrl("https://youtube.com/watch?v=short")).toBeNull();
  });
});

describe("video uploads", () => {
  it("accepts MP4 and WebM within the size limit", () => {
    expect(videoFileProblem({ name: "a.mp4", type: "video/mp4", size: 5 * 1024 * 1024 }, 20)).toBeNull();
    expect(videoFileProblem({ name: "a.webm", type: "video/webm", size: 1 }, 20)).toBeNull();
  });
  it("rejects other formats and oversized files", () => {
    expect(videoFileProblem({ name: "a.mov", type: "video/quicktime", size: 1 }, 20)).toMatch(/MP4 or WebM/);
    expect(videoFileProblem({ name: "a.mp4", type: "video/mp4", size: 21 * 1024 * 1024 }, 20)).toMatch(/under 20 MB/);
  });
  it("stores videos under the folder's videos path", () => {
    expect(videoStoragePath("banners", "My Clip.MP4", "mp4", 7)).toBe("banners/videos/7-my-clip.mp4");
  });
});

describe("bannerMediaProblem", () => {
  it("needs a video for video slides but not a poster", () => {
    expect(bannerMediaProblem({ media_type: "video", image_url: "", video_url: "" })).toMatch(/video/);
    expect(bannerMediaProblem({ media_type: "video", image_url: "", video_url: "https://x/v.mp4" })).toBeNull();
  });
  it("needs a picture for image slides", () => {
    expect(bannerMediaProblem({ media_type: "image", image_url: "" })).toMatch(/image/);
    expect(bannerMediaProblem({ media_type: "image", image_url: "https://x/a.webp" })).toBeNull();
  });
});
