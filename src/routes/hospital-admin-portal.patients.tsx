import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { must } from "@/lib/admin";
import { formatDate } from "@/lib/schedule";

export const Route = createFileRoute("/hospital-admin-portal/patients")({ component: PatientSearch });

function PatientSearch() {
  const [q, setQ] = useState("");
  const term = q.trim().replace(/[%,()]/g, "");
  const enabled = term.length >= 3;
  const filter = (num: string) => `patient_name.ilike.%${term}%,patient_phone.ilike.%${term}%,${num}.ilike.%${term}%`;
  const appts = useQuery({ queryKey: ["admin", "history-a", term], enabled, queryFn: async () => must(await supabase.from("doctor_appointments").select("*, doctors(name)").or(filter("appointment_number")).order("appointment_date", { ascending: false }).limit(100)) });
  const tests = useQuery({ queryKey: ["admin", "history-t", term], enabled, queryFn: async () => must(await supabase.from("test_bookings").select("*, health_packages(title)").or(filter("booking_number")).order("booking_date", { ascending: false }).limit(100)) });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Patient Search</h1>
      <div className="relative max-w-xl"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Phone, name or appointment/booking number (min. 3 characters)" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {enabled && (
        <Tabs defaultValue="a">
          <TabsList><TabsTrigger value="a">Appointments ({appts.data?.length ?? 0})</TabsTrigger><TabsTrigger value="t">Test bookings ({tests.data?.length ?? 0})</TabsTrigger></TabsList>
          <TabsContent value="a"><div className="overflow-x-auto rounded-lg border border-line-soft bg-background"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>No.</TableHead><TableHead>Patient</TableHead><TableHead>Phone</TableHead><TableHead>Doctor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{(appts.data ?? []).map((a) => <TableRow key={a.id}><TableCell>{formatDate(a.appointment_date)}</TableCell><TableCell className="font-mono text-xs">{a.appointment_number}</TableCell><TableCell>{a.patient_name}</TableCell><TableCell>{a.patient_phone}</TableCell><TableCell>{a.doctors?.name}</TableCell><TableCell className="capitalize">{a.status}</TableCell></TableRow>)}</TableBody></Table></div></TabsContent>
          <TabsContent value="t"><div className="overflow-x-auto rounded-lg border border-line-soft bg-background"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>No.</TableHead><TableHead>Patient</TableHead><TableHead>Phone</TableHead><TableHead>Package</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{(tests.data ?? []).map((b) => <TableRow key={b.id}><TableCell>{formatDate(b.booking_date)}</TableCell><TableCell className="font-mono text-xs">{b.booking_number}</TableCell><TableCell>{b.patient_name}</TableCell><TableCell>{b.patient_phone}</TableCell><TableCell>{b.health_packages?.title}</TableCell><TableCell className="capitalize">{b.status}</TableCell></TableRow>)}</TableBody></Table></div></TabsContent>
        </Tabs>
      )}
    </div>
  );
}
