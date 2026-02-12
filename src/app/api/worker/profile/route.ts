import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WORKER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const { name, department, emergencyContact, phone } = body;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { ...(name != null && { name }) },
  });
  await prisma.workerProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      department: department ?? null,
      emergencyContact: emergencyContact ?? null,
      phone: phone ?? null,
    },
    update: {
      ...(department !== undefined && { department: department ?? null }),
      ...(emergencyContact !== undefined && { emergencyContact: emergencyContact ?? null }),
      ...(phone !== undefined && { phone: phone ?? null }),
    },
  });
  return NextResponse.json({ ok: true });
}
