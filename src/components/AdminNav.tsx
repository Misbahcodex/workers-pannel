"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export function AdminNav() {
  return (
    <nav className="flex items-center gap-4">
      <Link
        href="/admin"
        className="text-sm text-gray-400 hover:text-white"
      >
        Dashboard
      </Link>
      <Link
        href="/admin/workers"
        className="text-sm text-gray-400 hover:text-white"
      >
        Workers
      </Link>
      <Link
        href="/admin/leave"
        className="text-sm text-gray-400 hover:text-white"
      >
        Leave
      </Link>
      <Link
        href="/admin/shifts"
        className="text-sm text-gray-400 hover:text-white"
      >
        Shifts
      </Link>
      <Link
        href="/admin/reports"
        className="text-sm text-gray-400 hover:text-white"
      >
        Reports
      </Link>
      <Link
        href="/admin/tasks"
        className="text-sm text-gray-400 hover:text-white"
      >
        Tasks
      </Link>
      <Link
        href="/admin/announcements"
        className="text-sm text-gray-400 hover:text-white"
      >
        Announcements
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="rounded-lg px-3 py-1.5 text-sm text-gray-400 hover:bg-surface-border hover:text-white"
      >
        Sign out
      </button>
    </nav>
  );
}
