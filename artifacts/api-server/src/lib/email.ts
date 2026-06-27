import { logger } from "./logger";

const SMTP2GO_API_KEY = process.env["SMTP2GO_API_KEY"];
const FROM_EMAIL = "noreply@shadj-graphics.space";
const FROM_NAME = "شَـدِج للتصميم";
const SITE = "https://shadj-graphics.space";
const LOGO = `${SITE}/logo-white.png`;
const POSTERS = [
  `${SITE}/posters/poster_03.png`,
  `${SITE}/posters/poster_10.png`,
  `${SITE}/posters/poster_18.png`,
  `${SITE}/posters/poster_28.png`,
];

async function smtp2goSend(opts: { to: string; subject: string; html: string }) {
  if (!SMTP2GO_API_KEY) throw new Error("SMTP2GO_API_KEY not set");
  const body = {
    api_key: SMTP2GO_API_KEY,
    to: [opts.to],
    sender: `${FROM_NAME} <${FROM_EMAIL}>`,
    subject: opts.subject,
    html_body: opts.html,
  };
  const res = await fetch("https://api.smtp2go.com/v3/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json() as any;
  if (!res.ok || data?.data?.succeeded === 0) {
    throw new Error(JSON.stringify(data));
  }
  return data;
}

function posterStrip(): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;padding:0;">
    <tr>
      ${POSTERS.map(p => `
      <td width="25%" style="padding:2px;">
        <a href="${SITE}/portfolio" style="display:block;">
          <img src="${p}" width="150" height="100" alt="تصميم شَدِج"
            style="width:100%;height:100px;object-fit:cover;display:block;border:0;" />
        </a>
      </td>`).join("")}
    </tr>
  </table>`;
}

function emailShell(bodyContent: string): string {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="dark">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#141414;border-radius:20px;overflow:hidden;border:1px solid #2a2a2a;box-shadow:0 20px 60px rgba(0,0,0,0.6);">

          <!-- HEADER: gradient + logo -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1433 0%,#2d1b69 50%,#1e1b4b 100%);padding:36px 40px;text-align:center;position:relative;">
              <div style="position:absolute;top:0;left:0;right:0;bottom:0;opacity:0.07;background-image:radial-gradient(circle,#fff 1px,transparent 1px);background-size:28px 28px;"></div>
              <a href="${SITE}" style="display:inline-block;">
                <img src="${LOGO}" alt="شَدِج — Shadj Graphics" width="120" height="60"
                  style="height:60px;width:auto;object-fit:contain;display:block;margin:0 auto;" />
              </a>
              <p style="margin:12px 0 0;color:#c4b5fd;font-size:12px;letter-spacing:3px;text-transform:uppercase;">Shadj Graphics • إبداع بلا حدود</p>
            </td>
          </tr>

          <!-- POSTER STRIP -->
          <tr>
            <td style="padding:0;line-height:0;">
              ${posterStrip()}
            </td>
          </tr>

          <!-- GOLD DIVIDER -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#7c3aed,#e2b979,#7c3aed);"></td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#0d0d0d;padding:24px 40px;border-top:1px solid #1f1f1f;text-align:center;">
              <a href="${SITE}" style="display:inline-block;margin-bottom:14px;">
                <img src="${LOGO}" alt="شَدِج" width="70" height="35"
                  style="height:35px;width:auto;opacity:0.6;display:block;margin:0 auto 10px;" />
              </a>
              <p style="color:#444;font-size:12px;margin:0 0 6px;">
                <a href="${SITE}" style="color:#7c3aed;text-decoration:none;">shadj-graphics.space</a>
                &nbsp;•&nbsp;
                <a href="mailto:gfx@shadj-graphics.space" style="color:#7c3aed;text-decoration:none;">gfx@shadj-graphics.space</a>
              </p>
              <p style="color:#333;font-size:11px;margin:0;">© 2025 شَدِج للتصميم — جميع الحقوق محفوظة</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOTPEmail(to: string, name: string, otp: string) {
  const html = emailShell(`
    <h2 style="color:#e2b979;font-size:24px;margin:0 0 12px;font-weight:900;">أهلاً ${name}! 👋</h2>
    <p style="color:#bbb;font-size:15px;line-height:1.8;margin:0 0 28px;">
      مرحباً بك في عائلة شَدِج للتصميم.<br>
      استخدم رمز التحقق التالي لإتمام تسجيل حسابك:
    </p>
    <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 28px;">
      <tr>
        <td style="background:#0d0d0d;border:2px solid #7c3aed;border-radius:16px;padding:32px;text-align:center;">
          <p style="color:#888;font-size:13px;margin:0 0 14px;letter-spacing:2px;text-transform:uppercase;">رمز التحقق الخاص بك</p>
          <div style="font-size:44px;font-weight:900;color:#e2b979;font-family:monospace;letter-spacing:12px;">${otp}</div>
          <p style="color:#555;font-size:12px;margin:14px 0 0;">⏱ صالح لمدة 10 دقائق فقط</p>
        </td>
      </tr>
    </table>
    <p style="color:#666;font-size:13px;line-height:1.7;margin:0;border-right:3px solid #2a2a2a;padding-right:14px;">
      إذا لم تطلب هذا الرمز، يمكنك تجاهل هذا البريد بأمان. لن يحدث شيء.
    </p>
  `);

  try {
    await smtp2goSend({ to, subject: `${otp} — رمز التحقق لحساب شَدِج`, html });
    logger.info({ to }, "OTP email sent");
  } catch (err) {
    logger.error({ err, to }, "Failed to send OTP email");
    throw err;
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = emailShell(`
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;background:linear-gradient(135deg,#7c3aed20,#e2b97920);border:1px solid #7c3aed40;border-radius:50%;width:72px;height:72px;line-height:72px;font-size:36px;margin-bottom:16px;">🎉</div>
      <h2 style="color:#e2b979;font-size:26px;margin:0 0 8px;font-weight:900;">مرحباً بك يا ${name}!</h2>
      <p style="color:#888;font-size:14px;margin:0;">تم تفعيل حسابك بنجاح في شَدِج للتصميم ✅</p>
    </div>

    <div style="background:#0d0d0d;border-right:4px solid #e2b979;padding:20px 24px;border-radius:0 12px 12px 0;margin:0 0 28px;">
      <p style="color:#e2b979;font-size:15px;font-weight:700;margin:0 0 12px;">ماذا يمكنك فعله الآن؟</p>
      <table cellpadding="0" cellspacing="0" width="100%">
        ${[
          ["🎨", "إرسال طلب تصميم جديد"],
          ["📦", "تتبع حالة طلباتك أون لاين"],
          ["💬", "التواصل مع شدجتي، مساعدنا الذكي"],
        ].map(([icon, text]) => `
        <tr>
          <td width="32" style="padding:6px 0;color:#7c3aed;font-size:18px;">${icon}</td>
          <td style="padding:6px 0;color:#ccc;font-size:14px;">${text}</td>
        </tr>`).join("")}
      </table>
    </div>

    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background:linear-gradient(135deg,#7c3aed,#e2b979);border-radius:50px;padding:0;">
          <a href="${SITE}/dashboard" style="display:block;padding:14px 40px;color:#fff;font-weight:900;font-size:15px;text-decoration:none;">ابدأ الآن ←</a>
        </td>
      </tr>
    </table>
  `);

  try {
    await smtp2goSend({ to, subject: "🎉 مرحباً بك في شَدِج للتصميم!", html });
    logger.info({ to }, "Welcome email sent");
  } catch (err) {
    logger.error({ err, to }, "Failed to send welcome email");
  }
}

export async function sendMarketingEmail(opts: {
  to: string[];
  subject: string;
  bodyHtml: string;
  previewText?: string;
}) {
  const { to, subject, bodyHtml, previewText = "" } = opts;
  const html = `<span style="display:none;max-height:0;overflow:hidden;">${previewText}</span>` + emailShell(bodyHtml);

  const errors: string[] = [];
  for (const recipient of to) {
    try {
      await smtp2goSend({ to: recipient, subject, html });
    } catch (err) {
      logger.error({ err, recipient }, "Failed to send marketing email");
      errors.push(recipient);
    }
  }
  return { sent: to.length - errors.length, failed: errors };
}
