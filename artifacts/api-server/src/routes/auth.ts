import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { logger } from "../lib/logger";

const router = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "shadj_salt_2024").digest("hex");
}

const sessions = new Map<string, number>();

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const hash = hashPassword(password);
    if (user.passwordHash !== hash) return res.status(401).json({ error: "Invalid credentials" });
    const token = generateToken();
    sessions.set(token, user.id);
    res.json({
      token,
      user: {
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (err) {
    logger.error(err, "Login failed");
    res.status(500).json({ error: "Internal server error" });
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
    if (!token || !sessions.has(token)) return res.status(401).json({ error: "Unauthorized" });
    const userId = sessions.get(token)!;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    res.json({
      id: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || null,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (err) {
    logger.error(err, "Failed to get current user");
    res.status(500).json({ error: "Internal server error" });
  }
});

export { sessions, hashPassword };
export default router;
