import { Router } from "express";
import { logger } from "../lib/logger";
import { OrderModel, serializeOrder } from "../lib/mongodb";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.json(orders.map(serializeOrder));
  } catch (err) {
    logger.error(err, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, designType, description, references, budget, deadline } = req.body;
    const order = await OrderModel.create({
      clientName, clientEmail,
      clientPhone: clientPhone || null,
      designType, description,
      references: references || null,
      budget: budget || null,
      deadline: deadline || null,
      status: "pending",
    });
    res.status(201).json(serializeOrder(order));
  } catch (err) {
    logger.error(err, "Failed to create order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return void res.status(404).json({ error: "Not found" });
    res.json(serializeOrder(order));
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
    if (notes !== undefined) updates.notes = notes;
    const order = await OrderModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!order) return void res.status(404).json({ error: "Not found" });
    res.json(serializeOrder(order));
  } catch (err) {
    logger.error(err, "Failed to update order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
