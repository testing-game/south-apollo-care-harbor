import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArticleBody } from "@/components/site/Articles";
import { NewsGallery } from "@/components/site/NewsGallery";
import { galleryImages } from "@/lib/gallery";
import { PageHero, meta } from "@/components/site/PageHero";
import { postQuery } from "@/lib/public-queries";
import { formatDate } from "@/lib/schedule";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery("news", params.slug));
    if (!post) throw notFound();
    return { title: post.title, excerpt: post.excerpt };
  },
  head: ({ loaderData }) => loaderData ? meta(loaderData.title, loaderData.excerpt || "Latest news and events from South Apollo Medical College Hospital.") : { meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }] },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery("news", slug));
  if (!post) return null;
  return (
    <main>
      <PageHero crumb="News & Media" title={post.title}>{formatDate(post.published_date)}{post.author_name ? ` · ${post.author_name}` : ""}</PageHero>
      <article className="container-site max-w-3xl py-12">
        {post.featured_image && <img src={post.featured_image} alt={post.title} className="mb-8 aspect-[16/9] w-full rounded-xl object-cover" />}
        <ArticleBody text={post.content || post.excerpt} />
        <NewsGallery images={galleryImages(post.gallery_images)} title={post.title} />
      </article>
    </main>
  );
}
