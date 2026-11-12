import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageNumbers } from "@/lib/query-inbox";
import { cn } from "@/lib/utils";

type View = { current: number; totalPages: number; from: number; to: number; total: number };

/** "Showing X–Y of Z" summary plus Previous / numbered pages / Next, active page in navy. */
export function Pagination({ view, onPage, noun }: { view: View; onPage: (page: number) => void; noun: [singular: string, plural: string] }) {
  if (view.total === 0) return null;
  return (
    <div className="flex flex-col items-center gap-3 border-t border-line-soft pt-4 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted-foreground">Showing {view.from}–{view.to} of {view.total} {view.total === 1 ? noun[0] : noun[1]}</p>
      <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
        <Button size="sm" variant="outline" disabled={view.current === 1} onClick={() => onPage(view.current - 1)}><ChevronLeft /> Previous</Button>
        {pageNumbers(view.current, view.totalPages).map((p, i) =>
          p === "gap" ? (
            <span key={`gap-${i}`} className="px-2 text-muted-foreground">…</span>
          ) : (
            <Button
              key={p}
              size="sm"
              variant={p === view.current ? "default" : "ghost"}
              aria-current={p === view.current ? "page" : undefined}
              className={cn("min-w-9", p === view.current && "bg-navy text-primary-foreground hover:bg-navy")}
              onClick={() => onPage(p)}
            >
              {p}
            </Button>
          ),
        )}
        <Button size="sm" variant="outline" disabled={view.current === view.totalPages} onClick={() => onPage(view.current + 1)}>Next <ChevronRight /></Button>
      </nav>
    </div>
  );
}
