import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PostCard } from "@/components/site/Articles";
import { ListingHeader, ListingSearch, NoMatches } from "@/components/site/ListingSearch";
import { EmptyState, PageHero } from "@/components/site/PageHero";
import { pageHead } from "@/lib/seo";
import { filterPosts } from "@/lib/article-search";
import { postsQuery } from "@/lib/public-queries";

export const Route = createFileRoute("/news/")({
  staticData: { sitemap: true },
  head: () => pageHead({ path: "/news", title: "News & Media | South Apollo Medical College Hospital, Barishal", description: "Latest news, events and announcements from South Apollo Medical College Hospital, the private medical college hospital in Jagua, Barishal.", keywords: ["South Apollo news", "Barishal hospital news", "Medical college news Barishal"], crumbs: [{name: "News & Media", path: "/news"}] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery("news")),
  component: ListPage,
});

function ListPage() {
  const { data } = useSuspenseQuery(postsQuery("news"));
  const [query, setQuery] = useState("");
  const posts = filterPosts(data, query);
  return (
    <main>
      <PageHero crumb="News & Media" title="News & Media" />
      <section className="container-site pb-16 pt-10 md:pb-20 md:pt-14">
        <ListingHeader title="Latest News & Media"><ListingSearch value={query} onChange={setQuery} placeholder="Search News" /></ListingHeader>
        <div aria-live="polite" aria-atomic="true" className="sr-only">{posts.length} articles found</div>
        {!data.length ? <EmptyState>Articles will appear here soon.</EmptyState>
          : posts.length ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>
          : <NoMatches message="No matching articles found" onClear={() => setQuery("")} />}
      </section>
    </main>
  );
}
