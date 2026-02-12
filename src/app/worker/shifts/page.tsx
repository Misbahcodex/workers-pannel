import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { formatTime } from "@/lib/utils";
import { REQUEST_STATUS_COLOR } from "@/lib/utils";
import { ShiftChangeRequestForm } from "./ShiftChangeRequestForm";

export default async function WorkerShiftsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WORKER") return null;
  const userId = session.user.id;
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  const [shifts, changeRequests] = await Promise.all([
    prisma.shift.findMany({
      where: {
        workerId: userId,
        date: { gte: start, lte: end },
        status: { in: ["SCHEDULED", "COMPLETED", "ON_LEAVE"] },
      },
      orderBy: { date: "asc" },
    }),
    prisma.shiftChangeRequest.findMany({
      where: { workerId: userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Shifts & schedule</h1>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">This week</h2>
        {shifts.length === 0 ? (
          <p className="text-gray-400">No shifts this week.</p>
        ) : (
          <ul className="space-y-2">
            {shifts.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-surface-border bg-surface/50 p-3"
              >
                <div>
                  <p className="font-medium text-white">
                    {format(s.date, "EEE, MMM d")} · {formatTime(s.startTime)} – {formatTime(s.endTime)}
                  </p>
                  {s.role && <p className="text-sm text-gray-400">{s.role}</p>}
                  {s.location && <p className="text-sm text-gray-400">{s.location}</p>}
                </div>
                <span
                  className={`badge border ${
                    s.status === "ON_LEAVE"
                      ? "bg-status-on_leave/20 text-amber-400"
                      : s.status === "COMPLETED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-accent/20 text-accent"
                  }`}
                >
                  {s.status.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">Request shift change</h2>
        <ShiftChangeRequestForm />
      </section>

      {changeRequests.length > 0 && (
        <section className="card">
          <h2 className="mb-3 font-medium text-white">Your shift change requests</h2>
          <ul className="space-y-2">
            {changeRequests.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-surface-border p-3 text-sm"
              >
                <div>
                  <p className="text-gray-200">
                    {r.type} · {format(r.requestedDate, "MMM d, yyyy")}
                  </p>
                  <p className="text-gray-400">{r.reason}</p>
                  {r.adminNotes && (
                    <p className="mt-1 text-gray-500">Admin: {r.adminNotes}</p>
                  )}
                </div>
                <span
                  className={`badge border ${REQUEST_STATUS_COLOR[r.status as keyof typeof REQUEST_STATUS_COLOR] ?? ""}`}
                >
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
