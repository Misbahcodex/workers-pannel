import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export function requireAdmin(session: { user?: { role?: string } }) {
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export function requireWorker(session: { user?: { role?: string } }) {
  if (session?.user?.role !== "WORKER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
