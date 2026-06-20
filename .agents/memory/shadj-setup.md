---
name: Shadj project setup
description: Key facts about the shadj-graphics.space agency website project
---

# Shadj (شدج) — Graphic Design Agency

**Domain:** shadj-graphics.space  
**Admin login:** shadj123456544321@outlook.com / admin123  
**Admin path:** /admin  

## Architecture
- Frontend: `artifacts/shadj/` (React+Vite, previewPath `/`)
- Backend: `artifacts/api-server/` (Express+Node, previewPath `/api`)
- DB: PostgreSQL via Drizzle ORM (tables: portfolio_works, orders, users, visitor_logs)

## Real poster images
- 46 PNG files extracted from nested zip to `artifacts/shadj/public/posters/poster_01.png` → `poster_46.png`
- Served directly from Vite's `public/` folder (no import needed, just `/posters/poster_XX.png`)
- DB seeded with all 46 works pointing to these real image paths

## Logos
- `/logo-white.png` — white logo on blue bg (for dark nav/dark sections)
- `/logo-dark.png` — blue logo on white bg (for scrolled/light nav)
- Imported as `<img src="/logo-white.png">` (not via @assets alias)

## Language
- Arabic-first RTL, Egyptian dialect ("دلوقتي", "احنا", "بنعمل", "شوف شغلنا")
- Both Egyptian and Saudi Arabic audiences

## Design system
- Colors: deep royal blue #3730A3, warm beige #F5E6C8, dark navy #0f0e1a / #1a1a2e
- Font: Cairo (Arabic) from Google Fonts
- Splash screen uses sessionStorage key `shadj_splash_seen` to show only once

**Why:** The site uses /public/ folder for images (not @assets alias) because poster files were extracted at build time and need to be served as static assets, not bundled.
