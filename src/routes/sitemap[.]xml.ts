import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { sitemapHints, sitemapPathForLocation, sitemapStaticPaths, sitemapXML, type SitemapEntry } from "@/lib/sitemap";

const BASE_URL = "https://sa.jahidzone.cv";
const PAGE_SIZE = 1000;

type Source = {
  routeId: string;
  to: "/doctors/$id" | "/health-checkup-packages/$id" | "/news/$slug" | "/blogs/$slug" | "/stories/$slug";
  param: "id" | "slug";
  // Returns one page of public rows: the URL key plus an optional page-specific date.
  fetch: (from: number, to: number) => PromiseLike<{ data: { key: string; date?: string | null }[] | null; error: { message: string } | null }>;
};

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));

        const { createClient } = await import("@supabase/supabase-js");
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
        const supabase = createClient(process.env["SUPABASE_URL"]!, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              // Opaque sb_ keys are not JWTs; send apikey without the default bearer.
              if (key.startsWith("sb_") && headers.get("Authorization") === "Bearer " + key) headers.delete("Authorization");
              headers.set("apikey", key);
              return fetch(input, { ...init, headers });
            },
          },
        });

        const posts = (type: "news" | "blog") => (from: number, to: number) =>
          supabase.from("posts").select("slug, published_date").eq("is_published", true).eq("type", type).order("id").range(from, to)
            .then((r) => ({ data: r.data?.map((p) => ({ key: p.slug, date: p.published_date })) ?? null, error: r.error }));
        const sources: Source[] = [
          { routeId: "/doctors/$id", to: "/doctors/$id", param: "id", fetch: (from, to) => supabase.from("doctors").select("id").eq("is_active", true).order("id").range(from, to).then((r) => ({ data: r.data?.map((d) => ({ key: d.id })) ?? null, error: r.error })) },
          { routeId: "/health-checkup-packages/$id", to: "/health-checkup-packages/$id", param: "id", fetch: (from, to) => supabase.from("health_packages").select("id").eq("is_active", true).order("id").range(from, to).then((r) => ({ data: r.data?.map((p) => ({ key: p.id })) ?? null, error: r.error })) },
          { routeId: "/news/$slug", to: "/news/$slug", param: "slug", fetch: posts("news") },
          { routeId: "/blogs/$slug", to: "/blogs/$slug", param: "slug", fetch: posts("blog") },
          { routeId: "/stories/$slug", to: "/stories/$slug", param: "slug", fetch: (from, to) => supabase.from("patient_stories").select("slug").eq("is_published", true).order("id").range(from, to).then((r) => ({ data: r.data?.map((s) => ({ key: s.slug })) ?? null, error: r.error })) },
        ];

        for (const source of sources) {
          if (!router.routesById[source.routeId as keyof typeof router.routesById]) continue;
          for (let offset = 0; ; ) {
            const { data, error } = await source.fetch(offset, offset + PAGE_SIZE - 1);
            if (error || !data) {
              console.error("sitemap query failed", source.routeId, error?.message);
              return new Response("Sitemap temporarily unavailable", { status: 503, headers: { "Cache-Control": "no-store" } });
            }
            if (data.length === 0) break;
            for (const row of data) {
              const location = router.buildLocation({ to: source.to, params: { [source.param]: row.key } as never, search: () => ({}), hash: "" });
              const path = sitemapPathForLocation(router, location, source.routeId);
              if (path) entries.push({ path, ...(row.date ? { lastmod: row.date } : {}) });
            }
            offset += data.length;
          }
        }

        const withHints = entries.map((e) => ({ ...e, ...sitemapHints(e.path) }));
        return new Response(sitemapXML(BASE_URL, withHints), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
