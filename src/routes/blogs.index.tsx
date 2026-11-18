import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PostCard } from "@/components/site/Articles";
import { ListingHeader, ListingSearch, NoMatches } from "@/components/site/ListingSearch";
import { EmptyState, PageHero } from "@/components/site/PageHero";
import { pageHead } from "@/lib/seo";
import { filterPosts } from "@/lib/article-search";
import { postsQuery } from "@/lib/public-queries";

export const Route = createFileRoute("/blogs/")({
  staticData: { sitemap: true },
  head: () => pageHead({ path: "/blogs", title: "Health Blog | Advice from Specialist Doctors in Barishal | South Apollo", description: "Health tips and medical insights written by the specialist doctors of South Apollo Medical College Hospital, Barishal.", keywords: ["Health blog Bangladesh", "Medical advice Barishal", "Health tips", "South Apollo blog"], crumbs: [{name: "Health Blog", path: "/blogs"}] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery("blog")),
  component: ListPage,
});

function ListPage() {
  const { data } = useSuspenseQuery(postsQuery("blog"));
  const [query, setQuery] = useState("");
  const posts = filterPosts(data, query);
  return (
    <main>
      <PageHero crumb="Health Blog" title="Health Blog" />
      <section className="container-site pb-16 pt-10 md:pb-20 md:pt-14">
        <ListingHeader title="Latest Health Articles"><ListingSearch value={query} onChange={setQuery} placeholder="Search Blogs" /></ListingHeader>
        <div aria-live="polite" aria-atomic="true" className="sr-only">{posts.length} articles found</div>
        {!data.length ? <EmptyState>Articles will appear here soon.</EmptyState>
          : posts.length ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>
          : <NoMatches message="No matching articles found" onClear={() => setQuery("")} />}
      </section>
    </main>
  );
}
