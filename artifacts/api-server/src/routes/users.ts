import { Router } from "express";
import { logger } from "../lib/logger";
import { UserModel, serializeUser } from "../lib/mongodb";
import { hashPassword } from "./auth";
import { requireAdmin } from "../lib/auth-middleware";

const router = Router();

router.get("/", requireAdmin, async (_req, res) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    res.json(users.map(serializeUser));
  } catch (err) {
    logger.error(err, "Failed to list users");
    res.status(500).json({ error: "خطأ في جلب المستخدمين" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return void res.status(400).json({ error: "الاسم والبريد وكلمة المرور مطلوبون" });
    }
    if (password.length < 6) {
      return void res.status(400).json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
    }
    const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return void res.status(409).json({ error: "هذا البريد الإلكتروني مسجل بالفعل" });
    }
    const user = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || undefined,
      passwordHash: hashPassword(password),
      role: role || "client",
    });
    res.status(201).json(serializeUser(user));
  } catch (err) {
    logger.error(err, "Failed to create user");
    res.status(500).json({ error: "خطأ في إنشاء المستخدم" });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const { name, role, avatar, phone } = req.body;
    const updates: Record<string, unknown> = {};
    if (name?.trim()) updates.name = name.trim();
    if (role) updates.role = role;
    if (avatar !== undefined) updates.avatar = avatar;
    if (phone !== undefined) updates.phone = phone?.trim() || null;
    const user = await UserModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return void res.status(404).json({ error: "المستخدم غير موجود" });
    res.json(serializeUser(user));
  } catch (err) {
    logger.error(err, "Failed to update user");
    res.status(500).json({ error: "خطأ في تحديث المستخدم" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return void res.status(404).json({ error: "المستخدم غير موجود" });
    res.status(204).send();
  } catch (err) {
    logger.error(err, "Failed to delete user");
    res.status(500).json({ error: "خطأ في حذف المستخدم" });
  }
});

export default router;
