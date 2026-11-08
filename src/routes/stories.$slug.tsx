import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArticleBody } from "@/components/site/Articles";
import { PageHero, meta } from "@/components/site/PageHero";
import { storyQuery } from "@/lib/public-queries";
import { youtubeEmbed } from "@/lib/schedule";

export const Route = createFileRoute("/stories/$slug")({
  loader: async ({ context, params }) => {
    const story = await context.queryClient.ensureQueryData(storyQuery(params.slug));
    if (!story) throw notFound();
    return { title: story.treatment_title, patient: story.patient_name };
  },
  head: ({ loaderData }) => loaderData ? meta(loaderData.title, `${loaderData.patient}'s treatment story at South Apollo Medical College Hospital.`) : { meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }] },
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
