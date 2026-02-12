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

## 4. Database

- Ensure your database (e.g. Neon) allows connections from Vercel’s IPs (Neon does by default).
- Run migrations or schema push **before** or **after** first deploy:
  - Locally: `npx prisma db push`
  - Seed (once): `npm run db:seed` (run locally with `DATABASE_URL` pointing to the same DB).

## 5. After first deploy

1. Set `NEXTAUTH_URL` to the deployed URL (e.g. `https://workers-amin-pannel.vercel.app`).
2. Redeploy if you had used a placeholder.
3. Log in with your seeded user (e.g. `worker@company.com` / `worker123` or `admin@company.com` / `admin123`).

## Quick copy-paste (fill in values)

```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
NEXTAUTH_URL=https://YOUR_VERCEL_APP_URL.vercel.app
NEXTAUTH_SECRET=your-generated-secret-at-least-32-chars
```
