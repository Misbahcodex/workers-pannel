import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const REPORT_TYPES = ["DAILY", "END_OF_SHIFT", "INCIDENT", "WEEKLY"];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const workerIdParam = session.user.role === "ADMIN" ? searchParams.get("workerId") : null;
  if (session.user.role === "WORKER") {
    const reports = await prisma.report.findMany({
      where: { workerId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reports });
  }
  const reports = await prisma.report.findMany({
    where: workerIdParam ? { workerId: workerIdParam } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reports });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WORKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { type, tasksDone, issues, notes, attachmentUrl } = body;
  if (!type || !REPORT_TYPES.includes(type)) {
    return NextResponse.json({ error: "type must be one of: " + REPORT_TYPES.join(", ") }, { status: 400 });
  }

  const created = await prisma.report.create({
    data: {
      workerId: session.user.id,
      type,
      tasksDone: tasksDone ?? null,
      issues: issues ?? null,
      notes: notes ?? null,
      attachmentUrl: attachmentUrl ?? null,
      createdBy: session.user.id,
    },
  });
  return NextResponse.json(created);
}
