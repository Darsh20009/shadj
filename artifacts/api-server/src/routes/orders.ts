import { Router } from "express";
import { logger } from "../lib/logger";
import { OrderModel, serializeOrder } from "../lib/mongodb";
import { requireAuth, requireAdmin, ADMIN_ROLES } from "../lib/auth-middleware";
import { notifyNewOrder, notifyOrderStatusChange, notifyClientOrderConfirmation } from "../lib/notify";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const isAdmin = ADMIN_ROLES.includes(req.user!.role);
    const query = isAdmin ? {} : { clientEmail: req.user!.email };
    const orders = await OrderModel.find(query).sort({ createdAt: -1 });
    res.json(orders.map(serializeOrder));
  } catch (err) {
    logger.error(err, "Failed to list orders");
    res.status(500).json({ error: "خطأ في جلب الطلبات" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, designType, description, references, budget, deadline } = req.body;

    if (!clientName?.trim() || !clientEmail?.trim() || !designType?.trim() || !description?.trim()) {
      return void res.status(400).json({ error: "الاسم والبريد الإلكتروني ونوع التصميم والوصف مطلوبون" });
    }

    const order = await OrderModel.create({
      clientName: clientName.trim(),
      clientEmail: clientEmail.toLowerCase().trim(),
      clientPhone: clientPhone?.trim() || null,
      designType: designType.trim(),
      description: description.trim(),
      references: references?.trim() || null,
      budget: budget || null,
      deadline: deadline || null,
      status: "pending",
    });

    notifyNewOrder({
      clientName: order.clientName,
      clientEmail: order.clientEmail,
      clientPhone: order.clientPhone,
      designType: order.designType,
      description: order.description,
      budget: order.budget,
      deadline: order.deadline,
    }).catch(() => {});

    notifyClientOrderConfirmation({
      clientName: order.clientName,
      clientEmail: order.clientEmail,
      designType: order.designType,
      description: order.description,
    }).catch(() => {});

    res.status(201).json(serializeOrder(order));
  } catch (err) {
    logger.error(err, "Failed to create order");
    res.status(500).json({ error: "خطأ في إنشاء الطلب" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) return void res.status(404).json({ error: "الطلب غير موجود" });

    const isAdmin = ADMIN_ROLES.includes(req.user!.role);
    if (!isAdmin && order.clientEmail !== req.user!.email) {
      return void res.status(403).json({ error: "غير مصرح بالوصول لهذا الطلب" });
    }

    res.json(serializeOrder(order));
  } catch (err) {
    logger.error(err, "Failed to get order");
    res.status(500).json({ error: "خطأ في جلب الطلب" });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const oldOrder = await OrderModel.findById(req.params.id);
    if (!oldOrder) return void res.status(404).json({ error: "الطلب غير موجود" });

    const oldStatus = String(oldOrder.status);
    const order = await OrderModel.findByIdAndUpdate(req.params.id, updates, { returnDocument: "after" });
    if (!order) return void res.status(404).json({ error: "الطلب غير موجود" });

    if (status && status !== oldStatus) {
      notifyOrderStatusChange({
        clientName: String(order.clientName),
        clientEmail: String(order.clientEmail),
        designType: String(order.designType),
        oldStatus,
        newStatus: status,
      }).catch(() => {});
    }

    res.json(serializeOrder(order));
  } catch (err) {
    logger.error(err, "Failed to update order");
    res.status(500).json({ error: "خطأ في تحديث الطلب" });
  }
});

export default router;
