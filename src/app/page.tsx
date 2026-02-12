import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(session.user?.role === "ADMIN" ? "/admin" : "/worker");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-surface-border bg-surface-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <span className="text-lg font-semibold text-white">Worker Dashboard</span>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="btn-primary rounded-lg px-4 py-2 text-sm"
            >
              Log in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Operations dashboard for your team
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            View shifts, request leave, submit reports, and stay updated — all in one place.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/login" className="btn-primary inline-flex px-6 py-3 text-base">
              Log in
            </Link>
          </div>
        </div>

        <ul className="mt-16 grid max-w-3xl gap-6 text-left sm:grid-cols-2">
          <li className="card">
            <h2 className="font-medium text-white">Shifts & schedule</h2>
            <p className="mt-1 text-sm text-gray-400">
              View your schedule and request shift changes or extra shifts.
            </p>
          </li>
          <li className="card">
            <h2 className="font-medium text-white">Leave & reports</h2>
            <p className="mt-1 text-sm text-gray-400">
              Request leave and submit daily or weekly reports.
            </p>
          </li>
          <li className="card">
            <h2 className="font-medium text-white">Tasks & announcements</h2>
            <p className="mt-1 text-sm text-gray-400">
              Get assigned tasks and read important announcements.
            </p>
          </li>
          <li className="card">
            <h2 className="font-medium text-white">Admin adds workers</h2>
            <p className="mt-1 text-sm text-gray-400">
              The admin is set up once during deployment. Workers are added by the admin and then log in.
            </p>
          </li>
        </ul>
      </main>

      <footer className="border-t border-surface-border py-6">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-gray-500">
          Worker Dashboard — Internal use only
        </div>
      </footer>
    </div>
  );
}
