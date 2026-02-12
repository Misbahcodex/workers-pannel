"use client";

import { useState } from "react";
import { format } from "date-fns";

type Request = {
  id: string;
  workerName: string;
  workerEmail: string;
  type: string;
  requestedDate: string;
  reason: string;
};

export function ShiftRequestApprovalList({ requests }: { requests: Request[] }) {
  const [list, setList] = useState(requests);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function handleDecision(id: string, status: "APPROVED" | "REJECTED") {
    setLoadingId(id);
    try {
      const res = await fetch("/api/admin/shifts/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, adminNotes: notes[id] }),
      });
      if (res.ok) setList((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <ul className="space-y-3">
      {list.map((r) => (
        <li key={r.id} className="rounded-lg border border-surface-border p-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-medium text-white">{r.workerName}</p>
              <p className="text-sm text-gray-400">{r.workerEmail}</p>
              <p className="mt-1 text-gray-200">
                {r.type} · {format(new Date(r.requestedDate), "MMM d, yyyy")}
              </p>
              <p className="text-sm text-gray-400">{r.reason}</p>
              <input
                type="text"
                className="input mt-2"
                placeholder="Admin notes (optional)"
                value={notes[r.id] ?? ""}
                onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDecision(r.id, "APPROVED")}
                disabled={loadingId === r.id}
                className="btn-primary rounded-lg bg-emerald-600 hover:bg-emerald-500"
              >
                Approve
              </button>
              <button
                onClick={() => handleDecision(r.id, "REJECTED")}
                disabled={loadingId === r.id}
                className="btn-secondary border-red-500/50 text-red-400"
              >
                Reject
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
