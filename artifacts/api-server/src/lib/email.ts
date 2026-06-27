import { logger } from "./logger";

const SMTP2GO_API_KEY = process.env["SMTP2GO_API_KEY"];
const FROM_EMAIL = "noreply@shadj-graphics.space";
const FROM_NAME = "شَـدِج للتصميم";

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

export async function sendOTPEmail(to: string, name: string, otp: string) {
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>رمز التحقق - شَدِج</title>
</head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid #333;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#e2b979,#c9973a);padding:40px;text-align:center;">
              <h1 style="margin:0;color:#0d0d0d;font-size:32px;font-weight:900;letter-spacing:2px;">شَـدِج</h1>
              <p style="margin:8px 0 0;color:#0d0d0d;font-size:14px;opacity:0.8;">Shadj Graphics • إبداع بلا حدود</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#e2b979;font-size:22px;margin:0 0 16px;">أهلاً ${name}! 👋</h2>
              <p style="color:#ccc;font-size:16px;line-height:1.7;margin:0 0 30px;">
                مرحباً بك في عائلة شَدِج للتصميم.<br>
                استخدم رمز التحقق التالي لإتمام تسجيل حسابك:
              </p>
              <!-- OTP Box -->
              <div style="background:#0d0d0d;border:2px solid #e2b979;border-radius:12px;padding:30px;text-align:center;margin:0 0 30px;">
                <p style="color:#888;font-size:14px;margin:0 0 12px;">رمز التحقق الخاص بك</p>
                <div style="letter-spacing:16px;font-size:40px;font-weight:900;color:#e2b979;font-family:monospace;">${otp}</div>
                <p style="color:#666;font-size:13px;margin:12px 0 0;">صالح لمدة 10 دقائق</p>
              </div>
              <p style="color:#888;font-size:14px;line-height:1.6;margin:0;">
                إذا لم تطلب هذا الرمز، يمكنك تجاهل هذا البريد بأمان.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#111;padding:24px 40px;border-top:1px solid #333;text-align:center;">
              <p style="color:#555;font-size:13px;margin:0;">
                © 2025 شَدِج للتصميم • gfx@shadj-graphics.space
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await smtp2goSend({ to, subject: `${otp} — رمز التحقق لحساب شَدِج`, html });
    logger.info({ to }, "OTP email sent");
  } catch (err) {
    logger.error({ err, to }, "Failed to send OTP email");
    throw err;
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مرحباً بك - شَدِج</title>
</head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid #333;">
          <tr>
            <td style="background:linear-gradient(135deg,#e2b979,#c9973a);padding:40px;text-align:center;">
              <h1 style="margin:0;color:#0d0d0d;font-size:32px;font-weight:900;letter-spacing:2px;">شَـدِج</h1>
              <p style="margin:8px 0 0;color:#0d0d0d;font-size:14px;opacity:0.8;">Shadj Graphics • إبداع بلا حدود</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#e2b979;font-size:24px;margin:0 0 16px;">🎉 مرحباً بك يا ${name}!</h2>
              <p style="color:#ccc;font-size:16px;line-height:1.8;margin:0 0 24px;">
                تم تفعيل حسابك بنجاح في شَدِج للتصميم.<br>
                الآن يمكنك تتبع طلباتك وإدارة مشاريعك بكل سهولة.
              </p>
              <div style="background:#0d0d0d;border-right:4px solid #e2b979;padding:20px 24px;border-radius:0 8px 8px 0;margin:0 0 30px;">
                <p style="color:#e2b979;font-size:15px;font-weight:700;margin:0 0 8px;">ماذا يمكنك فعله الآن؟</p>
                <ul style="color:#bbb;font-size:14px;line-height:2;margin:0;padding-right:20px;">
                  <li>إرسال طلب تصميم جديد</li>
                  <li>تتبع حالة طلباتك</li>
                  <li>التواصل المباشر مع فريقنا</li>
                </ul>
              </div>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:#e2b979;border-radius:8px;padding:0;">
                    <a href="https://shadj-graphics.space" style="display:block;padding:14px 32px;color:#0d0d0d;font-weight:800;font-size:15px;text-decoration:none;">ابدأ الآن ←</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#111;padding:24px 40px;border-top:1px solid #333;text-align:center;">
              <p style="color:#555;font-size:13px;margin:0;">© 2025 شَدِج للتصميم • gfx@shadj-graphics.space</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await smtp2goSend({ to, subject: "مرحباً بك في شَدِج للتصميم 🎨", html });
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

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">${previewText}</span>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid #333;">
          <tr>
            <td style="background:linear-gradient(135deg,#e2b979,#c9973a);padding:40px;text-align:center;">
              <h1 style="margin:0;color:#0d0d0d;font-size:32px;font-weight:900;letter-spacing:2px;">شَـدِج</h1>
              <p style="margin:8px 0 0;color:#0d0d0d;font-size:14px;opacity:0.8;">Shadj Graphics • إبداع بلا حدود</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background:#111;padding:24px 40px;border-top:1px solid #333;text-align:center;">
              <p style="color:#555;font-size:13px;margin:0 0 8px;">
                <a href="https://shadj-graphics.space" style="color:#e2b979;text-decoration:none;">shadj-graphics.space</a>
              </p>
              <p style="color:#444;font-size:12px;margin:0;">© 2025 شَدِج للتصميم. جميع الحقوق محفوظة.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

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
