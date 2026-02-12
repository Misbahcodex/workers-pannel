import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const suspended = body.suspended === true;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== "WORKER") {
    return NextResponse.json({ error: "Worker not found" }, { status: 404 });
  }
  await prisma.workerProfile.upsert({
    where: { userId: id },
    create: { userId: id, suspended },
    update: { suspended },
  });
  return NextResponse.json({ ok: true, suspended });
}
