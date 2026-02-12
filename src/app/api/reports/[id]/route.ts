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
  const { adminComment, flagged } = body;

  const updated = await prisma.report.update({
    where: { id },
    data: {
      ...(adminComment !== undefined && { adminComment }),
      ...(flagged !== undefined && { flagged }),
    },
  });
  return NextResponse.json(updated);
}
