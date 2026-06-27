# Shadj Graphics — شَـدِج

وكالة تصميم جرافيك عربية — موقع كامل مع لوحة إدارة للادمن، نظام طلبات، AI tools، ومراسلات.

## Run & Operate

- Frontend dev server: `cd artifacts/shadj && pnpm dev` (port 5000, Vite HMR)
- Backend API: `cd artifacts/api-server && PORT=8080 pnpm dev` (port 8080, Express)
- **بعد أي تعديل على كود الـ frontend، لازم تعيد البناء:** `cd artifacts/shadj && pnpm build`
  - السبب: الـ backend يخدم الـ frontend من `artifacts/shadj/dist/public` — بدون rebuild المستخدم يرى الكود القديم
- Admin login: `admin@shadj-graphics.space` / `123456`
- Required env: `MONGODB_URI`, `MOONSHOT_API_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind CSS + shadcn/ui
- Backend: Express 5 + MongoDB + Mongoose
- Auth: in-memory sessions Map (no JWT library), token in localStorage as `shadj_token`
- AI: Moonshot API at `https://api.moonshot.ai/v1`, model `moonshot-v1-32k`
- Email: SMTP2Go HTTP API
- API client: Orval-generated hooks in `@workspace/api-client-react`

## Where things live

- Frontend pages: `artifacts/shadj/src/pages/`
- Admin pages: `artifacts/shadj/src/pages/admin/`
- Admin layout (sidebar): `artifacts/shadj/src/components/admin/AdminLayout.tsx`
- Backend routes: `artifacts/api-server/src/routes/`
- MongoDB models: inside route files (no separate models folder)
- Built frontend: `artifacts/shadj/dist/public/` (served by backend)

## Architecture decisions

- Backend serves frontend static files from `dist/public` for production — same server, no separate static host
- Sessions are in-memory Map (not Redis/DB) — lost on server restart
- No Drizzle/PostgreSQL — fully migrated to Mongoose/MongoDB
- `AdminSidebar` is a standalone component outside `AdminLayout` — must not be defined inside render (causes React to remount it every render and lose items)

## Product

- Public site: home, portfolio, about, order form, login/register
- Client dashboard: track own orders
- Admin panel (8 pages): dashboard, portfolio mgmt, orders mgmt + manual order creation, messages, AI tools, design resources, user mgmt, analytics
- AI features: design brief generator, color suggester, social captions, pricing calculator

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **CRITICAL: After editing any frontend file → run `cd artifacts/shadj && pnpm build` then hard-refresh browser (Ctrl+Shift+R)**
- Admin sidebar items missing? → Almost certainly a stale dist build. Rebuild.
- `AdminSidebar` must be defined OUTSIDE `AdminLayout` function — defining it inside causes React to treat it as a new component type each render
- `useUnreadCount` hook must be called before any conditional returns in `AdminLayout`
- Sessions are in-memory — admin must re-login after backend restart
- WhatsApp contact: wa.me/201129085243 (no floating button, no mailto links)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
