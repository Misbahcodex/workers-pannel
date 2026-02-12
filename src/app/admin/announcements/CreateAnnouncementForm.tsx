"use client";

import { useState } from "react";

export function CreateAnnouncementForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [important, setImportant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !body) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, important }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: data.error ?? "Failed" });
        return;
      }
      setMessage({ type: "ok", text: "Announcement published." });
      setTitle("");
      setBody("");
      setImportant(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm text-gray-400">Title</label>
        <input
          type="text"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-400">Body</label>
        <textarea
          className="input min-h-[120px]"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={important}
          onChange={(e) => setImportant(e.target.checked)}
          className="rounded border-surface-border bg-surface-card"
        />
        <span className="text-sm text-gray-400">Mark as important</span>
      </label>
      {message && (
        <p className={message.type === "ok" ? "text-emerald-400" : "text-red-400"}>
          {message.text}
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Publishing…" : "Publish"}
      </button>
    </form>
  );
}
