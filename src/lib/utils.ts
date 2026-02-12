import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTime(s: string) {
  if (!s) return "—";
  const [h, m] = s.split(":");
  const hh = parseInt(h ?? "0", 10);
  const am = hh < 12;
  const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
  return `${h12}:${m ?? "00"} ${am ? "AM" : "PM"}`;
}

export const REQUEST_STATUS_COLOR = {
  PENDING: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  APPROVED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  REJECTED: "bg-red-500/20 text-red-400 border-red-500/40",
} as const;

export const TASK_STATUS_COLOR = {
  PENDING: "bg-slate-500/20 text-slate-400 border-slate-500/40",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  COMPLETED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
} as const;
