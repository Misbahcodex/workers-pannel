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
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.workerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status, workerNotes } = body;
  const data: { status?: string; workerNotes?: string } = {};
  if (status && ["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    data.status = status;
  }
  if (workerNotes !== undefined) data.workerNotes = workerNotes;

  const updated = await prisma.task.update({
    where: { id },
    data,
  });
  return NextResponse.json(updated);
}
