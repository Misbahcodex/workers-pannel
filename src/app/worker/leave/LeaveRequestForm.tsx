"use client";

import { useState } from "react";

const LEAVE_TYPES = ["CASUAL", "SICK", "EMERGENCY", "UNPAID"] as const;

export function LeaveRequestForm() {
  const [leaveType, setLeaveType] = useState<(typeof LEAVE_TYPES)[number]>("CASUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaveType, startDate, endDate, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error ?? "Request failed" });
        return;
      }
      setMessage({ type: "ok", text: "Leave request submitted. Pending admin approval." });
      setStartDate("");
      setEndDate("");
      setReason("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm text-gray-400">Leave type</label>
        <select
          className="input"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value as (typeof LEAVE_TYPES)[number])}
        >
          {LEAVE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-400">Start date</label>
          <input
            type="date"
            className="input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-400">End date</label>
          <input
            type="date"
            className="input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Reason</label>
        <textarea
          className="input min-h-[80px]"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          placeholder="Reason for leave"
        />
      </div>
      {message && (
        <p className={message.type === "ok" ? "text-emerald-400" : "text-red-400"}>
          {message.text}
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Submitting…" : "Submit request"}
      </button>
    </form>
  );
}
