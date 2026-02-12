"use client";

import { useState } from "react";

type Worker = { id: string; name: string; email: string };

export function AssignShiftForm({ workers }: { workers: Worker[] }) {
  const [workerId, setWorkerId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!workerId || !date) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/shifts/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId,
          date,
          startTime,
          endTime,
          role: role || undefined,
          location: location || undefined,
          department: department || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error ?? "Failed" });
        return;
      }
      setMessage({ type: "ok", text: "Shift assigned." });
      setDate("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm text-gray-400">Worker</label>
        <select
          className="input"
          value={workerId}
          onChange={(e) => setWorkerId(e.target.value)}
          required
        >
          <option value="">Select worker</option>
          {workers.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name} ({w.email})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Date</label>
        <input
          type="date"
          className="input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-400">Start time</label>
          <input
            type="time"
            className="input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-400">End time</label>
          <input
            type="time"
            className="input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Role (optional)</label>
        <input
          type="text"
          className="input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Field Staff"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Location (optional)</label>
        <input
          type="text"
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Department (optional)</label>
        <input
          type="text"
          className="input"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>
      {message && (
        <p className={message.type === "ok" ? "text-emerald-400" : "text-red-400"}>
          {message.text}
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Assigning…" : "Assign shift"}
      </button>
    </form>
  );
}
