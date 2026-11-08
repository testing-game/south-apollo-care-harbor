import { Link } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";
import type { Post, Story } from "@/lib/public-data.functions";
import { formatDate } from "@/lib/schedule";

export function PostCard({ post }: { post: Post }) {
  const inner = (
    <>
      <div className="aspect-[16/9] overflow-hidden bg-surface-soft">
        {post.featured_image && <img src={post.featured_image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{formatDate(post.published_date)}</p>
        <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-navy">{post.title}</h3>
        <span className="mt-auto pt-4 text-xs font-bold text-sky">Read More</span>
      </div>
    </>
  );
  const cls = "group flex flex-col border border-line-soft bg-background transition-shadow hover:shadow-card";
  return post.type === "blog" ? <Link to="/blogs/$slug" params={{ slug: post.slug }} className={cls}>{inner}</Link> : <Link to="/news/$slug" params={{ slug: post.slug }} className={cls}>{inner}</Link>;
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link to="/stories/$slug" params={{ slug: story.slug }} className="group flex flex-col border border-line-soft bg-background transition-shadow hover:shadow-card">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-soft">
        {story.thumbnail_url && <img src={story.thumbnail_url} alt={story.treatment_title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
        {story.youtube_video_url && <PlayCircle className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-primary-foreground drop-shadow" />}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{story.patient_name}</p>
        <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-navy">{story.treatment_title}</h3>
        <span className="mt-auto pt-4 text-xs font-bold text-sky">Read More</span>
      </div>
    </Link>
  );
}

export function ArticleBody({ text }: { text: string }) {
  return <div className="space-y-4 leading-relaxed text-foreground/90">{text.split(/\n{2,}/).map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}</div>;
}
