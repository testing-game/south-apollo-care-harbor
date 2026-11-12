import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { StoryCard } from "@/components/site/Articles";
import { ListingHeader, ListingSearch, NoMatches } from "@/components/site/ListingSearch";
import { EmptyState, PageHero, meta } from "@/components/site/PageHero";
import { filterStories } from "@/lib/article-search";
import { storiesQuery } from "@/lib/public-queries";

export const Route = createFileRoute("/stories/")({
  head: () => meta("Patient Stories", "Real recovery stories from patients treated at South Apollo Medical College Hospital."),
  loader: ({ context }) => context.queryClient.ensureQueryData(storiesQuery),
  component: StoriesPage,
});

function StoriesPage() {
  const { data } = useSuspenseQuery(storiesQuery);
  const [query, setQuery] = useState("");
  const stories = filterStories(data, query);
  return (
    <main>
      <PageHero crumb="Patient Stories" title="Our Incredible Patients Share Their Stories" />
      <section className="container-site pb-16 pt-10 md:pb-20 md:pt-14">
        <ListingHeader title="All Patient Stories"><ListingSearch value={query} onChange={setQuery} placeholder="Search Stories" /></ListingHeader>
        <div aria-live="polite" aria-atomic="true" className="sr-only">{stories.length} stories found</div>
        {!data.length ? <EmptyState>Patient stories will appear here soon.</EmptyState>
          : stories.length ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{stories.map((s) => <StoryCard key={s.id} story={s} />)}</div>
          : <NoMatches message="No matching stories found" onClear={() => setQuery("")} />}
      </section>
    </main>
  );
}
