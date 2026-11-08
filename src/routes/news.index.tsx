import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PostCard } from "@/components/site/Articles";
import { EmptyState, PageHero, meta } from "@/components/site/PageHero";
import { postsQuery } from "@/lib/public-queries";

export const Route = createFileRoute("/news/")({
  head: () => meta("News & Media", "Latest news and events from South Apollo Medical College Hospital."),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery("news")),
  component: ListPage,
});

function ListPage() {
  const { data } = useSuspenseQuery(postsQuery("news"));
  return (
    <main>
      <PageHero crumb="News & Media" title="News & Media" />
      <section className="container-site py-12">
        {data.length ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.map((p) => <PostCard key={p.id} post={p} />)}</div> : <EmptyState>Articles will appear here soon.</EmptyState>}
      </section>
    </main>
  );
}
