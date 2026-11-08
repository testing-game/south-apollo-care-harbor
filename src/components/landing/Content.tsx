import { Link } from "@tanstack/react-router";
import { asset } from "@/lib/asset";
import { DoctorCard } from "@/components/site/DoctorCard";
import { PostCard, StoryCard } from "@/components/site/Articles";
import type { Doctor, HealthPackage, Post as PostRow, Story } from "@/lib/public-data.functions";

const PACKAGES: [string, string, string][] = [
  ["EXECUTIVE HEALTH CHECK", "(MALE / FEMALE)", "executive-health-check-male-female.png"],
  ["HEART CHECK", "(FOR MEN)", "heart-check-for-men.png"],
  ["HEART CHECK", "(FOR WOMEN)", "heart-check-for-women.png"],
  ["WHOLE BODY CHECK", "(FOR MEN ABOVE 45 YEARS)", "whole-body-check-for-men-above-45-years.png"],
  ["WHOLE BODY CHECK", "(FOR MEN BELOW 45 YEARS)", "whole-body-check-for-men-below-45-years.png"],
  ["WHOLE BODY CHECK", "(FOR WOMEN ABOVE 45 YEARS)", "whole-body-check-for-women-above-45-years.png"],
  ["WHOLE BODY CHECK", "(FOR WOMEN BELOW 45 YEARS)", "whole-body-check-for-women-below-45-years.png"],
  ["HEALTH CHECK GENERAL", "(MALE Below 40)", "health-check-general-male-below-40.png"],
];

const slug = (t: string) =>
  "link-" + t.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".png";

type Post = [title: string, date: string, img?: string];

const STORIES: Post[] = [
  ["Successful Treatment of Critical Head Injury Following a Motorcycle Accident", "18 October 2026"],
  ["Stomach cancer surgery through laparoscopic technique, without opening the abdomen", "17 October 2026"],
  ["Successful Treatment of Back Pain (Spinal Cord Issue)", "10 September 2026"],
  ["Successful Knee Replacement Surgery on Both Knees by Dr. M. Ali", "27 August 2026"],
  ["Successful Treatment of Brain Tumor", "27 August 2026"],
  ["Successful Treatment of a Child's Congenital Heart Defect by Dr. Tahera Nazrin", "17 August 2026"],
];
const NEWS: Post[] = [
  ["South Apollo Organizes Special Program to Raise Breast Cancer Awareness", "27 October 2026", slug("Evercare Hospital Dhaka Organizes Special Program to Raise Breast Cancer Awareness")],
  ["South Apollo Launches Free Breast Health Checkup Program", "13 October 2026", slug("Evercare Hospital Dhaka Launches Free Breast Health Checkup Program")],
  ["South Apollo Organizes Patient Forum to Raise Awareness of Heart Disease", "30 September 2026", slug("Evercare Hospital Dhaka Organizes Patient Forum to Raise Awareness of Heart Disease")],
  ["South Apollo Organized Rally and Patient Forum on World Radiotherapy Awareness Day", "09 September 2026", slug("Evercare Hospital Dhaka Organized Rally and Patient Forum on World Radiotherapy Awareness Day")],
  ["Scientific Discussion on Metabolic Surgery Held at South Apollo", "28 July 2026", slug("Scientific Discussion on Metabolic Surgery Held at Evercare Hospital Dhaka")],
  ["Free Health Camp of South Apollo Held at Narsingdi", "29 November 2025", slug("Free Health Camp of Evercare Hospital Dhaka Held at Narsingdi")],
];
const SHASTHO: Post[] = [
  ["Lung Diseases and Their Treatment Explained", "28 September 2026"],
  ["Lung Diseases: Causes, Symptoms & Modern Treatment Explained", "28 September 2026"],
  ["How Does Radiotherapy Treat Cancer?", "14 September 2026"],
  ["Radiotherapy Treatment Explained", "14 September 2026"],
  ["World-Class Care for Advanced Bone Treatment", "29 August 2026"],
  ["Why Is Breast Milk So Important for Babies?", "29 August 2026"],
];
const BLOG: Post[] = [
  ["Brain Stroke Risk Factors and Prevention: How to Reduce Your Risk", "29 October 2026"],
  ["Knee Osteoarthritis: Causes, Prevention, and Treatment", "20 October 2026"],
  ["World-Class Breast Cancer Treatment, Now Available at South Apollo", "14 October 2026", slug("World-Class Breast Cancer Treatment Now Available at Evercare Hospital Dhaka")],
  ["South Apollo Provides World-Class Cardiac Care", "30 September 2026", slug("Evercare Hospital Dhaka Provides World-Class Cardiac Care")],
  ["What Causes Heart Failure and What Are Its Symptoms?", "28 September 2026"],
  ["Psoriatic Arthritis: When Skin and Joints Connect", "10 September 2026"],
];

