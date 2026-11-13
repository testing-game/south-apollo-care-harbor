import { createFileRoute, Link, notFound, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BriefcaseMedical, CalendarCheck, CalendarDays, Clock, DoorOpen, GraduationCap, Stethoscope, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHero, meta } from "@/components/site/PageHero";
import { doctorQuery } from "@/lib/public-queries";
import { bioParagraphs, orderedVisitingDays } from "@/lib/doctors";

export const Route = createFileRoute("/doctors/$id")({
  loader: async ({ context, params }) => {
    const doctor = await context.queryClient.ensureQueryData(doctorQuery(params.id));
    if (!doctor) throw notFound();
    return { name: doctor.name, designation: doctor.designation, department: doctor.department_name, image: doctor.image_url };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Doctor unavailable | South Apollo Medical College Hospital" }, { name: "robots", content: "noindex" }] };
    const role = [loaderData.designation, loaderData.department].filter(Boolean).join(", ");
    const base = meta(loaderData.name, `${loaderData.name}${role ? `, ${role}` : ""} at South Apollo Medical College Hospital, Barishal. See consultation days and book an appointment.`);
    const url = `https://sa.jahidzone.cv/doctors/${params.id}`;
    const image = loaderData.image.startsWith("https://") ? [{ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image }] : [];
    return { meta: [...base.meta.filter((m) => !("property" in m && m.property === "og:type")), { property: "og:type", content: "profile" }, { property: "og:url", content: url }, ...image], links: [{ rel: "canonical", href: url }] };
  },
  component: DoctorProfilePage,
  errorComponent: DoctorError,
  notFoundComponent: DoctorNotFound,
});

function DoctorNotFound() {
  return (
    <main>
      <PageHero crumb="Doctor not found" title="Doctor not found" parent={{ label: "Find a Doctor", to: "/doctors" }} />
      <section className="container-site py-12">
        <EmptyState>
          <div className="space-y-4">
            <p>This doctor profile isn't available. The doctor may no longer be consulting here.</p>
            <Button asChild className="rounded-none bg-navy hover:bg-navy-hover"><Link to="/doctors">Browse all doctors</Link></Button>
          </div>
        </EmptyState>
      </section>
    </main>
  );
}

function DoctorError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  return (
    <main className="container-site py-16">
      <EmptyState>
        <div className="space-y-4">
          <p>We couldn't load this doctor's profile.</p>
          <Button className="rounded-none bg-navy hover:bg-navy-hover" onClick={() => { router.invalidate(); reset(); }}>Try again</Button>
        </div>
      </EmptyState>
    </main>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof GraduationCap; label: string; value: string }) {
  return (
    <div className="flex gap-3 border-t border-line-soft py-3 first:border-t-0">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-clinical-teal" />
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium text-navy">{value}</dd>
      </div>
    </div>
  );
}

function DoctorProfilePage() {
  const { id } = Route.useParams();
  const { data: doctor } = useSuspenseQuery(doctorQuery(id));
  if (!doctor) return null;
  const days = orderedVisitingDays(doctor.visiting_days);
  const bio = bioParagraphs(doctor.bio);
  const facts = [
    doctor.designation && { icon: Stethoscope, label: "Designation", value: doctor.designation },
    doctor.degrees && { icon: GraduationCap, label: "Degrees", value: doctor.degrees },
    doctor.experience && { icon: BriefcaseMedical, label: "Experience", value: doctor.experience },
    doctor.room_number && { icon: DoorOpen, label: "Room", value: doctor.room_number },
  ].filter(Boolean) as { icon: typeof GraduationCap; label: string; value: string }[];

  return (
    <main>
      <PageHero crumb={doctor.name} title={doctor.name} parent={{ label: "Find a Doctor", to: "/doctors" }}>
        {[doctor.designation, doctor.department_name].filter(Boolean).join(" · ")}
      </PageHero>
      <section className="container-site grid gap-8 py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-line-soft bg-background shadow-card">
            <div className="aspect-[4/3] overflow-hidden bg-surface-soft">
              {doctor.image_url ? (
                <img src={doctor.image_url} alt={doctor.name} className="h-full w-full object-cover object-top" />
              ) : (
                <div className="grid h-full place-items-center text-muted-foreground"><UserRound className="h-20 w-20" /></div>
              )}
            </div>
            <div className="p-6">
              {doctor.department_name && (
                <span className="inline-block bg-clinical-tint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-clinical-teal">{doctor.department_name}</span>
              )}
              <h2 className="mt-3 text-xl font-bold text-navy">{doctor.name}</h2>
              {facts.length > 0 && <dl className="mt-4">{facts.map((f) => <Fact key={f.label} {...f} />)}</dl>}
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          <section aria-labelledby="about-doctor" className="border border-line-soft bg-background p-6 md:p-8">
            <h2 id="about-doctor" className="text-xl font-bold text-navy">About the Doctor</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
              {bio.length ? bio.map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>) : (
                <p>{doctor.name}{doctor.designation ? ` is a ${doctor.designation}` : " consults"}{doctor.department_name ? ` in ${doctor.department_name}` : ""} at South Apollo Medical College Hospital{doctor.degrees ? ` (${doctor.degrees})` : ""}.</p>
              )}
            </div>
          </section>

          <section aria-labelledby="consultation-schedule" className="border border-line-soft bg-surface-soft p-6 md:p-8">
            <h2 id="consultation-schedule" className="text-xl font-bold text-navy">Consultation Schedule</h2>
            <div className="mt-5 space-y-5">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-navy"><CalendarDays className="h-4 w-4 text-clinical-teal" /> Visiting days</p>
                {days.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {days.map((d) => <li key={d} className="border border-navy bg-background px-3 py-1.5 text-sm font-medium text-navy">{d}</li>)}
                  </ul>
                ) : <p className="mt-2 text-sm text-muted-foreground">Please call +880 1885-941937 for consultation days.</p>}
              </div>
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-navy"><Clock className="h-4 w-4 text-clinical-teal" /> Visiting hours</p>
                <p className="mt-2 text-base text-navy">{doctor.visiting_hours || "Confirmed by phone when you book"}</p>
              </div>
            </div>
            <Button asChild size="lg" className="mt-8 w-full rounded-none bg-navy text-primary-foreground hover:bg-navy-hover sm:w-auto">
              <Link to="/request-appointment" search={{ doctor: doctor.id }}><CalendarCheck /> Book an Appointment</Link>
            </Button>
          </section>
        </div>
      </section>
    </main>
  );
}
