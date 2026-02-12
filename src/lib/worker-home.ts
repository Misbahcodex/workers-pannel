import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function getWorkerHomeData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WORKER") return null;
  const userId = session.user.id;
  const today = new Date();
  const dayStart = startOfDay(today);
  const dayEnd = endOfDay(today);

  const profile = await prisma.workerProfile.findUnique({
    where: { userId },
  });
  if (profile?.suspended) {
    return { suspended: true, message: "Your account is suspended. Contact admin." };
  }

  const [
    todayShift,
    pendingLeave,
    pendingShiftRequests,
    tasks,
    announcements,
    notifications,
    approvedLeaveToday,
  ] = await Promise.all([
    prisma.shift.findFirst({
      where: {
        workerId: userId,
        date: { gte: dayStart, lte: dayEnd },
        status: "SCHEDULED",
      },
    }),
    prisma.leaveRequest.count({
      where: { workerId: userId, status: "PENDING" },
    }),
    prisma.shiftChangeRequest.count({
      where: { workerId: userId, status: "PENDING" },
    }),
    prisma.task.findMany({
      where: { workerId: userId, status: { in: ["PENDING", "IN_PROGRESS"] } },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
    prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { reads: { where: { userId } } },
    }),
    prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.leaveRequest.findFirst({
      where: {
        workerId: userId,
        status: "APPROVED",
        startDate: { lte: dayEnd },
        endDate: { gte: dayStart },
      },
    }),
  ]);

  let currentStatus: "On duty" | "Off duty" | "On leave" = "Off duty";
  if (approvedLeaveToday) currentStatus = "On leave";
  else if (todayShift) currentStatus = "On duty";

  return {
    suspended: false,
    todayShift: todayShift
      ? {
          id: todayShift.id,
          startTime: todayShift.startTime,
          endTime: todayShift.endTime,
          location: todayShift.location,
          department: todayShift.department,
          role: todayShift.role,
        }
      : null,
    currentStatus,
    pendingLeaveCount: pendingLeave,
    pendingShiftChangeCount: pendingShiftRequests,
    tasks: tasks.map((t) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate,
    })),
    announcements: announcements.map((a) => ({
      id: a.id,
      title: a.title,
      important: a.important,
      createdAt: a.createdAt,
      read: a.reads.length > 0,
      acknowledged: a.reads[0]?.acknowledged ?? false,
    })),
    notifications: notifications.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      type: n.type,
      read: n.read,
      createdAt: n.createdAt,
    })),
  };
}
