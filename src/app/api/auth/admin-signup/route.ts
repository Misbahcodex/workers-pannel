import { NextResponse } from "next/server";

// Admin signup is disabled. Admin is created only via database seed during initial setup.
// This prevents anyone from signing up as admin through the app.
export async function POST() {
  return NextResponse.json(
    { error: "Admin signup is disabled. Admin account is created during initial setup only." },
    { status: 403 }
  );
}
