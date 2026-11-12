import { queryOptions } from "@tanstack/react-query";
import { getPost, getStory, listBanners, listDoctors, listPackages, listPosts, listSocialLinks, listSpecialityRows, listStories } from "./public-data.functions";

export const bannersQuery = queryOptions({ queryKey: ["banners"], queryFn: () => listBanners() });
export const specialityRowsQuery = queryOptions({ queryKey: ["speciality-rows"], queryFn: () => listSpecialityRows() });
export const doctorsQuery = queryOptions({ queryKey: ["doctors"], queryFn: () => listDoctors() });
export const packagesQuery = queryOptions({ queryKey: ["packages"], queryFn: () => listPackages() });
export const storiesQuery = queryOptions({ queryKey: ["stories"], queryFn: () => listStories() });
export const storyQuery = (slug: string) => queryOptions({ queryKey: ["story", slug], queryFn: () => getStory({ data: { slug } }) });
export const postsQuery = (type: "news" | "blog") => queryOptions({ queryKey: ["posts", type], queryFn: () => listPosts({ data: { type } }) });
export const postQuery = (type: "news" | "blog", slug: string) => queryOptions({ queryKey: ["post", type, slug], queryFn: () => getPost({ data: { type, slug } }) });
export const socialLinksQuery = queryOptions({ queryKey: ["social-links"], queryFn: () => listSocialLinks(), staleTime: 5 * 60_000 });
