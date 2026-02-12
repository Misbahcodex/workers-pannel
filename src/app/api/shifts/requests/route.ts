import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const workerId = session.user.role === "ADMIN" ? undefined : session.user.id;
  const requests = await prisma.shiftChangeRequest.findMany({
    where: workerId ? { workerId } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ requests });
}
