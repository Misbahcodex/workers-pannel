"use client";

import { useState } from "react";
import { format } from "date-fns";

type Request = {
  id: string;
  workerId: string;
  workerName: string;
  workerEmail: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export function LeaveApprovalList({ requests }: { requests: Request[] }) {
  const [list, setList] = useState(requests);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});

  async function handleDecision(id: string, status: "APPROVED" | "REJECTED") {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/leave/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          rejectionReason: status === "REJECTED" ? rejectionReason[id] : undefined,
        }),
      });
      if (res.ok) setList((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <ul className="space-y-3">
      {list.map((r) => (
        <li key={r.id} className="card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-medium text-white">{r.workerName}</p>
              <p className="text-sm text-gray-400">{r.workerEmail}</p>
              <p className="mt-2 text-gray-200">
                {r.leaveType} · {format(new Date(r.startDate), "MMM d")} – {format(new Date(r.endDate), "MMM d, yyyy")}
              </p>
              <p className="text-sm text-gray-400">{r.reason}</p>
              {r.id in rejectionReason && (
                <input
                  type="text"
                  className="input mt-2"
                  placeholder="Rejection reason"
                  value={rejectionReason[r.id] ?? ""}
                  onChange={(e) =>
                    setRejectionReason((prev) => ({ ...prev, [r.id]: e.target.value }))
                  }
                />
              )}
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
                onClick={() => {
                  if (!(r.id in rejectionReason)) {
                    setRejectionReason((prev) => ({ ...prev, [r.id]: "" }));
                    return;
                  }
                  handleDecision(r.id, "REJECTED");
                }}
                disabled={loadingId === r.id}
                className="btn-secondary border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                {r.id in rejectionReason ? "Confirm reject" : "Reject"}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
