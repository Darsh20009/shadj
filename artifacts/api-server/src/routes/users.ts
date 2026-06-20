import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { hashPassword } from "./auth";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const users = await db.select().from(usersTable);
    res.json(users.map(u => ({
      id: String(u.id), name: u.name, email: u.email, role: u.role,
      avatar: u.avatar || null, createdAt: u.createdAt.toISOString(),
    })));
  } catch (err) {
    logger.error(err, "Failed to list users");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const passwordHash = hashPassword(password);
    const [user] = await db.insert(usersTable).values({ name, email, passwordHash, role }).returning();
    res.status(201).json({
      id: String(user.id), name: user.name, email: user.email, role: user.role,
      avatar: user.avatar || null, createdAt: user.createdAt.toISOString(),
    });
  } catch (err) {
    logger.error(err, "Failed to create user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, role, avatar } = req.body;
    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (role) updates.role = role;
    if (avatar !== undefined) updates.avatar = avatar;
    const [user] = await db.update(usersTable).set(updates as any).where(eq(usersTable.id, Number(req.params.id))).returning();
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json({
      id: String(user.id), name: user.name, email: user.email, role: user.role,
      avatar: user.avatar || null, createdAt: user.createdAt.toISOString(),
    });
  } catch (err) {
    logger.error(err, "Failed to update user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(usersTable).where(eq(usersTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    logger.error(err, "Failed to delete user");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
