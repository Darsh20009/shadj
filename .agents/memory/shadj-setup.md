---
name: Shadj project setup
description: Full-stack Arabic graphic design agency site — key facts, credentials, auth setup
---

## Stack
- Frontend: React + Vite + Tailwind (artifacts/shadj)
- Backend: Express + Drizzle + PostgreSQL (artifacts/api-server)
- Shared lib: @workspace/api-client-react (lib/api-client-react), @workspace/db (lib/db)

## Auth
- Token-based (localStorage key: `shadj_token`)
- `setAuthTokenGetter(() => localStorage.getItem("shadj_token"))` called in App.tsx
- Roles: admin, designer, writer → redirect to /admin; client → redirect to /dashboard
- Password hash: SHA256(password + "shadj_salt_2024")
- Admin: admin@shadj-graphics.space / admin2024

## Database
- 46 posters seeded in portfolio_works (image_url: /posters/poster_01-46.png)
- Admin user seeded (id=1)
- Migrations: run `cd lib/db && pnpm drizzle-kit push`

## Key files
- SplashScreen: artifacts/shadj/src/components/SplashScreen.tsx (logo glow + rings animation)
- Login: unified login/register tabs at /login (admin→/admin, client→/dashboard)
- Dashboard: artifacts/shadj/src/pages/dashboard.tsx (client order tracking)
- Auth API: artifacts/api-server/src/routes/auth.ts (login + register + me)
- Arabic CSS fix: letter-spacing: 0 enforced in index.css

**Why:** Sessions are in-memory (Map) in API server — sessions reset on server restart, users must re-login after restart.
