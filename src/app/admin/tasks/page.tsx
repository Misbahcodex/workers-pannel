import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { AssignTaskForm } from "./AssignTaskForm";

export default async function AdminTasksPage() {
  const [workers, tasks] = await Promise.all([
    prisma.user.findMany({
      where: { role: "WORKER" },
      select: { id: true, name: true, email: true },
    }),
    prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      include: { worker: { select: { name: true, email: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-white">Tasks</h1>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">Assign task</h2>
        <AssignTaskForm workers={workers} />
      </section>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">All tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-400">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-surface-border p-3 text-sm"
              >
                <div>
                  <p className="font-medium text-white">{t.title}</p>
                  <p className="text-gray-400">
                    {t.worker.name} · {t.status} {t.dueDate && `· Due ${format(t.dueDate, "MMM d")}`}
                  </p>
                  {t.workerNotes && (
                    <p className="mt-1 text-gray-500">Worker: {t.workerNotes}</p>
                  )}
                </div>
                <span
                  className={`badge border ${
                    t.status === "COMPLETED"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : t.status === "IN_PROGRESS"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-slate-500/20 text-slate-400"
                  }`}
                >
                  {t.status.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
