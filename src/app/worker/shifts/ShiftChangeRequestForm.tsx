"use client";

import { useState } from "react";

export function ShiftChangeRequestForm() {
  const [requestedDate, setRequestedDate] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"CHANGE" | "SWAP" | "EXTRA">("CHANGE");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!requestedDate || !reason) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/shifts/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestedDate, reason, type }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error ?? "Request failed" });
        return;
      }
      setMessage({ type: "ok", text: "Request submitted. Pending admin approval." });
      setRequestedDate("");
      setReason("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm text-gray-400">Type</label>
        <select
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value as "CHANGE" | "SWAP" | "EXTRA")}
        >
          <option value="CHANGE">Shift change</option>
          <option value="SWAP">Shift swap</option>
          <option value="EXTRA">Extra shift / overtime</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Requested date</label>
        <input
          type="date"
          className="input"
          value={requestedDate}
          onChange={(e) => setRequestedDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Reason</label>
        <textarea
          className="input min-h-[80px]"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          placeholder="Brief reason for the request"
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
