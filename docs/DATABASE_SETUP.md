# Database setup (Neon + Prisma)

Day 1 wires the **product catalog** to PostgreSQL. Orders and payments are not in the database yet.

## 1. Create Neon database

1. Go to [neon.tech](https://neon.tech) and sign up / log in.
2. **New Project** → name it `patrilappliances`.
3. Copy the **connection string** (starts with `postgresql://`).

## 2. Local environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and paste your Neon URL:

```
DATABASE_URL=postgresql://...
```

## 3. Create tables and seed data

```bash
npm run db:push
npm run db:seed
```

- `db:push` — creates tables from `prisma/schema.prisma`
- `db:seed` — loads brands, categories, 20 products, featured homepage layout

Browse data:

```bash
npm run db:studio
```

## 4. Verify locally

```bash
npm run dev
```

Open `/api/products` — you should see JSON from the database (same 20 products).

## 5. Vercel production

In **Vercel → Project → Settings → Environment Variables**:

| Name | Value |
|------|--------|
| `DATABASE_URL` | Your Neon **production** connection string |
| `NEXT_PUBLIC_DEMO_MODE` | `true` (until checkout is production-ready) |

After adding `DATABASE_URL`, redeploy. Then run **once** from your machine against the production DB:

```bash
DATABASE_URL="your-neon-url" npm run db:push
DATABASE_URL="your-neon-url" npm run db:seed
```

Or use Neon's SQL editor — tables must exist before the live site reads from DB.

## Schema overview

| Table | Purpose |
|-------|---------|
| `brands` | Sub-Zero, Bosch, Life Fitness, … |
| `categories` | Gym, Cooking, Refrigeration, … |
| `subcategories` | cardio, ovens-ranges, … |
| `products` | Full catalog with prices, photos, highlights |
| `featured_home_slots` | Homepage 4-column layout |

## Fallback

If `DATABASE_URL` is missing or the DB is empty, the app falls back to static `products.ts` so the site never goes blank during setup.

