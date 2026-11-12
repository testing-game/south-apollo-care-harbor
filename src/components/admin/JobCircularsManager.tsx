import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Pencil, Plus, Search, Trash2, Users, X } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Pagination } from "@/components/admin/Pagination";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { must } from "@/lib/admin";
import { CIRCULARS_PER_PAGE, DEPARTMENTS, EMPLOYMENT_TYPES, HR_EMAIL, adminStatus, deadlineBadge, departmentLabel, employmentLabel, filterCirculars, jobCircularSchema, type JobCircularInput } from "@/lib/careers";
import { paginate } from "@/lib/query-inbox";
import { todayInDhaka } from "@/lib/schedule";
import { cn } from "@/lib/utils";

type Row = Database["public"]["Tables"]["job_circulars"]["Row"];
type Form = Omit<JobCircularInput, "vacancies"> & { id?: string; vacancies: string };

const KEY = ["admin", "job-circulars"];
const BLANK: Form = { title: "", department: "medical", employment_type: "full_time", vacancies: "1", qualifications: "", description: "", salary: "Negotiable", deadline: "", apply_email: "", apply_instructions: "", is_active: true };
const STATUS_STYLE = { active: "bg-status-done-tint text-status-done", closed: "bg-surface-soft text-muted-foreground", expired: "bg-status-cancelled-tint text-status-cancelled" } as const;
const STATUS_LABEL = { active: "Active", closed: "Closed", expired: "Expired" } as const;

const toForm = (r: Row): Form => ({ id: r.id, title: r.title, department: r.department as Form["department"], employment_type: r.employment_type as Form["employment_type"], vacancies: String(r.vacancies), qualifications: r.qualifications, description: r.description, salary: r.salary, deadline: r.deadline ?? "", apply_email: r.apply_email, apply_instructions: r.apply_instructions, is_active: r.is_active });

