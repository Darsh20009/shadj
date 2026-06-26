import { logger } from "./logger";

const SMTP2GO_API_KEY = process.env["SMTP2GO_API_KEY"];
const FROM_EMAIL = "gfx@shadj-graphics.space";
const FROM_NAME = "شَـدِج للتصميم";
const ADMIN_EMAIL = "hsvshzvbxj@gmail.com";

async function smtp2goSend(opts: { to: string; subject: string; html: string }) {
  if (!SMTP2GO_API_KEY) {
    logger.warn("SMTP2GO_API_KEY not set — skipping notification email");
    return;
  }
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
  const data = (await res.json()) as any;
  if (!res.ok || data?.data?.succeeded === 0) {
    throw new Error(JSON.stringify(data));
  }
}

function wrap(content: string): string {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:30px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a;">
<tr><td style="background:linear-gradient(135deg,#e2b979,#c9973a);padding:28px 30px;text-align:center;">
  <h1 style="margin:0;color:#0d0d0d;font-size:24px;font-weight:900;letter-spacing:2px;">شَـدِج</h1>
  <p style="margin:6px 0 0;color:#0d0d0d;font-size:12px;opacity:0.75;">نظام الإشعارات الداخلي • Shadj Graphics</p>
</td></tr>
<tr><td style="padding:28px 30px;">${content}</td></tr>
<tr><td style="background:#111;padding:18px 30px;border-top:1px solid #2a2a2a;text-align:center;">
  <p style="color:#444;font-size:11px;margin:0;">© 2025 شَدِج للتصميم — إشعار تلقائي للنظام</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
}

function row(label: string, value: string, dir = "rtl"): string {
  return `<tr>
    <td style="padding:9px 0;border-bottom:1px solid #222;color:#777;font-size:13px;width:38%;vertical-align:top;">${label}</td>
    <td style="padding:9px 0;border-bottom:1px solid #222;color:#e5e5e5;font-size:14px;" dir="${dir}">${value}</td>
  </tr>`;
}

export async function notifyNewOrder(order: {
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  designType: string;
  description: string;
  budget?: string | null;
  deadline?: string | null;
}) {
  try {
    const html = wrap(`
      <h2 style="color:#e2b979;font-size:19px;margin:0 0 18px;font-weight:900;">🎨 طلب تصميم جديد!</h2>
      <table width="100%" style="border-collapse:collapse;">
        ${row("العميل", `<strong>${order.clientName}</strong>`)}
        ${row("البريد الإلكتروني", order.clientEmail, "ltr")}
        ${order.clientPhone ? row("رقم التواصل", order.clientPhone, "ltr") : ""}
        ${row("نوع التصميم", `<span style="color:#e2b979;font-weight:bold;">${order.designType}</span>`)}
        ${row("الميزانية", order.budget || "لم يحدد")}
        ${row("الموعد المطلوب", order.deadline || "لم يحدد")}
      </table>
      <div style="background:#0d0d0d;border-right:3px solid #e2b979;padding:14px 16px;border-radius:0 8px 8px 0;margin:20px 0 0;">
        <p style="color:#888;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">وصف المشروع</p>
        <p style="color:#ccc;font-size:14px;margin:0;line-height:1.7;">${order.description}</p>
      </div>
    `);
    await smtp2goSend({
      to: ADMIN_EMAIL,
      subject: `🎨 طلب جديد: ${order.designType} — ${order.clientName}`,
      html,
    });
    logger.info({ to: ADMIN_EMAIL }, "New order notification sent");
  } catch (err) {
    logger.error({ err }, "Failed to send new order notification");
  }
}

export async function notifyOrderStatusChange(order: {
  clientName: string;
  clientEmail: string;
  designType: string;
  oldStatus: string;
  newStatus: string;
}) {
  const statusLabels: Record<string, string> = {
    pending: "قيد الانتظار",
    in_progress: "جاري التنفيذ",
    completed: "مكتمل ✅",
    cancelled: "ملغي ❌",
  };
  try {
    const html = wrap(`
      <h2 style="color:#e2b979;font-size:19px;margin:0 0 18px;font-weight:900;">🔄 تحديث حالة طلب</h2>
      <table width="100%" style="border-collapse:collapse;">
        ${row("العميل", `<strong>${order.clientName}</strong>`)}
        ${row("البريد الإلكتروني", order.clientEmail, "ltr")}
        ${row("نوع التصميم", order.designType)}
        ${row("الحالة القديمة", `<span style="color:#f59e0b;">${statusLabels[order.oldStatus] || order.oldStatus}</span>`)}
        ${row("الحالة الجديدة", `<span style="color:#10b981;font-weight:bold;">${statusLabels[order.newStatus] || order.newStatus}</span>`)}
      </table>
    `);
    await smtp2goSend({
      to: ADMIN_EMAIL,
      subject: `🔄 تحديث: ${order.clientName} — ${statusLabels[order.newStatus] || order.newStatus}`,
      html,
    });
    logger.info({ to: ADMIN_EMAIL }, "Order status notification sent");
  } catch (err) {
    logger.error({ err }, "Failed to send order status notification");
  }
}

export async function notifyNewRegistration(user: { name: string; email: string }) {
  try {
    const html = wrap(`
      <h2 style="color:#e2b979;font-size:19px;margin:0 0 18px;font-weight:900;">👤 عميل جديد انضم!</h2>
      <table width="100%" style="border-collapse:collapse;">
        ${row("الاسم", `<strong>${user.name}</strong>`)}
        ${row("البريد الإلكتروني", user.email, "ltr")}
      </table>
      <p style="color:#777;font-size:13px;margin:18px 0 0;">يمكنك الاطلاع على بياناته في لوحة التحكم.</p>
    `);
    await smtp2goSend({
      to: ADMIN_EMAIL,
      subject: `👤 عميل جديد: ${user.name}`,
      html,
    });
    logger.info({ to: ADMIN_EMAIL }, "New registration notification sent");
  } catch (err) {
    logger.error({ err }, "Failed to send registration notification");
  }
}
