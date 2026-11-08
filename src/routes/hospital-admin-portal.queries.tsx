import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { queriesQuery } from "@/lib/admin";

export const Route = createFileRoute("/hospital-admin-portal/queries")({ component: Queries });

function Queries() {
  const qc = useQueryClient();
  const { data = [] } = useQuery(queriesQuery);
  async function toggle(id: string, status: string) {
    const { error } = await supabase.from("queries_contact").update({ status: status === "unread" ? "responded" : "unread" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["admin", "queries"] });
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Patient Queries</h1>
      <div className="space-y-3">
        {data.map((q) => (
          <article key={q.id} className={`rounded-lg border bg-background p-4 ${q.status === "unread" ? "border-sky" : "border-line-soft"}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div><p className="font-bold text-navy">{q.subject}</p><p className="text-xs text-muted-foreground">{q.name} · <a href={`tel:${q.phone}`} className="underline">{q.phone}</a>{q.email ? ` · ${q.email}` : ""} · {new Date(q.created_at).toLocaleString("en-GB")}</p></div>
              <Button size="sm" variant={q.status === "unread" ? "default" : "outline"} className={q.status === "unread" ? "bg-navy" : ""} onClick={() => toggle(q.id, q.status)}>{q.status === "unread" ? "Mark responded" : "Mark unread"}</Button>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm">{q.message}</p>
          </article>
        ))}
        {!data.length && <p className="text-sm text-muted-foreground">No queries yet.</p>}
      </div>
    </div>
  );
}