export function JobCircularsManager() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: KEY, queryFn: async () => must(await supabase.from("job_circulars").select("*").order("created_at", { ascending: false })) });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState<Form | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const today = todayInDhaka();
  const view = paginate(filterCirculars(data, search), page, CIRCULARS_PER_PAGE);
  const refresh = () => { qc.invalidateQueries({ queryKey: KEY }); qc.invalidateQueries({ queryKey: ["job-circulars"] }); };
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setEdit((e) => (e ? { ...e, [k]: v } : e));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    const parsed = jobCircularSchema.safeParse(edit);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    setBusy(true);
    const res = edit.id ? await supabase.from("job_circulars").update(parsed.data).eq("id", edit.id) : await supabase.from("job_circulars").insert(parsed.data);
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(edit.id ? "Job circular updated" : "Job circular published");
    if (!edit.id) { setSearch(""); setPage(1); }
    setEdit(null);
    refresh();
  }

  async function toggle(r: Row, active: boolean) {
    qc.setQueryData<Row[]>(KEY, (old) => old?.map((x) => (x.id === r.id ? { ...x, is_active: active } : x)));
    const { error } = await supabase.from("job_circulars").update({ is_active: active }).eq("id", r.id);
    if (error) toast.error(error.message);
    else toast.success(active ? `"${r.title}" is now live on the Career page` : `"${r.title}" closed and hidden from the Career page`);
    refresh();
  }

  async function remove() {
    if (!toDelete) return;
    const { error } = await supabase.from("job_circulars").delete().eq("id", toDelete.id);
    setToDelete(null);
    if (error) { toast.error(error.message); return; }
    toast.success("Job circular deleted");
    refresh();
  }

  const field = (k: keyof Form) => errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>;

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Search job circulars" placeholder="Search title, department, qualification…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 pr-9" />
          {search && <Button size="icon" variant="ghost" aria-label="Clear search" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2" onClick={() => { setSearch(""); setPage(1); }}><X /></Button>}
        </div>
        <Button className="bg-navy" onClick={() => { setErrors({}); setEdit({ ...BLANK }); }}><Plus /> Add Job Circular</Button>
      </div>

      <div className="divide-y divide-line-soft rounded-lg border border-line-soft bg-background">
        {view.items.map((r) => {
          const status = adminStatus(r, today);
          return (
            <div key={r.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold text-navy">{r.title}</p>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", STATUS_STYLE[status])}>{STATUS_LABEL[status]}</span>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{departmentLabel(r.department)}</span>
                  <span>{employmentLabel(r.employment_type)}</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{r.vacancies}</span>
                  <span className="inline-flex items-center gap-1"><CalendarClock className="h-3 w-3" />{r.deadline ? deadlineBadge(r.deadline, today).label : "No deadline"}</span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <label className="mr-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Switch checked={r.is_active} onCheckedChange={(c) => toggle(r, c)} aria-label={`${r.is_active ? "Close" : "Activate"} ${r.title}`} />
                  {r.is_active ? "Active" : "Closed"}
                </label>
                <Button size="icon" variant="ghost" aria-label={`Edit ${r.title}`} onClick={() => { setErrors({}); setEdit(toForm(r)); }}><Pencil /></Button>
                <Button size="icon" variant="ghost" aria-label={`Delete ${r.title}`} className="text-destructive hover:text-destructive" onClick={() => setToDelete(r)}><Trash2 /></Button>
              </div>
            </div>
          );
        })}
        {!view.items.length && <p className="p-6 text-sm text-muted-foreground">{isLoading ? "Loading…" : data.length ? "No job circulars match your search." : "No job circulars yet. Add one to show it on the Career page."}</p>}
      </div>
      <Pagination view={view} onPage={setPage} noun={["job circular", "job circulars"]} />

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{edit?.id ? "Edit Job Circular" : "Add Job Circular"}</DialogTitle>
            <DialogDescription>Active circulars appear on the public Career page until their deadline passes.</DialogDescription>
          </DialogHeader>
          {edit && (
            <form onSubmit={save} noValidate className="space-y-4">
              <div className="space-y-1"><Label htmlFor="jc-title">Job title</Label><Input id="jc-title" value={edit.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Medical Officer (Emergency)" />{field("title")}</div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1"><Label>Department</Label>
                  <Select value={edit.department} onValueChange={(v) => set("department", v as Form["department"])}><SelectTrigger aria-label="Department"><SelectValue /></SelectTrigger><SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="space-y-1"><Label>Employment type</Label>
                  <Select value={edit.employment_type} onValueChange={(v) => set("employment_type", v as Form["employment_type"])}><SelectTrigger aria-label="Employment type"><SelectValue /></SelectTrigger><SelectContent>{EMPLOYMENT_TYPES.map((t) => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="space-y-1"><Label htmlFor="jc-vac">Vacancies</Label><Input id="jc-vac" type="number" min={1} value={edit.vacancies} onChange={(e) => set("vacancies", e.target.value)} />{field("vacancies")}</div>
              </div>
              <div className="space-y-1"><Label htmlFor="jc-qual">Qualifications & experience</Label><Textarea id="jc-qual" rows={3} value={edit.qualifications} onChange={(e) => set("qualifications", e.target.value)} placeholder={"- MBBS with BMDC registration\n- 2 years' experience preferred"} />{field("qualifications")}</div>
              <div className="space-y-1"><Label htmlFor="jc-desc">Job description & responsibilities</Label><Textarea id="jc-desc" rows={7} value={edit.description} onChange={(e) => set("description", e.target.value)} placeholder={"A short overview of the role.\n\n- Responsibility one\n- Responsibility two"} /><p className="text-xs text-muted-foreground">Start a line with "-" to make a bullet point.</p>{field("description")}</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1"><Label htmlFor="jc-salary">Salary / package</Label><Input id="jc-salary" value={edit.salary} onChange={(e) => set("salary", e.target.value)} placeholder="Negotiable" />{field("salary")}</div>
                <div className="space-y-1"><Label htmlFor="jc-deadline">Application deadline</Label><Input id="jc-deadline" type="date" value={edit.deadline} onChange={(e) => set("deadline", e.target.value)} /><p className="text-xs text-muted-foreground">Leave empty for "Open until filled".</p>{field("deadline")}</div>
              </div>
              <div className="space-y-1"><Label htmlFor="jc-email">Application email</Label><Input id="jc-email" type="email" value={edit.apply_email} onChange={(e) => set("apply_email", e.target.value)} placeholder={HR_EMAIL} /><p className="text-xs text-muted-foreground">Leave empty to use the HR desk email.</p>{field("apply_email")}</div>
              <div className="space-y-1"><Label htmlFor="jc-instr">Application instructions (optional)</Label><Textarea id="jc-instr" rows={3} value={edit.apply_instructions} onChange={(e) => set("apply_instructions", e.target.value)} placeholder="e.g. Send your CV, photo and certificates with the job title as the subject." />{field("apply_instructions")}</div>
              <label className="flex items-center gap-3 rounded-lg border border-line-soft p-3 text-sm"><Switch checked={edit.is_active} onCheckedChange={(c) => set("is_active", c)} /><span><span className="font-medium text-navy">Active / Published</span><span className="block text-xs text-muted-foreground">Turn off to hide it from the Career page without deleting it.</span></span></label>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEdit(null)}>Cancel</Button>
                <Button type="submit" disabled={busy} className="bg-navy">{busy ? "Saving…" : edit.id ? "Save changes" : "Publish circular"}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job circular?</AlertDialogTitle>
            <AlertDialogDescription>"{toDelete?.title}" will be removed permanently. To hide it temporarily, switch it to Closed instead.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={remove}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
