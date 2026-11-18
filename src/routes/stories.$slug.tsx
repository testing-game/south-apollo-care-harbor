import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArticleBody } from "@/components/site/Articles";
import { PageHero } from "@/components/site/PageHero";
import { pageHead, unavailableHead } from "@/lib/seo";
import { storyQuery } from "@/lib/public-queries";
import { youtubeEmbed } from "@/lib/schedule";

export const Route = createFileRoute("/stories/$slug")({
  staticData: { sitemap: true },
  loader: async ({ context, params }) => {
    const story = await context.queryClient.ensureQueryData(storyQuery(params.slug));
    if (!story) throw notFound();
    return { slug: story.slug, title: story.treatment_title, patient: story.patient_name, image: story.thumbnail_url };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return unavailableHead("Unavailable");
    const s = loaderData;
    const path = `/stories/${s.slug}`;
    return pageHead({
      path,
      title: `${s.title} — ${s.patient}'s Story | South Apollo Medical College Hospital`,
      description: `${s.patient}'s treatment and recovery story at South Apollo Medical College Hospital, Barishal: ${s.title}.`,
      type: "article",
      image: s.image ?? undefined,
      crumbs: [{ name: "Patient Stories", path: "/stories" }, { name: s.title, path }],
    });
  },
  component: StoryPage,
});

function StoryPage() {
  const { slug } = Route.useParams();
  const { data: story } = useSuspenseQuery(storyQuery(slug));
  if (!story) return null;
  const embed = youtubeEmbed(story.youtube_video_url);
  return (
    <main>
      <PageHero crumb="Patient Stories" title={story.treatment_title}>{story.patient_name}</PageHero>
      <article className="container-site max-w-3xl py-12">
        {embed ? <iframe src={embed} title={story.treatment_title} className="mb-8 aspect-video w-full" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen /> : story.thumbnail_url && <img src={story.thumbnail_url} alt={story.treatment_title} className="mb-8 aspect-[16/9] w-full object-cover" />}
        <ArticleBody text={story.story_content} />
      </article>
    </main>
  );
}
