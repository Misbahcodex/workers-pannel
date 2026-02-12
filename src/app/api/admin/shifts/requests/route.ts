import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const requests = await prisma.shiftChangeRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      worker: { select: { id: true, name: true, email: true } },
    },
  });
  return NextResponse.json({ requests });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const { id, status, adminNotes } = body;
  if (!id || !status || (status !== "APPROVED" && status !== "REJECTED")) {
    return NextResponse.json({ error: "id and status (APPROVED/REJECTED) required" }, { status: 400 });
  }
  const existing = await prisma.shiftChangeRequest.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.status !== "PENDING") {
    return NextResponse.json({ error: "Request already processed" }, { status: 400 });
  }

  const updated = await prisma.shiftChangeRequest.update({
    where: { id },
    data: {
      status,
      adminNotes: adminNotes ?? null,
    },
  });
  await prisma.notification.create({
    data: {
      userId: existing.workerId,
      title: `Shift change request ${status.toLowerCase()}`,
      body: adminNotes ?? undefined,
      type: "SHIFT_CHANGE",
    },
  });
  return NextResponse.json(updated);
}
