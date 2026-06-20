---
name: MongoDB Migration
description: Backend migrated from Drizzle+PostgreSQL to Mongoose+MongoDB; login uses phone number; seed logic and auth details.
---

# MongoDB Migration

**Why:** User provided MongoDB Atlas URI and said it's the system's primary database.

**How to apply:** MONGODB_URI secret must be set in Replit Secrets. API server connects on startup via `connectMongoDB()` in `src/lib/mongodb.ts`.

## Key files
- `artifacts/api-server/src/lib/mongodb.ts` — connection, all Mongoose models (User, PortfolioWork, Order, VisitorLog), serializers, `seedIfEmpty()`
- All route files in `artifacts/api-server/src/routes/` now use Mongoose models, no Drizzle imports

## Admin credentials (MongoDB)
- Phone: +201129085243 | Password: 123456 | Role: admin | Name: شهد
- `seedIfEmpty()` always upserts admin on startup — safe to restart anytime

## Login behavior
- Login accepts phone OR email in the `email` or `phone` field
- Phone normalization: strips spaces, converts `00xx` → `+xx`
- Session stored in-memory Map (lost on restart — by design for simplicity)

## Seed behavior
- Admin user: always upserted on startup (idempotent)
- Portfolio works: only seeded if collection is empty (46 works)
