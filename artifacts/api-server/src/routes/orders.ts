import { Router } from "express";
import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    res.json(orders.map(o => ({ ...o, id: String(o.id), createdAt: o.createdAt.toISOString() })));
  } catch (err) {
    logger.error(err, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, designType, description, references, budget, deadline } = req.body;
    const [order] = await db.insert(ordersTable).values({
      clientName, clientEmail,
      clientPhone: clientPhone || null,
      designType, description,
      references: references || null,
      budget: budget || null,
      deadline: deadline || null,
      status: "pending",
    }).returning();
    res.status(201).json({ ...order, id: String(order.id), createdAt: order.createdAt.toISOString() });
  } catch (err) {
    logger.error(err, "Failed to create order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, Number(req.params.id)));
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json({ ...order, id: String(order.id), createdAt: order.createdAt.toISOString() });
  } catch (err) {
    logger.error(err, "Failed to get order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (notes) updates.notes = notes;
    const [order] = await db.update(ordersTable).set(updates as any).where(eq(ordersTable.id, Number(req.params.id))).returning();
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json({ ...order, id: String(order.id), createdAt: order.createdAt.toISOString() });
  } catch (err) {
    logger.error(err, "Failed to update order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
