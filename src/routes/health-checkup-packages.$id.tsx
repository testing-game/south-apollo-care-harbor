import { useState } from "react";
import { createFileRoute, Link, notFound, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarCheck, CheckCircle2, ClipboardList, FileText, Phone, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHero, meta } from "@/components/site/PageHero";
import { PackageBookingDialog } from "@/components/site/PackageBookingDialog";
import { packageQuery } from "@/lib/public-queries";
import { detailsBannerImage, splitPackageTitle } from "@/lib/packages";
import { bioParagraphs } from "@/lib/doctors";
import { price } from "@/lib/schedule";

export const Route = createFileRoute("/health-checkup-packages/$id")({
  loader: async ({ context, params }) => {
    const pkg = await context.queryClient.ensureQueryData(packageQuery(params.id));
    if (!pkg) throw notFound();
    return { title: pkg.title, description: pkg.description, tests: pkg.included_tests.length, image: detailsBannerImage(pkg) };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Package unavailable | South Apollo Medical College Hospital" }, { name: "robots", content: "noindex" }] };
    const summary = loaderData.description.trim().split(/\n/)[0]?.slice(0, 140);
    const base = meta(loaderData.title, summary || `${loaderData.title} at South Apollo Medical College Hospital, Barishal — ${loaderData.tests} included tests. Book your health check online.`);
    const url = `https://sa.jahidzone.cv/health-checkup-packages/${params.id}`;
    const image = loaderData.image.startsWith("https://") ? [{ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image }] : [];
    return { meta: [...base.meta, { property: "og:url", content: url }, ...image], links: [{ rel: "canonical", href: url }] };
  },
  component: PackageDetailsPage,
  errorComponent: PackageError,
  notFoundComponent: PackageNotFound,
});

const PARENT = { label: "Health Check Packages", to: "/health-checkup-all-packages" } as const;

function PackageNotFound() {
  return (
    <main>
      <PageHero crumb="Package not found" title="Package not found" parent={PARENT} />
      <section className="container-site py-12">
        <EmptyState>
          <div className="space-y-4">
            <p>This health check package isn't available right now.</p>
            <Button asChild className="rounded-none bg-navy hover:bg-navy-hover"><Link to="/health-checkup-all-packages">Browse all packages</Link></Button>
          </div>
        </EmptyState>
      </section>
    </main>
  );
}

function PackageError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  return (
    <main className="container-site py-16">
      <EmptyState>
        <div className="space-y-4">
          <p>We couldn't load this package.</p>
          <Button className="rounded-none bg-navy hover:bg-navy-hover" onClick={() => { router.invalidate(); reset(); }}>Try again</Button>
        </div>
      </EmptyState>
    </main>
  );
}

function PackageDetailsPage() {
  const { id } = Route.useParams();
  const { data: pkg } = useSuspenseQuery(packageQuery(id));
  const [booking, setBooking] = useState(false);
  if (!pkg) return null;
  const { name, subtitle } = splitPackageTitle(pkg.title);
  const image = detailsBannerImage(pkg);
  const overview = bioParagraphs(pkg.description);
  const preparation = bioParagraphs(pkg.preparation);
  const book = (
    <Button size="lg" className="h-12 w-full rounded-none bg-navy px-8 text-base text-primary-foreground hover:bg-navy-hover sm:w-auto" onClick={() => setBooking(true)}>
      <CalendarCheck /> Book Test
    </Button>
  );

  return (
    <main className="bg-background">
      <PageHero crumb={pkg.title} title={name} parent={PARENT}>{subtitle}</PageHero>

      <section className="container-site py-10 md:py-14">
        <article className="grid overflow-hidden border border-line-soft bg-background shadow-card md:grid-cols-2">
          <div className="relative aspect-[16/10] bg-surface-soft md:aspect-auto md:min-h-[360px]">
            {image ? <img src={image} alt={pkg.title} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 grid place-items-center text-muted-foreground"><ClipboardList className="h-16 w-16" /></div>}
          </div>
          <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-clinical-teal">Health Check Package</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-navy md:text-3xl">{name}</h2>
              {subtitle && <p className="mt-1 text-base font-semibold text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-3xl font-bold text-navy">{price(pkg.price)}</span>
              {pkg.included_tests.length > 0 && <span className="text-sm text-muted-foreground">{pkg.included_tests.length} tests &amp; screenings included</span>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {book}
              <a href="tel:+8801885941937" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-clinical-teal"><Phone className="h-4 w-4" /> +880 1885-941937</a>
            </div>
          </div>
        </article>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <div className="space-y-8">
            {overview.length > 0 && (
              <section aria-labelledby="pkg-overview" className="border border-line-soft bg-background p-6 md:p-8">
                <h2 id="pkg-overview" className="flex items-center gap-2 text-xl font-bold text-navy"><FileText className="h-5 w-5 text-clinical-teal" /> Package Overview</h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">{overview.map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}</div>
              </section>
            )}
            <section aria-labelledby="pkg-tests" className="border border-line-soft bg-surface-soft p-6 md:p-8">
              <h2 id="pkg-tests" className="flex items-center gap-2 text-xl font-bold text-navy"><ClipboardList className="h-5 w-5 text-clinical-teal" /> Included Tests &amp; Screenings</h2>
              {pkg.included_tests.length ? (
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {pkg.included_tests.map((t) => (
                    <li key={t} className="flex items-start gap-3 border border-line-soft bg-background px-4 py-3 text-sm font-medium text-navy">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-clinical-teal" aria-hidden="true" />{t}
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-3 text-muted-foreground">Please call us for the full list of tests in this package.</p>}
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {preparation.length > 0 && (
              <section aria-labelledby="pkg-prep" className="border border-line-soft bg-clinical-tint p-6">
                <h2 id="pkg-prep" className="flex items-center gap-2 text-lg font-bold text-navy"><Utensils className="h-5 w-5 text-clinical-teal" /> Preparation &amp; Fasting</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-navy">{preparation.map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}</div>
              </section>
            )}
            <section className="bg-navy p-6 text-primary-foreground">
              <h2 className="text-lg font-bold">Ready to book?</h2>
              <p className="mt-2 text-sm text-primary-foreground/80">Choose your preferred date and get your booking slip instantly. Please arrive 15 minutes early.</p>
              <Button className="mt-5 h-11 w-full rounded-none bg-sky text-navy-deep hover:bg-primary-foreground" onClick={() => setBooking(true)}><CalendarCheck /> Book Test</Button>
            </section>
          </aside>
        </div>
      </section>

      <PackageBookingDialog pkg={booking ? pkg : null} onClose={() => setBooking(false)} />
    </main>
  );
}
