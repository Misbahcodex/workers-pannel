import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { SuspendButton } from "./SuspendButton";
import { AddWorkerForm } from "./AddWorkerForm";

export default async function AdminWorkersPage() {
  const workers = await prisma.user.findMany({
    where: { role: "WORKER" },
    include: {
      workerProfile: true,
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Workers</h1>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">Add worker</h2>
        <p className="mb-3 text-sm text-gray-400">
          Workers can only log in with accounts you create here. Share the email and password with them.
        </p>
        <AddWorkerForm />
      </section>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">Worker list</h2>
      {workers.length === 0 ? (
        <div className="card">
          <p className="text-gray-400">No workers yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {workers.map((w) => (
            <li key={w.id} className="card flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">{w.name}</p>
                <p className="text-sm text-gray-400">{w.email}</p>
                {w.workerProfile && (
                  <p className="mt-1 text-sm text-gray-500">
                    {w.workerProfile.department && `${w.workerProfile.department} · `}
                    {w.workerProfile.phone && ` ${w.workerProfile.phone}`}
                    {w.workerProfile.suspended && (
                      <span className="ml-2 text-amber-400">Suspended</span>
                    )}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Joined {format(w.createdAt, "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/reports?workerId=${w.id}`}
                  className="btn-secondary text-sm"
                >
                  Reports
                </Link>
                <SuspendButton
                  workerId={w.id}
                  suspended={w.workerProfile?.suspended ?? false}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      </section>
    </div>
  );
}
