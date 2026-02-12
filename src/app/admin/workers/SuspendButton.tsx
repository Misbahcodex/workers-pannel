"use client";

import { useState } from "react";

export function SuspendButton({
  workerId,
  suspended,
}: {
  workerId: string;
  suspended: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(suspended);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/workers/${workerId}/suspend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspended: !current }),
      });
      if (res.ok) setCurrent(!current);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`rounded-lg px-3 py-1.5 text-sm ${current ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30" : "border border-red-500/50 text-red-400 hover:bg-red-500/10"}`}
    >
      {loading ? "…" : current ? "Unsuspend" : "Suspend"}
    </button>
  );
}
