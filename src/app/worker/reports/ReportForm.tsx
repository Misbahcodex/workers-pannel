"use client";

import { useState } from "react";

const REPORT_TYPES = ["DAILY", "END_OF_SHIFT", "INCIDENT", "WEEKLY"] as const;

export function ReportForm() {
  const [type, setType] = useState<(typeof REPORT_TYPES)[number]>("DAILY");
  const [tasksDone, setTasksDone] = useState("");
  const [issues, setIssues] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          tasksDone: tasksDone || undefined,
          issues: issues || undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error ?? "Submit failed" });
        return;
      }
      setMessage({ type: "ok", text: "Report submitted." });
      setTasksDone("");
      setIssues("");
      setNotes("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm text-gray-400">Report type</label>
        <select
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value as (typeof REPORT_TYPES)[number])}
        >
          {REPORT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Tasks completed</label>
        <textarea
          className="input min-h-[60px]"
          value={tasksDone}
          onChange={(e) => setTasksDone(e.target.value)}
          placeholder="What you completed"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Issues faced</label>
        <textarea
          className="input min-h-[60px]"
          value={issues}
          onChange={(e) => setIssues(e.target.value)}
          placeholder="Any issues or blockers"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Notes</label>
        <textarea
          className="input min-h-[60px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes"
        />
      </div>
      {message && (
        <p className={message.type === "ok" ? "text-emerald-400" : "text-red-400"}>
          {message.text}
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Submitting…" : "Submit report"}
      </button>
    </form>
  );
}
