"use client";

import { useState } from "react";

type Props = {
  name: string;
  email: string;
  department: string;
  emergencyContact: string;
  phone: string;
};

export function ProfileForm({
  name: initialName,
  email,
  department: initialDept,
  emergencyContact: initialEmergency,
  phone: initialPhone,
}: Props) {
  const [name, setName] = useState(initialName);
  const [department, setDepartment] = useState(initialDept);
  const [emergencyContact, setEmergencyContact] = useState(initialEmergency);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/worker/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          department: department || null,
          emergencyContact: emergencyContact || null,
          phone: phone || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error ?? "Update failed" });
        return;
      }
      setMessage({ type: "ok", text: "Profile updated." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm text-gray-400">Name</label>
        <input
          type="text"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Email</label>
        <input type="email" className="input bg-surface/80" value={email} readOnly disabled />
        <p className="mt-1 text-xs text-gray-500">Contact admin to change email.</p>
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Department</label>
        <input
          type="text"
          className="input"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="e.g. Operations"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Phone</label>
        <input
          type="tel"
          className="input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Emergency contact</label>
        <input
          type="text"
          className="input"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
          placeholder="Name and phone"
        />
      </div>
      {message && (
        <p className={message.type === "ok" ? "text-emerald-400" : "text-red-400"}>
          {message.text}
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
