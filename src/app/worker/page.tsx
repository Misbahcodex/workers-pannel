import Link from "next/link";
import { TASK_STATUS_COLOR, formatTime } from "@/lib/utils";
import { getWorkerHomeData } from "@/lib/worker-home";

export default async function WorkerHomePage() {
  const data = await getWorkerHomeData();
  if (!data) {
    return (
      <div className="card">
        <p className="text-gray-400">Unable to load dashboard. Try again.</p>
      </div>
    );
  }
  if ("suspended" in data && data.suspended) {
    return (
      <div className="card border-red-500/50">
        <p className="text-red-400">{data.message}</p>
      </div>
    );
  }

  const statusColor =
    data.currentStatus === "On duty"
      ? "bg-status-on_duty/20 text-status-on_duty border-status-on_duty/40"
      : data.currentStatus === "On leave"
        ? "bg-status-on_leave/20 text-status-on_leave border-status-on_leave/40"
        : "bg-status-off_duty/20 text-status-off_duty border-status-off_duty/40";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Today</h1>

      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-gray-400">Current status</span>
          <span
            className={`badge border ${statusColor}`}
          >
            {data.currentStatus}
          </span>
        </div>
        {data.todayShift ? (
          <div className="space-y-1 text-gray-200">
            <p className="font-medium text-white">
              {formatTime(data.todayShift.startTime)} – {formatTime(data.todayShift.endTime)}
            </p>
            {data.todayShift.location && (
              <p className="text-sm">{data.todayShift.location}</p>
            )}
            {data.todayShift.department && (
              <p className="text-sm text-gray-400">{data.todayShift.department}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-400">No shift scheduled today.</p>
        )}
      </section>

      {((data.pendingLeaveCount ?? 0) > 0 || (data.pendingShiftChangeCount ?? 0) > 0) && (
        <section className="card border-amber-500/30">
          <h2 className="mb-2 text-sm font-medium text-amber-400">Pending requests</h2>
          <ul className="space-y-1 text-sm">
            {(data.pendingLeaveCount ?? 0) > 0 && (
              <li>
                <Link href="/worker/leave" className="text-accent hover:underline">
                  {data.pendingLeaveCount} leave request(s) pending
                </Link>
              </li>
            )}
            {(data.pendingShiftChangeCount ?? 0) > 0 && (
              <li>
                <Link href="/worker/shifts" className="text-accent hover:underline">
                  {data.pendingShiftChangeCount} shift change request(s) pending
                </Link>
              </li>
            )}
          </ul>
        </section>
      )}

      {(data.tasks?.length ?? 0) > 0 && (
        <section className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium text-white">Assigned tasks</h2>
            <Link href="/worker/tasks" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-2">
            {(data.tasks ?? []).map((t: { id: string; title: string; status: string; dueDate: Date | null }) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-surface-border bg-surface/50 p-2"
              >
                <span className="text-sm text-gray-200">{t.title}</span>
                <span
                  className={`badge border ${TASK_STATUS_COLOR[t.status as keyof typeof TASK_STATUS_COLOR] ?? "bg-slate-500/20 text-slate-400"}`}
                >
                  {t.status.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(data.announcements?.length ?? 0) > 0 && (
        <section className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium text-white">Latest announcements</h2>
            <Link
              href="/worker/announcements"
              className="text-sm text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-2">
            {(data.announcements ?? []).map(
              (a: {
                id: string;
                title: string;
                important: boolean;
                read: boolean;
                createdAt: Date;
              }) => (
                <li key={a.id}>
                  <Link
                    href={`/worker/announcements#${a.id}`}
                    className={`block rounded-lg border p-2 text-sm ${a.important ? "border-amber-500/40 bg-amber-500/10" : "border-surface-border"} ${!a.read ? "font-medium text-white" : "text-gray-300"}`}
                  >
                    {a.important && "📌 "}
                    {a.title}
                    {!a.read && " (new)"}
                  </Link>
                </li>
              )
            )}
          </ul>
        </section>
      )}

      {(data.notifications?.length ?? 0) > 0 && (
        <section className="card">
          <h2 className="mb-2 font-medium text-white">Notifications</h2>
          <ul className="space-y-2">
            {(data.notifications ?? []).slice(0, 3).map(
              (n: { id: string; title: string; body?: string | null; createdAt: Date }) => (
                <li
                  key={n.id}
                  className="rounded-lg border border-surface-border bg-surface/50 p-2 text-sm text-gray-200"
                >
                  <p className="font-medium text-white">{n.title}</p>
                  {n.body && <p className="text-gray-400">{n.body}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    {n.createdAt instanceof Date ? n.createdAt.toLocaleString() : new Date(n.createdAt).toLocaleString()}
                  </p>
                </li>
              )
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
