"use client";

import { useState } from "react";

export function AddWorkerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (password.length < 6) {
      setMessage({ type: "err", text: "Password must be at least 6 characters." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error ?? "Failed to add worker." });
        return;
      }
      setMessage({ type: "ok", text: "Worker added. They can log in with this email and password." });
      setName("");
      setEmail("");
      setPassword("");
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
          placeholder="Worker name"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Email</label>
        <input
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="worker@company.com"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Password</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters (give this to the worker)"
          required
          minLength={6}
        />
      </div>
      {message && (
        <p className={message.type === "ok" ? "text-emerald-400" : "text-red-400"}>
          {message.text}
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Adding…" : "Add worker"}
      </button>
    </form>
  );
}
