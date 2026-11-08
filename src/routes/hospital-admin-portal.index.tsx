import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, FlaskConical, Stethoscope, UserCheck } from "lucide-react";
import { adminDoctorsQuery, appointmentsQuery, bookingsQuery, queriesQuery } from "@/lib/admin";
import { formatDate, isOnDuty, todayInDhaka } from "@/lib/schedule";

export const Route = createFileRoute("/hospital-admin-portal/")({ component: Dashboard });

function Dashboard() {
  const today = todayInDhaka();
  const appts = useQuery(appointmentsQuery(today)).data ?? [];
  const bookings = useQuery(bookingsQuery(today)).data ?? [];
  const doctors = useQuery(adminDoctorsQuery).data ?? [];
  const queries = (useQuery(queriesQuery).data ?? []).filter((q) => q.status === "unread");
  const onDuty = doctors.filter((d) => isOnDuty(d, today));
  const cards = [
    { label: "Today's appointments", value: appts.length, icon: CalendarCheck },
    { label: "Today's test bookings", value: bookings.length, icon: FlaskConical },
    { label: "Doctors on duty today", value: onDuty.length, icon: UserCheck },
    { label: "Total doctors", value: doctors.length, icon: Stethoscope },
  ];
  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-navy">Dashboard</h1><p className="text-sm text-muted-foreground">{formatDate(today)}</p></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between rounded-lg border border-line-soft bg-background p-5">
            <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-3xl font-bold text-navy">{value}</p></div>
            <Icon className="h-8 w-8 text-sky" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Today's schedule" link={<Link to="/hospital-admin-portal/appointments" className="text-xs font-semibold text-sky">View all</Link>}>
          {appts.length ? appts.slice(0, 8).map((a) => <Row key={a.id} left={`${a.appointment_number} · ${a.patient_name}`} right={`${a.doctors?.name ?? ""} · ${a.status}`} />) : <Empty>No appointments today.</Empty>}
        </Panel>
        <Panel title="Unread queries" link={<Link to="/hospital-admin-portal/queries" className="text-xs font-semibold text-sky">View all</Link>}>
          {queries.length ? queries.slice(0, 8).map((q) => <Row key={q.id} left={`${q.name} · ${q.subject}`} right={q.phone} />) : <Empty>No unread queries.</Empty>}
        </Panel>
        <Panel title="Doctors on duty today">
          {onDuty.length ? onDuty.map((d) => <Row key={d.id} left={d.name} right={`${d.visiting_hours}${d.room_number ? ` · Room ${d.room_number}` : ""}`} />) : <Empty>No doctors scheduled today.</Empty>}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, link, children }: { title: string; link?: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-lg border border-line-soft bg-background p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-bold text-navy">{title}</h2>{link}</div><div className="divide-y divide-line-soft">{children}</div></section>;
}
function Row({ left, right }: { left: string; right: string }) {
  return <div className="flex justify-between gap-4 py-2 text-sm"><span className="truncate">{left}</span><span className="shrink-0 text-muted-foreground">{right}</span></div>;
}
function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-4 text-sm text-muted-foreground">{children}</p>;
}
