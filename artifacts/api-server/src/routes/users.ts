import { Router } from "express";
import { logger } from "../lib/logger";
import { UserModel, serializeUser } from "../lib/mongodb";
import { hashPassword } from "./auth";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    res.json(users.map(serializeUser));
  } catch (err) {
    logger.error(err, "Failed to list users");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const user = await UserModel.create({
      name, email,
      phone: phone || undefined,
      passwordHash: hashPassword(password),
      role: role || "client",
    });
    res.status(201).json(serializeUser(user));
  } catch (err) {
    logger.error(err, "Failed to create user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, role, avatar, phone } = req.body;
    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (role) updates.role = role;
    if (avatar !== undefined) updates.avatar = avatar;
    if (phone !== undefined) updates.phone = phone;
    const user = await UserModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return void res.status(404).json({ error: "Not found" });
    res.json(serializeUser(user));
  } catch (err) {
    logger.error(err, "Failed to update user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    logger.error(err, "Failed to delete user");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
