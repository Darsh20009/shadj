import { logger } from "./logger";

const SMTP2GO_API_KEY = process.env["SMTP2GO_API_KEY"];
const FROM_EMAIL = "noreply@shadj-graphics.space";
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

function wrap(content: string, emoji = "🎨"): string {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { margin:0; padding:0; background:#0d0d0d; font-family:'Segoe UI',Tahoma,Arial,sans-serif; }
    .container { max-width:600px; margin:0 auto; }
    .header { background:linear-gradient(135deg,#e2b979,#c9973a); padding:28px 30px; text-align:center; border-radius:16px 16px 0 0; }
    .body { background:#1a1a1a; padding:30px; }
    .footer { background:#111; padding:16px 30px; border-top:1px solid #2a2a2a; text-align:center; border-radius:0 0 16px 16px; }
    .badge { display:inline-block; background:#e2b979; color:#0d0d0d; border-radius:20px; padding:4px 14px; font-size:12px; font-weight:900; margin-bottom:14px; }
    .info-row { padding:10px 0; border-bottom:1px solid #222; display:flex; gap:12px; }
    .info-label { color:#666; font-size:13px; min-width:130px; }
    .info-value { color:#e5e5e5; font-size:14px; font-weight:600; }
    .highlight { background:#0d0d0d; border-right:3px solid #e2b979; padding:14px 16px; border-radius:0 8px 8px 0; margin:20px 0 0; }
    .btn { display:inline-block; background:linear-gradient(135deg,#e2b979,#c9973a); color:#0d0d0d; font-weight:900; padding:12px 28px; border-radius:50px; text-decoration:none; font-size:15px; margin-top:20px; }
  </style>
</head>
<body style="background:#0d0d0d; padding:30px 20px;">
  <div class="container">
    <div style="background:#1a1a1a; border-radius:16px; border:1px solid #2a2a2a; overflow:hidden;">
      <div class="header">
        <div style="font-size:32px; margin-bottom:6px;">${emoji}</div>
        <h1 style="margin:0; color:#0d0d0d; font-size:26px; font-weight:900; letter-spacing:2px;">شَـدِج</h1>
        <p style="margin:6px 0 0; color:#0d0d0d; font-size:12px; opacity:0.7;">نظام الإشعارات الداخلي • Shadj Graphics</p>
      </div>
      <div class="body">${content}</div>
      <div class="footer">
        <p style="color:#444; font-size:11px; margin:0;">© 2025 شَدِج للتصميم — إشعار تلقائي للنظام 🤖</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function infoRow(label: string, value: string): string {
  return `<div class="info-row"><span class="info-label">${label}</span><span class="info-value">${value}</span></div>`;
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
      <div class="badge">طلب جديد وصل يا كبير! 🔔</div>
      <h2 style="color:#e2b979; font-size:20px; margin:0 0 6px; font-weight:900;">
        يا سلام! عميل جديد عايز تصميم 🎉
      </h2>
      <p style="color:#888; font-size:13px; margin:0 0 20px;">
        يسطا الأوردر وصل — متأخرش وقف 😄 دلوقتي يا بطل!
      </p>
      ${infoRow("العميل", `<strong style="color:#e2b979">${order.clientName}</strong>`)}
      ${infoRow("البريد الإلكتروني", order.clientEmail)}
      ${order.clientPhone ? infoRow("التواصل", order.clientPhone) : ""}
      ${infoRow("نوع التصميم", `<span style="color:#e2b979; font-weight:bold">${order.designType}</span>`)}
      ${infoRow("الميزانية", order.budget || "ما قالش — إنت فاهم 😅")}
      ${infoRow("الموعد المطلوب", order.deadline || "مش متسرع (أو كده بيقول) 🙃")}
      <div class="highlight">
        <p style="color:#888; font-size:11px; margin:0 0 6px; text-transform:uppercase; letter-spacing:1px;">تفاصيل المشروع</p>
        <p style="color:#ccc; font-size:14px; margin:0; line-height:1.8;">${order.description}</p>
      </div>
    `, "🎨");
    await smtp2goSend({
      to: ADMIN_EMAIL,
      subject: `🎨 أوردر جديد من ${order.clientName} — ${order.designType}`,
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
    pending: "قيد الانتظار ⏳",
    in_progress: "شغالين عليه دلوقتي 🔥",
    completed: "خلصنا وبقا جميل ✅",
    cancelled: "اتلغى يا عم 😬",
  };
  const statusEmojis: Record<string, string> = {
    pending: "⏳", in_progress: "🔥", completed: "✅", cancelled: "😬",
  };
  const emoji = statusEmojis[order.newStatus] || "🔄";
  try {
    const html = wrap(`
      <div class="badge">تحديث حالة أوردر ${emoji}</div>
      <h2 style="color:#e2b979; font-size:20px; margin:0 0 6px; font-weight:900;">
        الأوردر بتاع ${order.clientName} اتغير حاله!
      </h2>
      <p style="color:#888; font-size:13px; margin:0 0 20px;">
        يلا بينا نبص إيه اللي حصل 👇
      </p>
      ${infoRow("العميل", `<strong style="color:#e2b979">${order.clientName}</strong>`)}
      ${infoRow("البريد الإلكتروني", order.clientEmail)}
      ${infoRow("نوع التصميم", order.designType)}
      ${infoRow("كان قبل كده", `<span style="color:#f59e0b">${statusLabels[order.oldStatus] || order.oldStatus}</span>`)}
      ${infoRow("دلوقتي بقا", `<span style="color:#10b981; font-weight:bold">${statusLabels[order.newStatus] || order.newStatus}</span>`)}
    `, emoji);
    await smtp2goSend({
      to: ADMIN_EMAIL,
      subject: `${emoji} تحديث: ${order.clientName} — ${statusLabels[order.newStatus] || order.newStatus}`,
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
      <div class="badge">عميل جديد انضم للعيلة! 🎉</div>
      <h2 style="color:#e2b979; font-size:20px; margin:0 0 6px; font-weight:900;">
        أهلاً بيك في عالمنا الإبداعي يا ${user.name}! 🌟
      </h2>
      <p style="color:#888; font-size:14px; margin:0 0 20px; line-height:1.8;">
        واحد تاني شاف النور وسجّل في شَدِج 😄<br>
        فريقنا مبسوط بيه ومستنياه يطلب أول تصميم!
      </p>
      ${infoRow("الاسم", `<strong style="color:#e2b979">${user.name}</strong>`)}
      ${infoRow("البريد الإلكتروني", user.email)}
      <p style="color:#555; font-size:13px; margin:18px 0 0;">
        روح شوف ده في لوحة التحكم وعيش مبسوط 😊
      </p>
    `, "👤");
    await smtp2goSend({
      to: ADMIN_EMAIL,
      subject: `👤 عميل جديد: ${user.name} انضم لشَدِج!`,
      html,
    });
    logger.info({ to: ADMIN_EMAIL }, "New registration notification sent");
  } catch (err) {
    logger.error({ err }, "Failed to send registration notification");
  }
}
