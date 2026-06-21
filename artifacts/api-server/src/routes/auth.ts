import { Router } from "express";
import crypto from "crypto";
import { logger } from "../lib/logger";
import { UserModel, serializeUser } from "../lib/mongodb";
import { sendOTPEmail, sendWelcomeEmail } from "../lib/email";

const router = Router();

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "shadj_salt_2024").digest("hex");
}

export const sessions = new Map<string, string>(); // token → userId string

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// OTP store: email → { otp, name, password, expiresAt }
const otpStore = new Map<string, { otp: string; name: string; passwordHash: string; expiresAt: number }>();

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const identifier = (phone || email || "").trim();
    if (!identifier || !password) {
      return void res.status(400).json({ error: "رقم الهاتف وكلمة المرور مطلوبان" });
    }
    const normalized = identifier.replace(/\s/g, "").replace(/^00/, "+");

    const user = await UserModel.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
        { phone: normalized },
        { email: normalized },
      ],
    });

    if (!user) return void res.status(401).json({ error: "البيانات غير صحيحة" });
    if (user.passwordHash !== hashPassword(password)) {
      return void res.status(401).json({ error: "البيانات غير صحيحة" });
    }

    const token = generateToken();
    sessions.set(token, String(user._id));
    res.json({ token, user: serializeUser(user) });
  } catch (err) {
    logger.error(err, "Login failed");
    res.status(500).json({ error: "خطأ في الخادم، حاول مرة أخرى" });
  }
});

// ─── REGISTER: Step 1 — send OTP ─────────────────────────────────────────────
router.post("/register/send-otp", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return void res.status(400).json({ error: "جميع الحقول مطلوبة" });
    }
    if (password.length < 6) {
      return void res.status(400).json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
    }

    const emailLower = email.toLowerCase().trim();
    const existing = await UserModel.findOne({ email: emailLower });
    if (existing) {
      return void res.status(409).json({ error: "هذا البريد الإلكتروني مسجل بالفعل" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(emailLower, { otp, name, passwordHash: hashPassword(password), expiresAt });

    await sendOTPEmail(emailLower, name, otp);

    res.json({ ok: true, message: "تم إرسال رمز التحقق إلى بريدك الإلكتروني" });
  } catch (err) {
    logger.error(err, "Send OTP failed");
    res.status(500).json({ error: "فشل إرسال رمز التحقق، تحقق من البريد الإلكتروني" });
  }
});

// ─── REGISTER: Step 2 — verify OTP & create account ──────────────────────────
router.post("/register/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return void res.status(400).json({ error: "البريد والرمز مطلوبان" });
    }

    const emailLower = email.toLowerCase().trim();
    const record = otpStore.get(emailLower);

    if (!record) {
      return void res.status(400).json({ error: "لم يتم طلب رمز لهذا البريد" });
    }
    if (Date.now() > record.expiresAt) {
      otpStore.delete(emailLower);
      return void res.status(400).json({ error: "انتهت صلاحية الرمز، أعد المحاولة" });
    }
    if (record.otp !== String(otp).trim()) {
      return void res.status(400).json({ error: "رمز التحقق غير صحيح" });
    }

    // OTP valid — create the user
    otpStore.delete(emailLower);

    const existing = await UserModel.findOne({ email: emailLower });
    if (existing) {
      return void res.status(409).json({ error: "هذا البريد الإلكتروني مسجل بالفعل" });
    }

    const user = await UserModel.create({
      name: record.name,
      email: emailLower,
      passwordHash: record.passwordHash,
      role: "client",
    });

    const token = generateToken();
    sessions.set(token, String(user._id));

    // Send welcome email (non-blocking)
    sendWelcomeEmail(emailLower, record.name).catch(() => {});

    res.status(201).json({ token, user: serializeUser(user) });
  } catch (err) {
    logger.error(err, "Verify OTP failed");
    res.status(500).json({ error: "خطأ في إنشاء الحساب" });
  }
});

// ─── LEGACY register (kept for backward compat, now redirects to OTP flow) ────
router.post("/register", async (req, res) => {
  return void res.status(400).json({
    error: "يرجى استخدام /api/auth/register/send-otp ثم /api/auth/register/verify-otp",
    requiresOTP: true,
  });
});

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) sessions.delete(token);
  res.json({ status: "ok" });
});

// ─── ME ──────────────────────────────────────────────────────────────────────
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token || !sessions.has(token)) return void res.status(401).json({ error: "غير مصرح" });
    const userId = sessions.get(token)!;
    const user = await UserModel.findById(userId);
    if (!user) return void res.status(401).json({ error: "غير مصرح" });
    res.json(serializeUser(user));
  } catch (err) {
    logger.error(err, "Failed to get current user");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
