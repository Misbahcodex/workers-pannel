import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const { workerId, date, startTime, endTime, role, location, department } = body;
  if (!workerId || !date || !startTime || !endTime) {
    return NextResponse.json(
      { error: "workerId, date, startTime, endTime required" },
      { status: 400 }
    );
  }
  const created = await prisma.shift.create({
    data: {
      workerId,
      date: new Date(date),
      startTime: String(startTime),
      endTime: String(endTime),
      role: role ?? null,
      location: location ?? null,
      department: department ?? null,
      createdBy: session.user.id,
    },
  });
  return NextResponse.json(created);
}
