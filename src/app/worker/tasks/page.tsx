import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { TASK_STATUS_COLOR } from "@/lib/utils";
import { TaskStatusUpdate } from "./TaskStatusUpdate";

export default async function WorkerTasksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WORKER") return null;
  const tasks = await prisma.task.findMany({
    where: { workerId: session.user.id },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Tasks</h1>
      {tasks.length === 0 ? (
        <div className="card">
          <p className="text-gray-400">No tasks assigned.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li key={t.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{t.title}</p>
                  {t.description && (
                    <p className="mt-1 text-sm text-gray-400">{t.description}</p>
                  )}
                  {t.dueDate && (
                    <p className="mt-1 text-sm text-gray-500">
                      Due {format(t.dueDate, "MMM d, yyyy")}
                    </p>
                  )}
                  {t.workerNotes && (
                    <p className="mt-2 text-sm text-amber-200/90">Your notes: {t.workerNotes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`badge border ${TASK_STATUS_COLOR[t.status as keyof typeof TASK_STATUS_COLOR] ?? ""}`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                  <TaskStatusUpdate taskId={t.id} currentStatus={t.status} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
