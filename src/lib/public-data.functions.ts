import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { publicCirculars } from "@/lib/careers";
import { todayInDhaka } from "@/lib/schedule";

type Tables = Database["public"]["Tables"];
export type Doctor = Tables["doctors"]["Row"];
export type HealthPackage = Tables["health_packages"]["Row"];
export type Banner = Tables["hero_banners"]["Row"];
export type Story = Tables["patient_stories"]["Row"];
export type Post = Tables["posts"]["Row"];
export type SpecialityRow = Tables["specialities"]["Row"];
export type JobCircular = Tables["job_circulars"]["Row"];

/** Server-side read-only client using the publishable key (RLS applies as anon). */
function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function rows<T>(res: { data: T[] | null; error: { message: string } | null }): T[] {
  if (res.error) {
    console.error(res.error.message);
    return [];
  }
  return res.data ?? [];
}

export const listBanners = createServerFn({ method: "GET" }).handler(async () =>
  rows(await publicClient().from("hero_banners").select("*").eq("is_active", true).order("display_order")),
);

export const listSpecialityRows = createServerFn({ method: "GET" }).handler(async () =>
  rows(await publicClient().from("specialities").select("*").order("display_order")),
);

export const listDoctors = createServerFn({ method: "GET" }).handler(async () =>
  rows(await publicClient().from("doctors").select("*").eq("is_active", true).order("name")),
);

export const listPackages = createServerFn({ method: "GET" }).handler(async () =>
  rows(await publicClient().from("health_packages").select("*").eq("is_active", true).order("display_order")),
);

export const listStories = createServerFn({ method: "GET" }).handler(async () =>
  rows(await publicClient().from("patient_stories").select("*").eq("is_published", true).order("created_at", { ascending: false })),
);

export const getStory = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => ({ slug: String(d.slug).slice(0, 200) }))
  .handler(async ({ data }) => {
    const res = await publicClient().from("patient_stories").select("*").eq("is_published", true).eq("slug", data.slug).maybeSingle();
    return res.data ?? null;
  });

export const listPosts = createServerFn({ method: "GET" })
  .inputValidator((d: { type: "news" | "blog" }) => ({ type: d.type === "blog" ? ("blog" as const) : ("news" as const) }))
  .handler(async ({ data }) =>
    rows(await publicClient().from("posts").select("*").eq("is_published", true).eq("type", data.type).order("published_date", { ascending: false })),
  );

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((d: { type: "news" | "blog"; slug: string }) => ({ type: d.type === "blog" ? ("blog" as const) : ("news" as const), slug: String(d.slug).slice(0, 200) }))
  .handler(async ({ data }) => {
    const res = await publicClient().from("posts").select("*").eq("is_published", true).eq("type", data.type).eq("slug", data.slug).maybeSingle();
    return res.data ?? null;
  });

export const listSocialLinks = createServerFn({ method: "GET" }).handler(async () =>
  rows(await publicClient().from("social_links").select("platform,url,is_active,display_order").eq("is_active", true).neq("url", "").order("display_order")),
);

/** Open job circulars only: switched on and not past their deadline (Dhaka date). */
export const listJobCirculars = createServerFn({ method: "GET" }).handler(async () =>
  publicCirculars(rows(await publicClient().from("job_circulars").select("*").eq("is_active", true).order("created_at", { ascending: false })), todayInDhaka()),
);
