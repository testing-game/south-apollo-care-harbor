import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { bannersQuery, doctorsQuery, packagesQuery, postsQuery, storiesQuery } from "@/lib/public-queries";
import { Hero } from "@/components/landing/Hero";
import { WhyChoose, Specialities } from "@/components/landing/Specialities";
import { Packages, AskBanner, Posts } from "@/components/landing/Content";
import { Corporate, MapSection } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "South Apollo Medical College Hospital" },
      {
        name: "description",
        content:
          "South Apollo Medical College Hospital — find a doctor, book appointments, health check packages and world-class specialities.",
      },
      { property: "og:title", content: "South Apollo Medical College Hospital" },
      {
        property: "og:description",
        content: "Find a doctor, book appointments and explore our specialities and health packages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context: { queryClient: q } }) => Promise.all([q.ensureQueryData(bannersQuery), q.ensureQueryData(packagesQuery), q.ensureQueryData(storiesQuery), q.ensureQueryData(postsQuery("news")), q.ensureQueryData(postsQuery("blog")), q.ensureQueryData(doctorsQuery)]),
  component: Index,
});

function Index() {
  const { data: banners } = useSuspenseQuery(bannersQuery);
  const { data: packages } = useSuspenseQuery(packagesQuery);
  const { data: stories } = useSuspenseQuery(storiesQuery);
  const { data: news } = useSuspenseQuery(postsQuery("news"));
  const { data: blogs } = useSuspenseQuery(postsQuery("blog"));
  const { data: doctors } = useSuspenseQuery(doctorsQuery);
  return (
    <div className="min-h-screen bg-background font-sans">
      <main>
        <Hero banners={banners} />
        <WhyChoose />
        <Specialities />
        <Packages packages={packages} />
        <AskBanner />
        <Posts stories={stories} news={news} blogs={blogs} doctors={doctors} />
        <Corporate />
        <MapSection />
      </main>
    </div>
  );
}
