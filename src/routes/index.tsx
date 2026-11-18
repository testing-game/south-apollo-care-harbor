import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { bannersQuery, doctorsQuery, packagesQuery, postsQuery, specialityRowsQuery, storiesQuery } from "@/lib/public-queries";
import { toSpeciality } from "@/lib/specialities";
import { hospitalJsonLd, pageHead, websiteJsonLd } from "@/lib/seo";
import { Hero } from "@/components/landing/Hero";
import { WhyChoose, Specialities } from "@/components/landing/Specialities";
import { Packages, AskBanner, Posts } from "@/components/landing/Content";
import { Corporate, MapSection } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  loader: ({ context: { queryClient: q } }) => Promise.all([q.ensureQueryData(bannersQuery), q.ensureQueryData(packagesQuery), q.ensureQueryData(storiesQuery), q.ensureQueryData(postsQuery("news")), q.ensureQueryData(postsQuery("blog")), q.ensureQueryData(doctorsQuery), q.ensureQueryData(specialityRowsQuery)]),
  head: ({ loaderData }) =>
    pageHead({
      path: "/",
      title: "South Apollo Medical College Hospital | Best Hospital & Private Medical College in Barishal",
      description:
        "South Apollo Medical College Hospital, Jagua, Barishal: the only private medical college hospital in Barishal, with 250 beds, 24/7 emergency, specialist doctors and health checkups.",
      keywords: ["Hospital in Barishal", "Medical college in Barishal", "24/7 emergency hospital Barishal", "Doctor appointment Barishal"],
      jsonLd: [hospitalJsonLd((loaderData?.[6] ?? []).map((s) => s.name)), websiteJsonLd()],
    }),
  component: Index,
});

function Index() {
  const { data: banners } = useSuspenseQuery(bannersQuery);
  const { data: packages } = useSuspenseQuery(packagesQuery);
  const { data: stories } = useSuspenseQuery(storiesQuery);
  const { data: news } = useSuspenseQuery(postsQuery("news"));
  const { data: blogs } = useSuspenseQuery(postsQuery("blog"));
  const { data: doctors } = useSuspenseQuery(doctorsQuery);
  const { data: specialityRows } = useSuspenseQuery(specialityRowsQuery);
  const specialities = useMemo(() => specialityRows.map(toSpeciality), [specialityRows]);
  return (
    <div className="min-h-screen bg-background font-sans">
      <main>
        <h1 className="sr-only">South Apollo Medical College Hospital — Best Hospital &amp; Only Private Medical College in Barishal</h1>
        <Hero banners={banners} />
        <WhyChoose />
        <Specialities specialities={specialities} />
        <Packages packages={packages} />
        <AskBanner />
        <Posts stories={stories} news={news} blogs={blogs} doctors={doctors} />
        <Corporate />
        <MapSection />
      </main>
    </div>
  );
}
