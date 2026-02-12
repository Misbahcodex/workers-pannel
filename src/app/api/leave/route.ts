import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LEAVE_TYPES = ["CASUAL", "SICK", "EMERGENCY", "UNPAID"];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const workerIdParam = session.user.role === "ADMIN" ? searchParams.get("workerId") : null;
  if (session.user.role === "WORKER") {
    const list = await prisma.leaveRequest.findMany({
      where: { workerId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ requests: list });
  }
  const list = await prisma.leaveRequest.findMany({
    where: workerIdParam ? { workerId: workerIdParam } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ requests: list });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WORKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { leaveType, startDate, endDate, reason, documentUrl } = body;
  if (!leaveType || !startDate || !endDate || !reason) {
    return NextResponse.json(
      { error: "leaveType, startDate, endDate, and reason are required" },
      { status: 400 }
    );
  }
  if (!LEAVE_TYPES.includes(leaveType)) {
    return NextResponse.json({ error: "Invalid leaveType" }, { status: 400 });
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) {
    return NextResponse.json({ error: "endDate must be after startDate" }, { status: 400 });
  }

  const created = await prisma.leaveRequest.create({
    data: {
      workerId: session.user.id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      documentUrl: documentUrl ?? null,
      status: "PENDING",
      createdBy: session.user.id,
    },
  });
  return NextResponse.json(created);
}
