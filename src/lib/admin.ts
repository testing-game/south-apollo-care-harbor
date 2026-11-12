import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export const adminDoctorsQuery = queryOptions({ queryKey: ["admin", "doctors"], queryFn: async () => must(await supabase.from("doctors").select("*").order("name")) });
export const adminPackagesQuery = queryOptions({ queryKey: ["admin", "packages"], queryFn: async () => must(await supabase.from("health_packages").select("*").order("display_order")) });
export const adminSpecialitiesQuery = queryOptions({ queryKey: ["admin", "specialities"], queryFn: async () => must(await supabase.from("specialities").select("id,name").order("display_order")) });
export const appointmentsQuery = (date: string) => queryOptions({ queryKey: ["admin", "appointments", date], queryFn: async () => must(await supabase.from("doctor_appointments").select("*, doctors(name, department_name, room_number, visiting_hours)").eq("appointment_date", date).order("created_at")) });
export const bookingsQuery = (date: string) => queryOptions({ queryKey: ["admin", "bookings", date], queryFn: async () => must(await supabase.from("test_bookings").select("*, health_packages(title)").eq("booking_date", date).order("created_at")) });
export const queriesQuery = queryOptions({ queryKey: ["admin", "queries"], queryFn: async () => must(await supabase.from("queries_contact").select("*").order("created_at", { ascending: false }).limit(200)) });

export const adminSocialLinksQuery = queryOptions({ queryKey: ["admin", "social-links"], queryFn: async () => must(await supabase.from("social_links").select("platform,url,is_active,display_order").order("display_order")) });

export const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
export const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export { must };
