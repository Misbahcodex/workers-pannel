import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ReportForm } from "./ReportForm";

export default async function WorkerReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WORKER") return null;
  const reports = await prisma.report.findMany({
    where: { workerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Reports</h1>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">Submit report</h2>
        <ReportForm />
      </section>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">Your reports</h2>
        {reports.length === 0 ? (
          <p className="text-gray-400">No reports yet.</p>
        ) : (
          <ul className="space-y-3">
            {reports.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-surface-border bg-surface/50 p-3 text-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-white">{r.type.replace("_", " ")}</span>
                  <span className="text-gray-500">{format(r.createdAt, "MMM d, yyyy HH:mm")}</span>
                </div>
                {r.tasksDone && <p className="text-gray-300">Tasks: {r.tasksDone}</p>}
                {r.issues && <p className="text-gray-300">Issues: {r.issues}</p>}
                {r.notes && <p className="text-gray-400">{r.notes}</p>}
                {r.adminComment && (
                  <p className="mt-2 border-t border-surface-border pt-2 text-amber-200/90">
                    Admin: {r.adminComment}
                  </p>
                )}
                {r.flagged && (
                  <span className="mt-2 inline-block text-amber-400">Flagged</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
