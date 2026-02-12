import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const view = searchParams.get("view") ?? "week";
  const workerId = session.user.role === "ADMIN" ? searchParams.get("workerId") : session.user.id;
  const effectiveWorkerId = workerId ?? session.user.id;
  if (session.user.role === "WORKER" && effectiveWorkerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const start = view === "month" ? new Date(now.getFullYear(), now.getMonth(), 1) : startOfWeek(now, { weekStartsOn: 1 });
  const end = view === "month" ? new Date(now.getFullYear(), now.getMonth() + 1, 0) : endOfWeek(now, { weekStartsOn: 1 });

  const shifts = await prisma.shift.findMany({
    where: {
      workerId: effectiveWorkerId,
      date: { gte: start, lte: end },
      status: { in: ["SCHEDULED", "COMPLETED"] },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ shifts });
}
