# Patril Appliances

Next.js storefront for kitchen appliances and gym equipment — East & Central Africa.

## Database (Neon + Prisma)

See **[docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)** for full setup.

Quick start after adding `DATABASE_URL` to `.env.local`:

```bash
npm run db:push
npm run db:seed
npm run dev
```

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local` to match staging behaviour (simulated checkout).

## Deploy on Vercel

1. Push this repo to GitHub (see below if you have not yet).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Next.js** (auto-detected). Build command: `npm run build`.
4. Add environment variables from [`.env.example`](./.env.example):
   - `NEXT_PUBLIC_DEMO_MODE` → `true` for staging (until backend + payments are live)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`, social URLs — optional; defaults exist in code
5. Deploy. Every push to `main` triggers a new production deploy; other branches get preview URLs.

### Staging limitations

- **Cart** — stored in the browser (`localStorage`); normal for storefronts without accounts.
- **Orders** — `/api/orders` writes to a local file in dev. On Vercel the filesystem is ephemeral, so orders may not persist across deploys. Demo banners explain this when `NEXT_PUBLIC_DEMO_MODE=true`.
- **Products** — served from static data via `/api/products` until a database is added.

### First-time Git push

```bash
git add .
git commit -m "Prepare for Vercel deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USER/patrilappliances.git
git push -u origin main
```

## Project structure

| Path | Purpose |
|------|---------|
| `app/page.tsx` | Homepage |
| `app/data/products.ts` | Product catalog (temporary until DB) |
| `app/api/products` | Product API |
| `app/api/orders` | Order API (file-based; replace with DB for production) |
| `app/config/site.ts` | Site name, region, demo mode, contact |

## Next steps after staging

1. Postgres (Neon / Supabase) + product & order tables  
2. Replace file/static catalog with database  
3. Set `NEXT_PUBLIC_DEMO_MODE=false` and wire real M-Pesa / card payments  
