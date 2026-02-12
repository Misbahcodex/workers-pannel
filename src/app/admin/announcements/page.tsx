import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { CreateAnnouncementForm } from "./CreateAnnouncementForm";

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-white">Announcements</h1>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">Create announcement</h2>
        <CreateAnnouncementForm />
      </section>

      <section className="card">
        <h2 className="mb-3 font-medium text-white">All announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-gray-400">No announcements yet.</p>
        ) : (
          <ul className="space-y-3">
            {announcements.map((a) => (
              <li
                key={a.id}
                className={`rounded-lg border p-3 ${a.important ? "border-amber-500/40 bg-amber-500/5" : "border-surface-border"}`}
              >
                <p className="font-medium text-white">
                  {a.important && "📌 "}
                  {a.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {format(a.createdAt, "MMM d, yyyy")}
                </p>
                <p className="mt-2 text-gray-300 whitespace-pre-wrap">{a.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
