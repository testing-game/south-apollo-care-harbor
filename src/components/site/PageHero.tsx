import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import campus from "@/assets/about-campus-illustration.jpg";

export function PageHero({ crumb, title, children }: { crumb: string; title: string; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep text-primary-foreground">
      <img src={campus} alt="" width={1440} height={1024} className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="bg-about-overlay absolute inset-0 -z-10" />
      <div className="container-site py-9 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          <ChevronRight className="h-4 w-4 text-sky" />
          <span aria-current="page">{crumb}</span>
        </nav>
        <p className="mb-3 text-sm font-semibold text-sky">South Apollo Medical College Hospital</p>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight md:text-4xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/90">{children}</div>}
      </div>
    </section>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="flex min-h-48 items-center justify-center border border-dashed border-line-soft p-8 text-center text-muted-foreground">{children}</div>;
}

export function meta(title: string, description: string) {
  const full = `${title} | South Apollo Medical College Hospital`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
