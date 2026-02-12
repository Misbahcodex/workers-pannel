"use client";

import { signOut } from "next-auth/react";

export function WorkerNav() {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="rounded-lg px-3 py-1.5 text-sm text-gray-400 hover:bg-surface-border hover:text-white"
      >
        Sign out
      </button>
    </div>
  );
}
