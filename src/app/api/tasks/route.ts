import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const workerIdParam = session.user.role === "ADMIN" ? searchParams.get("workerId") : null;
  if (session.user.role === "WORKER") {
    const tasks = await prisma.task.findMany({
      where: { workerId: session.user.id },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ tasks });
  }
  const tasks = await prisma.task.findMany({
    where: workerIdParam ? { workerId: workerIdParam } : undefined,
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const { workerId, title, description, priority, dueDate } = body;
  if (!workerId || !title) {
    return NextResponse.json({ error: "workerId and title required" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      workerId,
      title,
      description: description ?? null,
      priority: (priority && ["LOW", "MEDIUM", "HIGH"].includes(priority)) ? priority : "MEDIUM",
      dueDate: dueDate ? new Date(dueDate) : null,
      createdBy: session.user.id,
    },
  });
  await prisma.notification.create({
    data: {
      userId: workerId,
      title: "New task assigned",
      body: title,
      type: "TASK_ASSIGNED",
    },
  });
  return NextResponse.json(task);
}