type Dest = "/health-checkup-all-packages" | "/stories" | "/news" | "/blogs" | "/doctors";
function ViewAll({ label, to }: { label: string; to: Dest }) {
  return (
    <div className="mt-10 flex justify-center">
      <Link to={to} className="bg-violet px-8 py-2.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">{label}</Link>
    </div>
  );
}

export function Packages({ packages }: { packages: HealthPackage[] }) {
  const live = packages.filter((p) => p.is_featured).slice(0, 8);
  return (
    <section className="bg-surface-soft py-16 md:py-20">
      <div className="container-site">
        <h2 className="section-title">Health Check Packages</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(live.length ? live.map((p) => { const m = p.title.match(/^(.*?)\s*(\(.*\))?$/); return [m?.[1] ?? p.title, m?.[2] ?? "", p.image_url] as [string, string, string]; }) : PACKAGES.map(([t, s, img]) => [t, s, asset(img)] as [string, string, string])).map(([t, s, img]) => (
            <Link key={img + t} to="/health-checkup-all-packages" className="group relative block aspect-[29/32] overflow-hidden">
              <img src={img} alt={`${t} ${s}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="bg-card-fade absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                <p className="font-bold leading-snug">{t}</p>
                <p className="text-xs font-bold uppercase">{s}</p>
                <span className="mt-3 inline-block text-sm font-bold text-sky">See Package</span>
              </div>
            </Link>
          ))}
        </div>
        <ViewAll label="View All Packages" to="/health-checkup-all-packages" />
      </div>
    </section>
  );
}

export function AskBanner() {
  return (
    <section className="w-full bg-navy py-10 text-primary-foreground md:py-12">
      <div className="container-site flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Ask South Apollo</h2>
          <p className="mt-2 text-sm">Looking for world-class care, we are here to support you.</p>
        </div>
        <Link to="/send-query" className="bg-background px-8 py-3 text-sm font-semibold text-navy transition-colors hover:bg-sky hover:text-primary-foreground">Send Query</Link>
      </div>
    </section>
  );
}

function PostGrid({ title, posts, cta, to, soft, spaced, live }: { title: React.ReactNode; posts: Post[]; cta: string; to: Dest; soft?: boolean; spaced?: boolean; live?: React.ReactNode }) {
  return (
    <section className={`py-16 md:py-20 ${soft ? "bg-surface-soft" : ""}`}>
      <div className="container-site max-w-[1060px]">
        <h2 className="section-title">{title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {live ?? posts.map(([t, d, img]) => (
            <Link key={t} to={to} className="group flex flex-col border border-line-soft bg-background transition-shadow hover:shadow-card">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={asset(img ?? slug(t))} alt={t} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className={`text-[11px] text-muted-foreground ${spaced ? "uppercase tracking-[0.25em]" : ""}`}>{d}</p>
                <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-navy">{t}</h3>
                <span className="mt-auto pt-4 text-xs font-bold text-sky">Read More</span>
              </div>
            </Link>
          ))}
        </div>
        <ViewAll label={cta} to={to} />
      </div>
    </section>
  );
}

const featured = <T extends { is_featured: boolean }>(rows: T[]) => (rows.some((r) => r.is_featured) ? rows.filter((r) => r.is_featured) : rows).slice(0, 6);

export function Posts({ stories, news, blogs, doctors }: { stories: Story[]; news: PostRow[]; blogs: PostRow[]; doctors: Doctor[] }) {
  const docs = featured(doctors);
  return (
    <>
      <PostGrid title={<>Our Incredible Patients Share<br />Their Stories</>} posts={STORIES} cta="View All Stories" to="/stories" spaced live={stories.length ? featured(stories).map((s) => <StoryCard key={s.id} story={s} />) : undefined} />
      <PostGrid title="News & Media" posts={NEWS} cta="View All News" to="/news" soft live={news.length ? featured(news).map((p) => <PostCard key={p.id} post={p} />) : undefined} />
      {docs.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container-site max-w-[1060px]">
            <h2 className="section-title">Our Esteemed Doctors</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{docs.map((d) => <DoctorCard key={d.id} doctor={d} />)}</div>
            <ViewAll label="View All Doctors" to="/doctors" />
          </div>
        </section>
      )}
      <PostGrid title="Shasthoshongi" posts={SHASTHO} cta="View All" to="/blogs" spaced />
      <PostGrid title="Blog" posts={BLOG} cta="Read All Blogs" to="/blogs" soft spaced live={blogs.length ? featured(blogs).map((p) => <PostCard key={p.id} post={p} />) : undefined} />
    </>
  );
}
