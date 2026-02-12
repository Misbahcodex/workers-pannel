# Deploy to Vercel

## 1. Push your code

Connect your repo to Vercel (GitHub/GitLab/Bitbucket) or use the Vercel CLI.

## 2. Environment variables

In **Vercel** → your project → **Settings** → **Environment Variables**, add:

| Variable | Value | Required |
|----------|--------|----------|
| `DATABASE_URL` | Your PostgreSQL connection string (e.g. Neon). Must start with `postgresql://` or `postgres://`. | **Yes** |
| `NEXTAUTH_URL` | Your app URL. For Vercel: `https://your-project.vercel.app` (replace with your real domain). Use the value Vercel gives you after first deploy. | **Yes** |
| `NEXTAUTH_SECRET` | A random secret for signing JWTs. Generate with: `openssl rand -base64 32` (or use a long random string). | **Yes** |

- Apply to **Production**, **Preview**, and **Development** if you use preview deployments.
- **Do not** commit `.env` or secrets to the repo.

## 3. Build settings (defaults)

- **Build Command:** `npm run build` (runs `prisma generate && next build`)
- **Output Directory:** (leave default for Next.js)
- **Install Command:** `npm install`

No need to change these unless you use a different package manager.

## 4. Database and admin account

- Ensure your database (e.g. Neon) allows connections from Vercel’s IPs (Neon does by default).
- Run **once** after deploy:
  - `npx prisma db push`
  - `npm run db:seed` (run locally with `DATABASE_URL` pointing to your production DB).

The seed creates the **only admin account** (e.g. `admin@company.com` / `admin123`). **No one can sign up as admin** through the app — the admin signup page is disabled. Change the default admin password after first login. Workers are added by the admin from the dashboard.

## 5. After first deploy

1. Set `NEXTAUTH_URL` to the deployed URL (e.g. `https://workers-amin-pannel.vercel.app`).
2. Redeploy if you had used a placeholder.
3. Log in as admin with the seeded credentials, then change the password. Add workers from the admin dashboard.

## Quick copy-paste (fill in values)

```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
NEXTAUTH_URL=https://YOUR_VERCEL_APP_URL.vercel.app
NEXTAUTH_SECRET=your-generated-secret-at-least-32-chars
```
