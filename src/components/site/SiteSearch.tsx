import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileText, Loader2, Package, Search, User, X } from "lucide-react";
import { SpecialityIcon } from "@/components/specialities/SpecialityIcon";
import { doctorsQuery, packagesQuery, specialityRowsQuery } from "@/lib/public-queries";
import { price } from "@/lib/schedule";
import { enterTarget, flatHits, searchSite, searchTokens, type SearchHit, type SearchTarget } from "@/lib/site-search";
import { toSpeciality, type Speciality } from "@/lib/specialities";
import { cn } from "@/lib/utils";

/**
 * Header search: instant results grouped by Doctors, Specialities, Packages and Pages.
 * "compact" sits in the top bar with a floating dropdown; "full" sits in the phone menu with inline results.
 */
export function SiteSearch({ variant = "compact", onNavigate }: { variant?: "compact" | "full"; onNavigate?: () => void }) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const listId = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [wanted, setWanted] = useState(false);

  const doctors = useQuery({ ...doctorsQuery, enabled: wanted });
  const specs = useQuery({ ...specialityRowsQuery, enabled: wanted });
  const packages = useQuery({ ...packagesQuery, enabled: wanted });
  const loading = doctors.isLoading || specs.isLoading || packages.isLoading;

  const specIcons = useMemo(() => new Map<string, Speciality>((specs.data ?? []).map((r) => [r.name, toSpeciality(r)])), [specs.data]);
  const groups = useMemo(
    () => searchSite({ doctors: doctors.data ?? [], specialities: specs.data ?? [], packages: packages.data ?? [] }, query, price),
    [doctors.data, specs.data, packages.data, query],
  );
  const hits = useMemo(() => flatHits(groups), [groups]);
  const ready = searchTokens(query).length > 0;
  const show = open && ready;

  useEffect(() => setActive(-1), [query]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const go = (target: SearchTarget) => {
    setOpen(false);
    inputRef.current?.blur();
    onNavigate?.();
    switch (target.kind) {
      case "doctor": return navigate({ to: "/doctors/$id", params: { id: target.id } });
      case "speciality": return navigate({ to: "/specialities", search: { search: target.name } });
      case "package": return navigate({ to: "/health-checkup-all-packages", search: { search: target.title } });
      case "doctor-list": return navigate({ to: "/doctors", search: { search: target.search } });
      case "speciality-list": return navigate({ to: "/specialities", search: { search: target.search } });
      case "package-list": return navigate({ to: "/health-checkup-all-packages", search: { search: target.search } });
      case "page": return navigate({ to: target.to });
      case "external": window.open(target.url, "_blank", "noopener,noreferrer"); return;
    }
  };

  const submit = () => {
    if (!ready) { inputRef.current?.focus(); return; }
    const picked = hits[active]?.target ?? enterTarget(groups, query);
    if (picked) go(picked);
    else setOpen(true);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!hits.length) return;
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => { const n = i + step; return n < -1 ? hits.length - 1 : n >= hits.length ? -1 : n; });
    } else if (e.key === "Escape") {
      if (show) { e.preventDefault(); setOpen(false); setActive(-1); }
      else if (query) { e.preventDefault(); setQuery(""); }
    }
  };

  useEffect(() => {
    if (active < 0) return;
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId]);

  const compact = variant === "compact";
  let index = -1;
  const results = (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line-soft bg-background text-left text-sm text-foreground shadow-xl",
        compact ? "absolute right-0 top-full z-50 mt-2 w-[min(26rem,calc(100vw-1.5rem))]" : "mt-2",
      )}
    >
      <div id={listId} role="listbox" aria-label="Search results" className={cn("overflow-y-auto overscroll-contain py-2", compact ? "max-h-[min(70vh,32rem)]" : "max-h-[60vh]")}>
        {loading && !hits.length ? (
          <p className="flex items-center gap-2 px-4 py-6 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Searching…</p>
        ) : !hits.length ? (
          <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
            <Search aria-hidden="true" className="h-6 w-6 text-navy/40" />
            <p className="text-muted-foreground">No results found for '<span className="font-semibold text-navy">{query.trim()}</span>'. Try searching for a doctor, department, or health checkup package.</p>
          </div>
        ) : (
          groups.map((g) => (
            <div key={g.key} role="group" aria-label={g.label} className="py-1">
              <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</p>
              {g.hits.map((hit) => {
                index += 1;
                const i = index;
                return (
                  <ResultRow
                    key={hit.key}
                    id={`${listId}-${i}`}
                    hit={hit}
                    active={i === active}
                    icon={hit.group === "specialities" ? specIcons.get(hit.title) : undefined}
                    onHover={() => setActive(i)}
                    onPick={() => go(hit.target)}
                  />
                );
              })}
            </div>
          ))
        )}
      </div>
      {hits.length > 0 && (
        <p className="hidden border-t border-line-soft bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground md:block">
          <kbd className="font-sans font-semibold">↑</kbd> <kbd className="font-sans font-semibold">↓</kbd> to move · <kbd className="font-sans font-semibold">Enter</kbd> to open · <kbd className="font-sans font-semibold">Esc</kbd> to close
        </p>
      )}
    </div>
  );

  return (
    <form
      ref={rootRef}
      role="search"
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      className={cn("relative", compact ? "hidden md:block" : "block")}
    >
      <div
        className={cn(
          "flex items-center gap-1 bg-background text-foreground focus-within:ring-2 focus-within:ring-sky",
          compact ? "rounded-sm py-0.5 pl-2 pr-0.5" : "h-11 border border-speciality-active pl-3 pr-1 text-speciality-active",
        )}
      >
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="Search doctors, specialities, packages and pages"
          aria-expanded={show}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={show && active >= 0 ? `${listId}-${active}` : undefined}
          placeholder={compact ? "Search" : "Search doctors, departments, packages…"}
          value={query}
          autoComplete="off"
          enterKeyHint="search"
          onFocus={() => { setWanted(true); setOpen(true); }}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setWanted(true); }}
          onKeyDown={onKeyDown}
          className={cn(
            "min-w-0 flex-1 bg-transparent outline-hidden [&::-webkit-search-cancel-button]:hidden",
            compact ? "w-40 text-xs xl:w-48" : "text-base font-medium placeholder:text-speciality-active/70",
          )}
        />
        {query && (
          <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }} className={cn("grid shrink-0 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-navy", compact ? "h-5 w-5" : "h-8 w-8")}>
            <X className={compact ? "h-3 w-3" : "h-4 w-4"} />
          </button>
        )}
        <button type="submit" aria-label="Search" className={cn("grid shrink-0 place-items-center rounded-sm transition-colors hover:bg-sky hover:text-primary-foreground", compact ? "h-5 w-6" : "h-8 w-9")}>
          <Search className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        </button>
      </div>
      {compact ? (
        <AnimatePresence>
          {show && (
            <motion.div key="results" initial={{ opacity: 0, y: reduced ? 0 : -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -6 }} transition={{ duration: reduced ? 0 : 0.16, ease: "easeOut" }}>
              {results}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        show && results
      )}
    </form>
  );
}

