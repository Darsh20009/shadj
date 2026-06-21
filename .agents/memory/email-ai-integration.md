---
name: Email and AI Integration
description: SMTP2Go HTTP API for email (not SMTP), Moonshot AI chat via .ai domain, OTP registration flow
---

# Email & AI Integration

## SMTP2Go
- Use HTTP API `https://api.smtp2go.com/v3/email/send` — NOT nodemailer/SMTP transport
- Auth: `api_key` field in POST body (the SMTP2GO_API_KEY secret)
- Sender: `gfx@shadj-graphics.space` (FROM_EMAIL)
- `nodemailer` package still installed but not used in email.ts

**Why:** SMTP2Go's SMTP credentials are different from the API key. Using HTTP API avoids credential confusion.

## Moonshot AI
- Base URL: `https://api.moonshot.ai/v1` (NOT .cn)
- Model: `moonshot-v1-32k` (high power)
- Uses OpenAI SDK with custom baseURL
- Secret: `MOONSHOT_API_KEY`

## OTP Registration Flow
- Step 1: POST `/api/auth/register/send-otp` → generates 6-digit OTP, stores in memory Map, sends email
- Step 2: POST `/api/auth/register/verify-otp` → validates OTP, creates user, sends welcome email
- OTP expires in 10 minutes
- Legacy `/api/auth/register` returns 400 with `requiresOTP: true`

## Files
- `artifacts/api-server/src/lib/email.ts` — smtp2goSend(), sendOTPEmail(), sendWelcomeEmail(), sendMarketingEmail()
- `artifacts/api-server/src/lib/ai.ts` — chatWithAI(), generateDesignBrief()
- `artifacts/api-server/src/routes/ai.ts` — POST /api/ai/chat, POST /api/ai/brief
- `artifacts/api-server/src/routes/email.ts` — POST /api/email/marketing, POST /api/email/test (admin only)
- `artifacts/shadj/src/components/AIChatbot.tsx` — floating chatbot FAB on all pages
- `artifacts/shadj/src/pages/login.tsx` — OTP step UI (6-box input with countdown timer)
