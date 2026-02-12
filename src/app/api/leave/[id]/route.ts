import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const { status, rejectionReason } = body;

  const existing = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role === "ADMIN") {
    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json({ error: "status must be APPROVED or REJECTED" }, { status: 400 });
    }
    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? (rejectionReason ?? "") : null,
        reviewedBy: session.user.id,
      },
    });
    await prisma.notification.create({
      data: {
        userId: existing.workerId,
        title: `Leave request ${status.toLowerCase()}`,
        body: status === "REJECTED" && rejectionReason ? rejectionReason : undefined,
        type: "LEAVE_DECISION",
      },
    });
    if (status === "APPROVED") {
      await prisma.shift.updateMany({
        where: {
          workerId: existing.workerId,
          date: { gte: existing.startDate, lte: existing.endDate },
          status: "SCHEDULED",
        },
        data: { status: "ON_LEAVE" },
      });
    }
    return NextResponse.json(updated);
  }

  if (session.user.role === "WORKER" && existing.workerId === session.user.id) {
    if (existing.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending requests can be cancelled" }, { status: 400 });
    }
    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: { status: "REJECTED" },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
