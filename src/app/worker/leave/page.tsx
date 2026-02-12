import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { REQUEST_STATUS_COLOR } from "@/lib/utils";
import { LeaveRequestForm } from "./LeaveRequestForm";

export default async function WorkerLeavePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WORKER") return null;
  const requests = await prisma.leaveRequest.findMany({
    where: { workerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Leave</h1>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">Request leave</h2>
        <LeaveRequestForm />
      </section>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">Your leave requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-400">No leave requests yet.</p>
        ) : (
          <ul className="space-y-2">
            {requests.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-surface-border p-3 text-sm"
              >
                <div>
                  <p className="text-gray-200">
                    {r.leaveType} · {format(r.startDate, "MMM d")} – {format(r.endDate, "MMM d, yyyy")}
                  </p>
                  <p className="text-gray-400">{r.reason}</p>
                  {r.rejectionReason && (
                    <p className="mt-1 text-red-400/90">Rejection: {r.rejectionReason}</p>
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
        )}
      </section>
    </div>
  );
}
