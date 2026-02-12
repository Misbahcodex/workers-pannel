# Worker Dashboard

Operations-focused internal dashboard for workers and staff: view shifts, request leave, request shift changes, submit reports, view tasks and announcements. Admin/Supervisor can approve requests, assign shifts and tasks, and publish announcements.

## Stack

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**
- **Prisma** (PostgreSQL or SQLite via `DATABASE_URL`)
- **NextAuth** (credentials, JWT) with roles: **WORKER** and **ADMIN**

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env`
   - Set `DATABASE_URL`: PostgreSQL URL (e.g. Neon) or `file:./dev.db` for SQLite
   - Set `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 32`)
   - **Deploy on Vercel:** see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for env vars and steps.

3. **Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Who can log in

- **Admin:** Created **only** by running the database seed (e.g. `admin@company.com` / `admin123`). There is no admin signup in the app — no one can create an admin account through the site.
- **Workers:** Added by the admin from the dashboard (Admin → Workers → Add worker). Workers log in with the email and password the admin set for them.

Workers are redirected to `/worker`, admins to `/admin`.

## Constraints (non-negotiable)

- No changes to existing authentication or user roles
- No auto-approval of worker requests
- No mixing of admin and worker dashboards; separate routes and role checks
- Worker data isolated per user; admin sees only what’s needed for approvals and assignment

## MVP features

- **Worker:** Home (today’s shift, status, pending requests, tasks, announcements), Shifts (view + request change/swap/extra), Leave (request + list), Reports (submit daily/end-of-shift/incident/weekly), Announcements (read, acknowledge important), Tasks (view, update status), Profile (personal info, emergency contact).
- **Admin:** Dashboard (counts, recent reports), Workers (list, suspend), Leave (approve/reject with reason), Shifts (assign shift, approve/reject shift change requests), Reports (view all), Tasks (assign, view all), Announcements (create, mark important).

## Data models (additive only)

- User (auth), WorkerProfile, Shift, ShiftChangeRequest, LeaveRequest, Task, Report, AttendanceLog, Announcement, AnnouncementRead, Notification. All have `createdAt`, `updatedAt`, `createdBy` where applicable.

## Notifications

In-app notifications are created for: leave approval/rejection, shift change decision, new task assignment. Stored in `Notification`; can be extended to real-time or email later.

## Phase 2+

- Task system (done in MVP), attendance automation, shift swaps, performance analytics, etc.
