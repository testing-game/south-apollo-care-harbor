import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { StoryCard } from "@/components/site/Articles";
import { EmptyState, PageHero, meta } from "@/components/site/PageHero";
import { storiesQuery } from "@/lib/public-queries";

export const Route = createFileRoute("/stories/")({
  head: () => meta("Patient Stories", "Real recovery stories from patients treated at South Apollo Medical College Hospital."),
  loader: ({ context }) => context.queryClient.ensureQueryData(storiesQuery),
  component: StoriesPage,
});

function StoriesPage() {
  const { data } = useSuspenseQuery(storiesQuery);
  return (
    <main>
      <PageHero crumb="Patient Stories" title="Our Incredible Patients Share Their Stories" />
      <section className="container-site py-12">
        {data.length ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.map((s) => <StoryCard key={s.id} story={s} />)}</div> : <EmptyState>Patient stories will appear here soon.</EmptyState>}
      </section>
    </main>
  );
}
