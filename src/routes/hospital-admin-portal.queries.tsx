import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Inbox, Search, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { queriesQuery } from "@/lib/admin";
import { Pagination } from "@/components/admin/Pagination";
import { countByTab, filterInbox, paginate, type InboxTab } from "@/lib/query-inbox";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hospital-admin-portal/queries")({ component: Queries });

type QueryRow = Tables<"queries_contact">;

const TABS: { id: InboxTab; label: string }[] = [
  { id: "unresponded", label: "Unresponded" },
  { id: "responded", label: "Responded" },
];

function Queries() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery(queriesQuery);
  const [tab, setTab] = useState<InboxTab>("unresponded");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState<string | null>(null);

  const counts = useMemo(() => countByTab(data), [data]);
  const filtered = useMemo(() => filterInbox(data, tab, search), [data, tab, search]);
  const view = paginate(filtered, page);

  const switchTab = (t: InboxTab) => { setTab(t); setPage(1); };
  const changeSearch = (v: string) => { setSearch(v); setPage(1); };

  async function setStatus(row: QueryRow, status: "responded" | "unread") {
    setBusy(row.id);
    const { error } = await supabase.from("queries_contact").update({ status }).eq("id", row.id);
    setBusy(null);
    if (error) { toast.error(error.message); return; }
    qc.setQueryData(queriesQuery.queryKey, (old) => old?.map((q) => (q.id === row.id ? { ...q, status } : q)));
    qc.invalidateQueries({ queryKey: ["admin", "queries"] });
    toast.success(status === "responded" ? `Query from ${row.name} marked as responded` : `Query from ${row.name} moved back to Unresponded`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Patient Queries</h1>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Query status" className="inline-flex w-full rounded-lg border border-line-soft bg-surface-soft p-1 md:w-auto">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => switchTab(t.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200 md:flex-none",
                  active ? "bg-navy text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-background hover:text-navy",
                )}
              >
                {t.label}
                <span className={cn("min-w-6 rounded-full px-1.5 py-0.5 text-xs tabular-nums", active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-line-soft text-navy")}>{counts[t.id]}</span>
              </button>
            );
          })}
        </div>
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" aria-label="Search queries" placeholder="Search by name, phone, email, or subject..." value={search} onChange={(e) => changeSearch(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        {view.items.map((q) => (
          <article key={q.id} className={cn("rounded-lg border bg-background p-4", tab === "unresponded" ? "border-sky" : "border-line-soft")}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-navy">{q.subject}</p>
                <p className="text-xs text-muted-foreground [overflow-wrap:anywhere]">
                  {q.name} · <a href={`tel:${q.phone}`} className="underline">{q.phone}</a>
                  {q.email ? <> · <a href={`mailto:${q.email}`} className="underline">{q.email}</a></> : null} · {new Date(q.created_at).toLocaleString("en-GB")}
                </p>
              </div>
              {tab === "unresponded" ? (
                <Button size="sm" className="bg-navy" disabled={busy === q.id} onClick={() => setStatus(q, "responded")}>
                  <CheckCircle2 /> Mark as Responded
                </Button>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-status-done-tint px-2.5 py-1 text-xs font-semibold text-status-done"><CheckCircle2 className="h-3.5 w-3.5" /> Responded</span>
                  <Button size="sm" variant="ghost" className="text-muted-foreground" disabled={busy === q.id} onClick={() => setStatus(q, "unread")}>
                    <Undo2 /> Move back
                  </Button>
                </div>
              )}
            </div>
            <p className="mt-3 whitespace-pre-line text-sm [overflow-wrap:anywhere]">{q.message}</p>
          </article>
        ))}
        {!view.items.length && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-line-soft bg-background py-12 text-center text-sm text-muted-foreground">
            <Inbox className="h-8 w-8 text-sky" />
            {isLoading ? "Loading…" : search.trim() ? "No queries match your search." : tab === "unresponded" ? "All caught up — no unresponded queries." : "No responded queries yet."}
          </div>
        )}
      </div>

      <Pagination view={view} onPage={setPage} noun={["query", "queries"]} />
    </div>
  );
}
