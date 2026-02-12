import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await _req.json().catch(() => ({}));
  const acknowledged = body.acknowledged === true;

  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const readRecord = await prisma.announcementRead.findFirst({
    where: { announcementId: id, userId: session.user.id },
  });
  if (!readRecord) {
    await prisma.announcementRead.create({
      data: {
        announcementId: id,
        userId: session.user.id,
        acknowledged,
      },
    });
  } else {
    await prisma.announcementRead.update({
      where: { id: readRecord.id },
      data: { acknowledged },
    });
  }

  return NextResponse.json({ ok: true });
}
