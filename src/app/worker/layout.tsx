import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { WorkerNav } from "@/components/WorkerNav";

export default async function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "WORKER") redirect("/login");

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-10 border-b border-surface-border bg-surface-card/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/worker" className="font-semibold text-white">
            Worker Dashboard
          </Link>
          <WorkerNav />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6 pb-24">{children}</main>
      <nav
        className="fixed bottom-0 left-0 right-0 border-t border-surface-border bg-surface-card md:static md:border-0 md:bg-transparent"
        aria-label="Worker menu"
      >
        <div className="mx-auto flex max-w-4xl justify-around gap-2 px-2 py-2 md:flex md:justify-end md:gap-2 md:py-0">
          <Link
            href="/worker"
            className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-surface-border hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/worker/shifts"
            className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-surface-border hover:text-white"
          >
            Shifts
          </Link>
          <Link
            href="/worker/leave"
            className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-surface-border hover:text-white"
          >
            Leave
          </Link>
          <Link
            href="/worker/reports"
            className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-surface-border hover:text-white"
          >
            Reports
          </Link>
          <Link
            href="/worker/announcements"
            className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-surface-border hover:text-white"
          >
            Announcements
          </Link>
          <Link
            href="/worker/tasks"
            className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-surface-border hover:text-white"
          >
            Tasks
          </Link>
          <Link
            href="/worker/profile"
            className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-surface-border hover:text-white"
          >
            Profile
          </Link>
        </div>
      </nav>
    </div>
  );
}
