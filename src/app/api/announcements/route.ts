import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reads: { where: { userId: session.user.id } },
    },
  });
  return NextResponse.json({
    announcements: announcements.map((a) => ({
      ...a,
      read: a.reads.length > 0,
      acknowledged: a.reads[0]?.acknowledged ?? false,
    })),
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const { title, body: bodyText, important } = body;
  if (!title || !bodyText) {
    return NextResponse.json({ error: "title and body are required" }, { status: 400 });
  }

  const created = await prisma.announcement.create({
    data: {
      title,
      body: bodyText,
      important: !!important,
      authorId: session.user.id,
      createdBy: session.user.id,
    },
  });
  return NextResponse.json(created);
}
