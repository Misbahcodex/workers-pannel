"use client";

import { format } from "date-fns";
import { useState } from "react";

type Props = {
  id: string;
  title: string;
  body: string;
  important: boolean;
  createdAt: Date;
  read: boolean;
  acknowledged: boolean;
};

export function AnnouncementCard({
  id,
  title,
  body,
  important,
  createdAt,
  read,
  acknowledged,
}: Props) {
  const [ack, setAck] = useState(acknowledged);
  const [loading, setLoading] = useState(false);

  async function handleAcknowledge() {
    if (ack) return;
    setLoading(true);
    try {
      await fetch(`/api/announcements/${id}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acknowledged: true }),
      });
      setAck(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article
      className={`card ${important ? "border-amber-500/40 bg-amber-500/5" : ""}`}
      id={id}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-medium text-white">
            {important && "📌 "}
            {title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {format(new Date(createdAt), "MMM d, yyyy")}
          </p>
        </div>
        {!read && (
          <span className="badge border border-amber-500/40 bg-amber-500/20 text-amber-400">
            New
          </span>
        )}
      </div>
      <p className="mt-2 text-gray-300 whitespace-pre-wrap">{body}</p>
      {important && !ack && (
        <button
          type="button"
          onClick={handleAcknowledge}
          disabled={loading}
          className="mt-3 btn-secondary text-sm"
        >
          {loading ? "…" : "Acknowledge"}
        </button>
      )}
    </article>
  );
}
