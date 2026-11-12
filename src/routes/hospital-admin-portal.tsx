import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { BookOpen, CalendarCheck, FlaskConical, LayoutDashboard, LogOut, Menu, MessageSquare, Package, Search, Share2, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { asset } from "@/lib/asset";

export const Route = createFileRoute("/hospital-admin-portal")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Portal | South Apollo" }, { name: "robots", content: "noindex, nofollow" }, { name: "description", content: "Staff-only administration portal." }, { property: "og:title", content: "Admin Portal | South Apollo" }, { property: "og:description", content: "Staff-only administration portal." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/hospital-admin-portal", label: "Dashboard", icon: LayoutDashboard },
  { to: "/hospital-admin-portal/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/hospital-admin-portal/bookings", label: "Test Bookings", icon: FlaskConical },
  { to: "/hospital-admin-portal/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/hospital-admin-portal/packages", label: "Packages", icon: Package },
  { to: "/hospital-admin-portal/content", label: "Content", icon: BookOpen },
  { to: "/hospital-admin-portal/patients", label: "Patient Search", icon: Search },
  { to: "/hospital-admin-portal/queries", label: "Queries", icon: MessageSquare },
  { to: "/hospital-admin-portal/social", label: "Social Links", icon: Share2 },
] as const;

function AdminLayout() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "INITIAL_SESSION") setSession(s);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(undefined); return; }
    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/hospital-admin-portal", replace: true });
  }

  if (session === undefined || (session && isAdmin === undefined)) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  if (!session) return <AdminLogin />;
  if (!isAdmin) return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div><h1 className="text-xl font-bold text-navy">No admin access</h1><p className="mt-2 text-sm text-muted-foreground">Signed in as {session.user.email}. Ask the hospital administrator to grant access.</p><Button variant="outline" className="mt-4" onClick={signOut}>Sign out</Button></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface-soft">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-line-soft bg-background transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 border-b border-line-soft p-4">
          <img src={asset("logoo.png")} alt="" className="h-10 w-10" />
          <div className="text-sm font-bold leading-tight text-navy">South Apollo<br /><span className="text-xs font-medium text-muted-foreground">Admin Portal</span></div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} activeOptions={{ exact: true }} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-navy hover:bg-surface-soft" activeProps={{ className: "bg-navy text-primary-foreground hover:bg-navy" }}>
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-line-soft p-3">
          <p className="mb-2 truncate px-3 text-xs text-muted-foreground">{session.user.email}</p>
          <Button variant="ghost" className="w-full justify-start" onClick={signOut}><LogOut /> Sign out</Button>
        </div>
      </aside>
      {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-foreground/30 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-3 border-b border-line-soft bg-background p-3 lg:hidden">
          <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setOpen(true)}><Menu /></Button>
          <span className="font-bold text-navy">Admin Portal</span>
        </header>
        <main className="p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

function AdminLogin() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/hospital-admin-portal` } });
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    if (mode === "up") toast.success("Check your email to confirm the account, then ask for admin access.");
  }
  return (
    <div className="grid min-h-screen place-items-center bg-surface-soft p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 border border-line-soft bg-background p-8">
        <div className="text-center">
          <img src={asset("logoo.png")} alt="South Apollo" className="mx-auto h-16 w-16" />
          <h1 className="mt-3 text-xl font-bold text-navy">{mode === "in" ? "Staff sign in" : "Create staff account"}</h1>
        </div>
        <div className="space-y-1"><Label htmlFor="ae">Email</Label><Input id="ae" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="ap">Password</Label><Input id="ap" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" disabled={busy} className="w-full bg-navy hover:bg-sky">{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}</Button>
        <button type="button" className="w-full text-center text-xs text-muted-foreground hover:underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? "Need an account? Create one" : "Have an account? Sign in"}</button>
      </form>
    </div>
  );
}