function ResultRow({ id, hit, active, icon, onHover, onPick }: { id: string; hit: SearchHit; active: boolean; icon?: Speciality | undefined; onHover: () => void; onPick: () => void }) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      tabIndex={-1}
      onMouseEnter={onHover}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onPick}
      className={cn("flex cursor-pointer items-center gap-3 px-4 py-2 transition-colors", active ? "bg-sky/10" : "hover:bg-muted/60")}
    >
      <Thumb hit={hit} icon={icon} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-navy">{hit.title}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {hit.subtitle}{hit.meta ? <span className="text-sky"> · {hit.meta}</span> : null}
        </span>
      </span>
      <ArrowRight aria-hidden="true" className={cn("h-4 w-4 shrink-0 text-sky transition-opacity", active ? "opacity-100" : "opacity-0")} />
    </div>
  );
}

function Thumb({ hit, icon }: { hit: SearchHit; icon?: Speciality | undefined }) {
  const box = "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-muted text-navy";
  if (hit.group === "doctors") {
    return hit.image ? <img src={hit.image} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-full object-cover object-top" /> : <span className={cn(box, "rounded-full")}><User className="h-5 w-5" /></span>;
  }
  if (hit.group === "specialities" && icon) return <span className="grid h-10 w-10 shrink-0 place-items-center"><SpecialityIcon speciality={icon} /></span>;
  if (hit.group === "packages") return <span className={box}><Package className="h-5 w-5" /></span>;
  return <span className={box}><FileText className="h-5 w-5" /></span>;
}
