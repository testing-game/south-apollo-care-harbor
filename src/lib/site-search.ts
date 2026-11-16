/**
 * Global site search used by the header search box: matches doctors, specialities,
 * health check packages and key pages in the browser, grouped by category.
 */

export const SEARCH_MIN_CHARS = 2;
export const SEARCH_GROUP_LIMIT = 5;
export const REPORT_URL = "https://report.southapollomedicalcollegehospital.com";

export type PagePath =
  | "/request-appointment" | "/doctors" | "/specialities" | "/health-checkup-all-packages" | "/about" | "/career"
  | "/health-magazine" | "/news" | "/blogs" | "/stories" | "/patient-guide" | "/send-query" | "/privacy-policy";

export type SearchTarget =
  | { kind: "doctor"; id: string }
  | { kind: "speciality"; name: string }
  | { kind: "package"; title: string }
  | { kind: "page"; to: PagePath }
  | { kind: "external"; url: string }
  | { kind: "doctor-list"; search: string }
  | { kind: "speciality-list"; search: string }
  | { kind: "package-list"; search: string };

export type GroupKey = "doctors" | "specialities" | "packages" | "pages";
export type SearchHit = { key: string; group: GroupKey; title: string; subtitle: string; image?: string | undefined; meta?: string | undefined; target: SearchTarget };
export type SearchGroup = { key: GroupKey; label: string; hits: SearchHit[]; total: number };

type DoctorLike = { id: string; name: string; degrees: string; designation: string; department_name: string; image_url: string };
type SpecialityLike = { id: string; name: string; description: string | null };
type PackageLike = { id: string; title: string; included_tests: string[]; price: number | null };
export type SearchData = { doctors: readonly DoctorLike[]; specialities: readonly SpecialityLike[]; packages: readonly PackageLike[] };

export const SITE_PAGES: { title: string; subtitle: string; keywords: string; target: SearchTarget }[] = [
  { title: "Request an Appointment", subtitle: "Book a visit with a consultant", keywords: "book booking appointment serial schedule visit", target: { kind: "page", to: "/request-appointment" } },
  { title: "Find a Doctor", subtitle: "Browse all consultants", keywords: "doctors consultants specialist", target: { kind: "page", to: "/doctors" } },
  { title: "Specialities", subtitle: "All departments and care units", keywords: "departments units services treatment", target: { kind: "page", to: "/specialities" } },
  { title: "Health Check Packages", subtitle: "Preventive check-ups and tests", keywords: "health checkup check up packages tests screening", target: { kind: "page", to: "/health-checkup-all-packages" } },
  { title: "Online Report", subtitle: "Download your test reports", keywords: "report reports lab result results download", target: { kind: "external", url: REPORT_URL } },
  { title: "About Us", subtitle: "Our hospital and history", keywords: "about hospital history mission", target: { kind: "page", to: "/about" } },
  { title: "Career", subtitle: "Job circulars and vacancies", keywords: "career careers job jobs vacancy circular recruitment", target: { kind: "page", to: "/career" } },
  { title: "Health Magazine", subtitle: "Our health magazine", keywords: "magazine pulse health issue", target: { kind: "page", to: "/health-magazine" } },
  { title: "News & Media", subtitle: "Latest hospital news", keywords: "news media press events", target: { kind: "page", to: "/news" } },
  { title: "Blogs", subtitle: "Health articles and tips", keywords: "blog blogs articles tips", target: { kind: "page", to: "/blogs" } },
  { title: "Patient Stories", subtitle: "Experiences from our patients", keywords: "stories testimonials patients experience", target: { kind: "page", to: "/stories" } },
  { title: "Patient Guide", subtitle: "OPD, admission and visiting hours", keywords: "guide opd admission visiting hours facilities", target: { kind: "page", to: "/patient-guide" } },
  { title: "Contact Us", subtitle: "Send a query, phone and address", keywords: "contact query send phone email address location hotline", target: { kind: "page", to: "/send-query" } },
  { title: "Privacy Policy", subtitle: "How we handle your data", keywords: "privacy policy data", target: { kind: "page", to: "/privacy-policy" } },
];

const GROUP_LABELS: Record<GroupKey, string> = { doctors: "Doctors", specialities: "Specialities", packages: "Health Check Packages", pages: "Pages & Services" };

/** Lower-cased words of the query; blank when shorter than the minimum. */
export function searchTokens(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (q.length < SEARCH_MIN_CHARS) return [];
  return q.split(/\s+/).filter(Boolean);
}

