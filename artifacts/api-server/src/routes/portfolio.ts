import { Router } from "express";
import { db, portfolioWorksTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = db.select().from(portfolioWorksTable);
    const works = await query;
    let filtered = works;
    if (category) filtered = filtered.filter(w => w.category === category);
    if (featured !== undefined) filtered = filtered.filter(w => w.featured === (featured === "true"));
    res.json(filtered.map(w => ({ ...w, id: String(w.id), createdAt: w.createdAt.toISOString() })));
  } catch (err) {
    logger.error(err, "Failed to list portfolio");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, titleAr, clientName, category, imageUrl, description, featured, designer } = req.body;
    const [work] = await db.insert(portfolioWorksTable).values({
      title, titleAr, clientName, category, imageUrl,
      description: description || null,
      featured: featured ?? false,
      designer: designer || null,
    }).returning();
    res.status(201).json({ ...work, id: String(work.id), createdAt: work.createdAt.toISOString() });
  } catch (err) {
    logger.error(err, "Failed to create portfolio work");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/featured", async (_req, res) => {
  try {
    const works = await db.select().from(portfolioWorksTable).where(eq(portfolioWorksTable.featured, true));
    res.json(works.map(w => ({ ...w, id: String(w.id), createdAt: w.createdAt.toISOString() })));
  } catch (err) {
    logger.error(err, "Failed to get featured works");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/categories", async (_req, res) => {
  try {
    const result = await db.select({
      category: portfolioWorksTable.category,
      count: sql<number>`count(*)::int`,
    }).from(portfolioWorksTable).groupBy(portfolioWorksTable.category);
    res.json(result);
  } catch (err) {
    logger.error(err, "Failed to get categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [work] = await db.select().from(portfolioWorksTable).where(eq(portfolioWorksTable.id, Number(req.params.id)));
    if (!work) return res.status(404).json({ error: "Not found" });
    res.json({ ...work, id: String(work.id), createdAt: work.createdAt.toISOString() });
  } catch (err) {
    logger.error(err, "Failed to get portfolio work");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updates: Record<string, unknown> = {};
    const fields = ["title", "titleAr", "clientName", "category", "imageUrl", "description", "featured", "designer"];
    for (const f of fields) {
      if (req.body[f] !== undefined) updates[f === "titleAr" ? "titleAr" : f] = req.body[f];
    }
    const [work] = await db.update(portfolioWorksTable).set(updates as any).where(eq(portfolioWorksTable.id, Number(req.params.id))).returning();
    if (!work) return res.status(404).json({ error: "Not found" });
    res.json({ ...work, id: String(work.id), createdAt: work.createdAt.toISOString() });
  } catch (err) {
    logger.error(err, "Failed to update portfolio work");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(portfolioWorksTable).where(eq(portfolioWorksTable.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    logger.error(err, "Failed to delete portfolio work");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
