import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WORKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const today = new Date();
  const dayStart = startOfDay(today);
  const dayEnd = endOfDay(today);

  const [todayShift, pendingLeave, pendingShiftRequests, tasks, announcements, notifications] =
    await Promise.all([
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
        include: {
          reads: { where: { userId } },
        },
      }),
      prisma.notification.findMany({
        where: { userId, read: false },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

  const profile = await prisma.workerProfile.findUnique({
    where: { userId },
  });
  if (profile?.suspended) {
    return NextResponse.json({
      suspended: true,
      message: "Your account is suspended. Contact admin.",
    });
  }

  const approvedLeaveToday = await prisma.leaveRequest.findFirst({
    where: {
      workerId: userId,
      status: "APPROVED",
      startDate: { lte: dayEnd },
      endDate: { gte: dayStart },
    },
  });

  let currentStatus: "On duty" | "Off duty" | "On leave" = "Off duty";
  if (approvedLeaveToday) currentStatus = "On leave";
  else if (todayShift) currentStatus = "On duty";

  return NextResponse.json({
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
      dueDate: t.dueDate?.toISOString() ?? null,
    })),
    announcements: announcements.map((a) => ({
      id: a.id,
      title: a.title,
      important: a.important,
      createdAt: a.createdAt.toISOString(),
      read: a.reads.length > 0,
      acknowledged: a.reads[0]?.acknowledged ?? false,
    })),
    notifications: notifications.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      type: n.type,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    })),
  });
}
