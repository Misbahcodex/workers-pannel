import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { AnnouncementCard } from "./AnnouncementCard";

export default async function WorkerAnnouncementsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WORKER") return null;
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reads: { where: { userId: session.user.id } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Announcements</h1>
      {announcements.length === 0 ? (
        <div className="card">
          <p className="text-gray-400">No announcements yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {announcements.map((a) => (
            <li key={a.id}>
              <AnnouncementCard
                id={a.id}
                title={a.title}
                body={a.body}
                important={a.important}
                createdAt={a.createdAt}
                read={a.reads.length > 0}
                acknowledged={a.reads[0]?.acknowledged ?? false}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
