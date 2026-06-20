import { Router } from "express";
import crypto from "crypto";
import { logger } from "../lib/logger";
import { UserModel, serializeUser } from "../lib/mongodb";

const router = Router();

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "shadj_salt_2024").digest("hex");
}

export const sessions = new Map<string, string>(); // token → userId string

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

router.post("/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const identifier = (phone || email || "").trim();
    if (!identifier || !password) {
      return void res.status(400).json({ error: "رقم الهاتف وكلمة المرور مطلوبان" });
    }
    // Normalize phone formats: strip spaces, convert 00xx → +xx
    const normalized = identifier.replace(/\s/g, "").replace(/^00/, "+");

    const user = await UserModel.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
        { phone: normalized },
        { email: normalized },
      ],
    });

    if (!user) return void res.status(401).json({ error: "رقم الهاتف أو كلمة المرور غير صحيحة" });
    if (user.passwordHash !== hashPassword(password)) {
      return void res.status(401).json({ error: "رقم الهاتف أو كلمة المرور غير صحيحة" });
    }

    const token = generateToken();
    sessions.set(token, String(user._id));
    res.json({ token, user: serializeUser(user) });
  } catch (err) {
    logger.error(err, "Login failed");
    res.status(500).json({ error: "خطأ في الخادم، حاول مرة أخرى" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return void res.status(400).json({ error: "جميع الحقول مطلوبة" });
    }
    if (password.length < 6) {
      return void res.status(400).json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
    }
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return void res.status(409).json({ error: "هذا البريد الإلكتروني مسجل بالفعل" });
    }
    const user = await UserModel.create({
      name, email,
      passwordHash: hashPassword(password),
      role: "client",
    });
    const token = generateToken();
    sessions.set(token, String(user._id));
    res.status(201).json({ token, user: serializeUser(user) });
  } catch (err) {
    logger.error(err, "Register failed");
    res.status(500).json({ error: "خطأ في الخادم، حاول مرة أخرى" });
  }
});

router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) sessions.delete(token);
  res.json({ status: "ok" });
});

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
