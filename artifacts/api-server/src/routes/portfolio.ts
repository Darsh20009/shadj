import { Router } from "express";
import { logger } from "../lib/logger";
import { PortfolioWorkModel, serializeWork } from "../lib/mongodb";
import { requireAdmin } from "../lib/auth-middleware";

const router = Router();

router.get("/featured", async (_req, res) => {
  try {
    const works = await PortfolioWorkModel.find({ featured: true }).sort({ createdAt: 1 });
    res.json(works.map(serializeWork));
  } catch (err) {
    logger.error(err, "Failed to get featured works");
    res.status(500).json({ error: "خطأ في جلب الأعمال المميزة" });
  }
});

router.get("/categories", async (_req, res) => {
  try {
    const result = await PortfolioWorkModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { _id: 0, category: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    logger.error(err, "Failed to get categories");
    res.status(500).json({ error: "خطأ في جلب التصنيفات" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter: Record<string, unknown> = {};
    if (category) filter.category = String(category);
    if (featured !== undefined) filter.featured = featured === "true";
    const works = await PortfolioWorkModel.find(filter).sort({ createdAt: 1 });
    res.json(works.map(serializeWork));
  } catch (err) {
    logger.error(err, "Failed to list portfolio");
    res.status(500).json({ error: "خطأ في جلب الأعمال" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { title, titleAr, clientName, category, imageUrl, description, featured, designer } = req.body;
    if (!titleAr?.trim() || !clientName?.trim() || !category?.trim() || !imageUrl?.trim()) {
      return void res.status(400).json({ error: "العنوان بالعربي واسم العميل والتصنيف والصورة مطلوبون" });
    }
    const work = await PortfolioWorkModel.create({
      title: title?.trim() || "",
      titleAr: titleAr.trim(),
      clientName: clientName.trim(),
      category: category.trim(),
      imageUrl: imageUrl.trim(),
      description: description?.trim() || null,
      featured: featured ?? false,
      designer: designer?.trim() || null,
    });
    res.status(201).json(serializeWork(work));
  } catch (err) {
    logger.error(err, "Failed to create portfolio work");
    res.status(500).json({ error: "خطأ في إنشاء العمل" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const work = await PortfolioWorkModel.findById(req.params.id);
    if (!work) return void res.status(404).json({ error: "العمل غير موجود" });
    res.json(serializeWork(work));
  } catch (err) {
    logger.error(err, "Failed to get portfolio work");
    res.status(500).json({ error: "خطأ في جلب العمل" });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const allowed = ["title", "titleAr", "clientName", "category", "imageUrl", "description", "featured", "designer"];
    const updates: Record<string, unknown> = {};
    for (const f of allowed) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }
    const work = await PortfolioWorkModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!work) return void res.status(404).json({ error: "العمل غير موجود" });
    res.json(serializeWork(work));
  } catch (err) {
    logger.error(err, "Failed to update portfolio work");
    res.status(500).json({ error: "خطأ في تحديث العمل" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const work = await PortfolioWorkModel.findByIdAndDelete(req.params.id);
    if (!work) return void res.status(404).json({ error: "العمل غير موجود" });
    res.status(204).send();
  } catch (err) {
    logger.error(err, "Failed to delete portfolio work");
    res.status(500).json({ error: "خطأ في حذف العمل" });
  }
});

export default router;
