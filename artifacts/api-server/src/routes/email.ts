import { Router } from "express";
import { sendMarketingEmail } from "../lib/email";
import { UserModel } from "../lib/mongodb";
import { sessions } from "./auth";
import { logger } from "../lib/logger";

const router = Router();

function requireAdmin(req: any, res: any): string | null {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: "غير مصرح" });
    return null;
  }
  return sessions.get(token)!;
}

router.post("/marketing", async (req, res) => {
  try {
    const adminId = requireAdmin(req, res);
    if (!adminId) return;

    const admin = await UserModel.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return void res.status(403).json({ error: "للأدمن فقط" });
    }

    const { subject, bodyHtml, previewText, targetAll } = req.body;
    if (!subject || !bodyHtml) {
      return void res.status(400).json({ error: "subject و bodyHtml مطلوبان" });
    }

    let emails: string[] = req.body.emails || [];

    if (targetAll) {
      const users = await UserModel.find({ role: "client", email: { $exists: true } }).select("email");
      emails = users.map((u: any) => u.email).filter(Boolean);
    }

    if (emails.length === 0) {
      return void res.status(400).json({ error: "لا يوجد مستلمون" });
    }

    const result = await sendMarketingEmail({ to: emails, subject, bodyHtml, previewText });
    res.json({ ...result, total: emails.length });
  } catch (err) {
    logger.error(err, "Marketing email failed");
    res.status(500).json({ error: "خطأ في إرسال البريد" });
  }
});

router.post("/test", async (req, res) => {
  try {
    const adminId = requireAdmin(req, res);
    if (!adminId) return;

    const admin = await UserModel.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return void res.status(403).json({ error: "للأدمن فقط" });
    }

    const { to } = req.body;
    if (!to) return void res.status(400).json({ error: "to مطلوب" });

    await sendMarketingEmail({
      to: [to],
      subject: "اختبار البريد — شَدِج",
      bodyHtml: `<h2 style="color:#e2b979;">تم إعداد نظام البريد بنجاح! 🎉</h2>
<p style="color:#ccc;font-size:16px;line-height:1.8;">هذا بريد تجريبي من نظام شَدِج للتصميم. إذا وصلك هذا البريد فنظام الإرسال يعمل بشكل مثالي.</p>`,
      previewText: "اختبار نظام البريد الإلكتروني",
    });
    res.json({ ok: true });
  } catch (err) {
    logger.error(err, "Test email failed");
    res.status(500).json({ error: "فشل إرسال البريد التجريبي" });
  }
});

export default router;
