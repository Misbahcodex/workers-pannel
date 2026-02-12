import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { LeaveApprovalList } from "./LeaveApprovalList";

export default async function AdminLeavePage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") return null;
  const requests = await prisma.leaveRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { worker: { select: { id: true, name: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Leave requests</h1>
      {requests.length === 0 ? (
        <div className="card">
          <p className="text-gray-400">No pending leave requests.</p>
        </div>
      ) : (
        <LeaveApprovalList
          requests={requests.map((r) => ({
            id: r.id,
            workerId: r.worker.id,
            workerName: r.worker.name,
            workerEmail: r.worker.email,
            leaveType: r.leaveType,
            startDate: r.startDate.toISOString(),
            endDate: r.endDate.toISOString(),
            reason: r.reason,
          }))}
        />
      )}
    </div>
  );
}
