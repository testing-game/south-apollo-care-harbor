import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export type DocSection = { id: string; title: string; icon: LucideIcon; lead?: string; body: ReactNode };

/** Two-column reading layout: sticky quick-navigation on the left, numbered content cards on the right. */
export function DocLayout({ label, sections, intro, asideExtra }: { label: string; sections: DocSection[]; intro?: ReactNode; asideExtra?: ReactNode }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    // Highlight the last section whose top has passed just below the fixed header.
    const update = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 160) current = s.id;
      }
      if (atBottom && window.scrollY > 0) {
        const last = sections[sections.length - 1];
        const el = last && document.getElementById(last.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight) current = last.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  function jump(e: React.MouseEvent, id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }

  const fadeUp = (i = 0) => (reduced ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.5, ease: "easeOut" as const, delay: Math.min(i, 2) * 0.05 } });

  return (
    <section className="container-site grid gap-8 py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
      <aside className="lg:col-span-4">
        <div className="space-y-5 lg:sticky lg:top-28">
          <motion.nav {...fadeUp()} aria-label={label} className="rounded-2xl border border-line-soft bg-background p-5 shadow-sm sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-sky">Quick navigation</p>
            <ol className="mt-4 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {sections.map((s, i) => {
                const on = active === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => jump(e, s.id)}
                      aria-current={on ? "location" : undefined}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 ${on ? "bg-navy text-primary-foreground" : "text-navy hover:bg-surface-soft"}`}
                    >
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors duration-200 ${on ? "bg-sky text-primary-foreground" : "bg-surface-soft text-navy group-hover:bg-background"}`}>{i + 1}</span>
                      <span className="leading-snug">{s.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </motion.nav>
          {asideExtra && <motion.div {...fadeUp(1)} className="hidden lg:block">{asideExtra}</motion.div>}
        </div>
      </aside>

      <div className="min-w-0 space-y-6 lg:col-span-8">
        {intro && <motion.div {...fadeUp()}>{intro}</motion.div>}
        {sections.map((s, i) => (
          <motion.article key={s.id} id={s.id} {...fadeUp(i)} className="scroll-mt-28 rounded-2xl border border-line-soft bg-background p-6 shadow-sm sm:p-8">
            <header className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy text-primary-foreground"><s.icon className="h-6 w-6" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky">Section {i + 1}</p>
                <h2 className="mt-1 text-xl font-bold leading-snug text-navy md:text-2xl">{s.title}</h2>
              </div>
            </header>
            {s.lead && <p className="mt-4 leading-relaxed text-muted-foreground">{s.lead}</p>}
            <div className="legal-copy mt-5 space-y-4 leading-relaxed text-muted-foreground">{s.body}</div>
          </motion.article>
        ))}
        {asideExtra && <div className="lg:hidden">{asideExtra}</div>}
      </div>
    </section>
  );
}

/** Small labelled tiles, e.g. opening hours. */
export function InfoTiles({ items }: { items: { label: string; value: ReactNode; note?: string; icon?: LucideIcon }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(({ label, value, note, icon: Icon }) => (
        <div key={label} className="rounded-xl border border-line-soft bg-surface-soft p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky">{Icon && <Icon className="h-4 w-4" />}{label}</p>
          <p className="mt-1.5 text-base font-bold text-navy">{value}</p>
          {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
        </div>
      ))}
    </div>
  );
}

/** Numbered step-by-step process. */
export function Steps({ title, items }: { title?: string; items: ReactNode[] }) {
  return (
    <div>
      {title && <h3 className="mb-3 font-bold text-navy">{title}</h3>}
      <ol className="space-y-3">
        {items.map((t, i) => (
          <li key={i} className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-primary-foreground">{i + 1}</span>
            <span className="min-w-0 pt-0.5 [overflow-wrap:anywhere]">{t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Bulleted checklist with a small sub-heading. */
export function CheckList({ title, items }: { title?: string; items: ReactNode[] }) {
  return (
    <div>
      {title && <h3 className="mb-3 font-bold text-navy">{title}</h3>}
      <ul className="!list-none !pl-0">
        {items.map((t, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky" />
            <span className="min-w-0 [overflow-wrap:anywhere]">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Highlighted note inside a card. */
export function Callout({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border-l-4 border-sky bg-surface-soft p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
      <div className="text-sm leading-relaxed text-navy">{children}</div>
    </div>
  );
}
