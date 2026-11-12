import { statusTone, type StatusTone } from "@/lib/patient-search";
import { cn } from "@/lib/utils";

const TONES: Record<StatusTone, string> = {
  pending: "bg-status-pending-tint text-status-pending",
  confirmed: "bg-status-confirmed-tint text-status-confirmed",
  completed: "bg-status-done-tint text-status-done",
  cancelled: "bg-status-cancelled-tint text-status-cancelled",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", TONES[statusTone(status)])}>{status}</span>;
}
