import { formatDate } from "@/lib/schedule";

type SearchablePost = { title: string; excerpt: string; content: string; published_date: string; author_name: string | null; type: string };
type SearchableStory = { patient_name: string; treatment_title: string; story_content: string };

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

function matches(fields: (string | null | undefined)[], query: string) {
  const words = norm(query).split(" ").filter(Boolean);
  if (!words.length) return true;
  const haystack = norm(fields.filter(Boolean).join(" "));
  return words.every((w) => haystack.includes(w));
}

/** News: title, summary, content, date (raw and readable). Blogs additionally match the author. */
export function filterPosts<T extends SearchablePost>(posts: T[], query: string): T[] {
  return posts.filter((p) => matches([p.title, p.excerpt, p.content, p.published_date, formatDate(p.published_date), p.author_name], query));
}

/** Stories: patient name, treatment/department title and story content. */
export function filterStories<T extends SearchableStory>(stories: T[], query: string): T[] {
  return stories.filter((s) => matches([s.patient_name, s.treatment_title, s.story_content], query));
}
