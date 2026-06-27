import { Router } from "express";
import { logger } from "../lib/logger";
import { MessageModel, UserModel, serializeMessage } from "../lib/mongodb";
import { requireAuth, requireAdmin, ADMIN_ROLES } from "../lib/auth-middleware";

const SMTP2GO_API_KEY = process.env["SMTP2GO_API_KEY"];
const FROM_EMAIL = "noreply@shadj-graphics.space";
const FROM_NAME = "شَـدِج للجرافيكس";

async function sendEmail(to: string, subject: string, html: string) {
  if (!SMTP2GO_API_KEY) return;
  await fetch("https://api.smtp2go.com/v3/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: SMTP2GO_API_KEY,
      to: [to],
      sender: `${FROM_NAME} <${FROM_EMAIL}>`,
      subject,
      html_body: html,
    }),
  });
}

function msgHtml(fromName: string, subject: string, content: string): string {
  return `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:20px;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#141414;border-radius:16px;border:1px solid #2a2a2a;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#1a1433,#2d1b69);padding:28px 32px;text-align:center;">
    <div style="font-size:28px;margin-bottom:4px;">✉️</div>
    <h1 style="margin:0;color:#F5E6C8;font-size:20px;font-weight:900;">رسالة من شَـدِج للجرافيكس</h1>
  </div>
  <div style="height:3px;background:linear-gradient(90deg,#7c3aed,#e2b979,#7c3aed);"></div>
  <div style="padding:32px;">
    <p style="color:#888;font-size:13px;margin:0 0 6px;">من: <strong style="color:#e2b979">${fromName}</strong></p>
    <h2 style="color:#F5E6C8;font-size:18px;font-weight:900;margin:0 0 20px;">${subject}</h2>
    <div style="background:#0d0d0d;border-right:4px solid #7c3aed;padding:20px;border-radius:0 12px 12px 0;white-space:pre-wrap;color:#ccc;font-size:14px;line-height:1.8;">${content}</div>
  </div>
  <div style="padding:16px 32px;background:#0d0d0d;border-top:1px solid #1f1f1f;text-align:center;">
    <p style="color:#444;font-size:11px;margin:0;">© 2025 شَدِج للجرافيكس — shadj-graphics.space</p>
  </div>
</div></body></html>`;
}

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const isAdmin = ADMIN_ROLES.includes(req.user!.role);
    const query = isAdmin ? {} : {
      $or: [{ toEmail: req.user!.email }, { fromEmail: req.user!.email }],
    };
    const messages = await MessageModel.find(query).sort({ createdAt: -1 }).limit(200);
    res.json(messages.map(serializeMessage));
  } catch (err) {
    logger.error(err, "Failed to list messages");
    res.status(500).json({ error: "خطأ في جلب الرسائل" });
  }
});

router.get("/unread-count", requireAuth, async (req, res) => {
  try {
    const isAdmin = ADMIN_ROLES.includes(req.user!.role);
    const query = isAdmin
      ? { toEmail: "admin", read: false }
      : { toEmail: req.user!.email, read: false };
    const count = await MessageModel.countDocuments(query);
    res.json({ count });
  } catch (err) {
    res.json({ count: 0 });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { toEmail, toName, subject, content, orderId } = req.body;
    if (!toEmail?.trim() || !subject?.trim() || !content?.trim()) {
      return void res.status(400).json({ error: "البريد والموضوع والمحتوى مطلوبون" });
    }
    const admin = await UserModel.findById(req.user!.id);
    const msg = await MessageModel.create({
      orderId: orderId || null,
      fromRole: "admin",
      fromName: admin?.name || "شَدِج للجرافيكس",
      fromEmail: FROM_EMAIL,
      toEmail: toEmail.trim(),
      toName: toName?.trim() || "",
      subject: subject.trim(),
      content: content.trim(),
    });
    sendEmail(toEmail.trim(), subject.trim(), msgHtml(admin?.name || "شَدِج", subject.trim(), content.trim())).catch(() => {});
    res.status(201).json(serializeMessage(msg));
  } catch (err) {
    logger.error(err, "Failed to send message");
    res.status(500).json({ error: "خطأ في إرسال الرسالة" });
  }
});

router.patch("/:id/read", requireAuth, async (req, res) => {
  try {
    await MessageModel.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "خطأ" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await MessageModel.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الحذف" });
  }
});

export default router;
