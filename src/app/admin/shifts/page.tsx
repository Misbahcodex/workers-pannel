import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ShiftRequestApprovalList } from "./ShiftRequestApprovalList";
import { AssignShiftForm } from "./AssignShiftForm";

export default async function AdminShiftsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") return null;
  const [requests, workers] = await Promise.all([
    prisma.shiftChangeRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { worker: { select: { id: true, name: true, email: true } } },
    }),
    prisma.user.findMany({
      where: { role: "WORKER" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-white">Shifts</h1>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">Assign shift</h2>
        <AssignShiftForm workers={workers} />
      </section>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">Pending shift change requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-400">No pending requests.</p>
        ) : (
          <ShiftRequestApprovalList
            requests={requests.map((r) => ({
              id: r.id,
              workerName: r.worker.name,
              workerEmail: r.worker.email,
              type: r.type,
              requestedDate: r.requestedDate.toISOString(),
              reason: r.reason,
            }))}
          />
        )}
      </section>
    </div>
  );
}
