import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WORKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { shiftId, requestedDate, reason, type } = body;
  if (!requestedDate || !reason || !type) {
    return NextResponse.json(
      { error: "requestedDate, reason, and type are required" },
      { status: 400 }
    );
  }
  const validTypes = ["CHANGE", "SWAP", "EXTRA"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const created = await prisma.shiftChangeRequest.create({
    data: {
      workerId: session.user.id,
      shiftId: shiftId ?? null,
      requestedDate: new Date(requestedDate),
      reason,
      type,
      status: "PENDING",
      createdBy: session.user.id,
    },
  });
  return NextResponse.json(created);
}