const matches = (tokens: string[], haystack: string) => {
  const h = haystack.toLowerCase();
  return tokens.every((t) => h.includes(t));
};

/** Titles that start with the query rank first, then titles containing it, then other-field matches. */
function rank<T>(items: T[], title: (item: T) => string, query: string): T[] {
  const q = query.trim().toLowerCase();
  const score = (item: T) => {
    const t = title(item).toLowerCase().replace(/^dr\.?\s+/, "");
    return t.startsWith(q) || title(item).toLowerCase().startsWith(q) ? 0 : t.includes(q) ? 1 : 2;
  };
  return items.map((item, i) => ({ item, i, s: score(item) })).sort((a, b) => a.s - b.s || a.i - b.i).map((x) => x.item);
}

export function searchSite(data: SearchData, query: string, formatPrice: (p: number | null) => string): SearchGroup[] {
  const tokens = searchTokens(query);
  if (!tokens.length) return [];

  const doctors = rank(data.doctors.filter((d) => matches(tokens, `${d.name} ${d.degrees} ${d.designation} ${d.department_name}`)), (d) => d.name, query)
    .map<SearchHit>((d) => ({ key: `doctor-${d.id}`, group: "doctors", title: d.name, subtitle: d.department_name || d.designation, meta: d.designation && d.department_name ? d.designation : undefined, image: d.image_url || undefined, target: { kind: "doctor", id: d.id } }));

  const specialities = rank(data.specialities.filter((s) => matches(tokens, `${s.name} ${s.description ?? ""}`)), (s) => s.name, query)
    .map<SearchHit>((s) => ({ key: `speciality-${s.id}`, group: "specialities", title: s.name, subtitle: (s.description ?? "").trim() || "Speciality", target: { kind: "speciality", name: s.name } }));

  const packages = rank(data.packages.filter((p) => matches(tokens, `${p.title} ${p.included_tests.join(" ")}`)), (p) => p.title, query)
    .map<SearchHit>((p) => {
      const test = matches(tokens, p.title) ? undefined : p.included_tests.find((t) => tokens.some((tok) => t.toLowerCase().includes(tok)));
      return { key: `package-${p.id}`, group: "packages", title: p.title, subtitle: formatPrice(p.price), meta: test ? `Includes ${test}` : undefined, target: { kind: "package", title: p.title } };
    });

  const pages = rank(SITE_PAGES.filter((p) => matches(tokens, `${p.title} ${p.keywords}`)), (p) => p.title, query)
    .map<SearchHit>((p) => ({ key: `page-${p.title}`, group: "pages", title: p.title, subtitle: p.subtitle, target: p.target }));

  const all: [GroupKey, SearchHit[]][] = [["doctors", doctors], ["specialities", specialities], ["packages", packages], ["pages", pages]];
  return all.filter(([, hits]) => hits.length).map(([key, hits]) => ({ key, label: GROUP_LABELS[key], hits: hits.slice(0, SEARCH_GROUP_LIMIT), total: hits.length }));
}

/** Results in the order they are shown — what arrow keys step through. */
export function flatHits(groups: SearchGroup[]): SearchHit[] {
  return groups.flatMap((g) => g.hits);
}

/**
 * Where Enter / the Search button goes without a highlighted result:
 * a single or exactly named result opens directly; several doctors (then specialities,
 * then packages) open that listing filtered by the query; otherwise the top result.
 */
export function enterTarget(groups: SearchGroup[], query: string): SearchTarget | null {
  const hits = flatHits(groups);
  const first = hits[0];
  if (!first) return null;
  const total = groups.reduce((n, g) => n + g.total, 0);
  if (total === 1) return first.target;
  const q = query.trim().toLowerCase();
  const exact = hits.find((h) => h.title.toLowerCase() === q || h.title.toLowerCase().replace(/^dr\.?\s+/, "") === q);
  if (exact) return exact.target;
  const count = (key: GroupKey) => groups.find((g) => g.key === key)?.total ?? 0;
  const search = query.trim();
  if (count("doctors") > 1) return { kind: "doctor-list", search };
  if (count("specialities") > 1) return { kind: "speciality-list", search };
  if (count("packages") > 1) return { kind: "package-list", search };
  return first.target;
}

/** Search params read by the listing pages (?search=...), tolerant of bad input. */
export function validateListingSearch(search: Record<string, unknown>): { search?: string } {
  const value = search["search"];
  return typeof value === "string" && value.trim() ? { search: value.slice(0, 100) } : {};
}
