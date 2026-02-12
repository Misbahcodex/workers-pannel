import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [workersCount, pendingLeave, pendingShiftReq, recentReports] = await Promise.all([
    prisma.user.count({ where: { role: "WORKER" } }),
    prisma.leaveRequest.count({ where: { status: "PENDING" } }),
    prisma.shiftChangeRequest.count({ where: { status: "PENDING" } }),
    prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { worker: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Admin dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/workers" className="card hover:border-accent/50">
          <p className="text-3xl font-semibold text-white">{workersCount}</p>
          <p className="text-sm text-gray-400">Workers</p>
        </Link>
        <Link href="/admin/leave" className="card hover:border-accent/50">
          <p className="text-3xl font-semibold text-amber-400">{pendingLeave}</p>
          <p className="text-sm text-gray-400">Pending leave requests</p>
        </Link>
        <Link href="/admin/shifts" className="card hover:border-accent/50">
          <p className="text-3xl font-semibold text-amber-400">{pendingShiftReq}</p>
          <p className="text-sm text-gray-400">Pending shift changes</p>
        </Link>
      </div>

      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium text-white">Recent reports</h2>
          <Link href="/admin/reports" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        {recentReports.length === 0 ? (
          <p className="text-gray-400">No reports yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentReports.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded border border-surface-border p-2 text-sm"
              >
                <span className="text-gray-200">{r.worker.name} · {r.type}</span>
                <span className="text-gray-500">
                  {r.createdAt.toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
