import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { worker: { select: { id: true, name: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Reports</h1>
      {reports.length === 0 ? (
        <div className="card">
          <p className="text-gray-400">No reports yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="card">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-white">{r.worker.name}</span>
                <span className="text-sm text-gray-500">
                  {r.type.replace("_", " ")} · {format(r.createdAt, "MMM d, yyyy HH:mm")}
                </span>
              </div>
              {r.tasksDone && <p className="text-gray-300">Tasks: {r.tasksDone}</p>}
              {r.issues && <p className="text-gray-300">Issues: {r.issues}</p>}
              {r.notes && <p className="text-gray-400">{r.notes}</p>}
              <div className="mt-2 border-t border-surface-border pt-2">
                <p className="text-sm text-gray-400">Admin comment / flag (edit via API or Phase 2)</p>
                {r.flagged && <span className="text-amber-400">Flagged</span>}
                {r.adminComment && <p className="text-amber-200/90">{r.adminComment}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
