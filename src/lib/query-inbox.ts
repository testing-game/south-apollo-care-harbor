export type InboxTab = "unresponded" | "responded";
export const QUERIES_PER_PAGE = 10;

type InboxQuery = { name: string; phone: string; email: string | null; subject: string; status: string };

/** Anything not yet marked "responded" belongs in the Unresponded tab. */
export const tabOf = (q: { status: string }): InboxTab => (q.status === "responded" ? "responded" : "unresponded");

export function countByTab(list: { status: string }[]) {
  const responded = list.filter((q) => tabOf(q) === "responded").length;
  return { unresponded: list.length - responded, responded };
}

export function filterInbox<T extends InboxQuery>(list: T[], tab: InboxTab, search: string): T[] {
  const n = search.trim().toLowerCase();
  return list.filter((q) => tabOf(q) === tab && (!n || `${q.name} ${q.phone} ${q.email ?? ""} ${q.subject}`.toLowerCase().includes(n)));
}

export function paginate<T>(list: T[], page: number, perPage = QUERIES_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  const items = list.slice(start, start + perPage);
  return { items, current, totalPages, from: items.length ? start + 1 : 0, to: start + items.length, total: list.length };
}

/** Page buttons to show: all pages when 7 or fewer, otherwise first, last and neighbours of the current page. */
export function pageNumbers(current: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, current - 1, current, current + 1].filter((p) => p >= 1 && p <= totalPages));
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i && p - (sorted[i - 1] ?? p) > 1) out.push("gap");
    out.push(p);
  });
  return out;
}
