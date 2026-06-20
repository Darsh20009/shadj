import { Router } from "express";
import { logger } from "../lib/logger";
import { PortfolioWorkModel, OrderModel, UserModel, VisitorLogModel } from "../lib/mongodb";

const router = Router();

const activeSessions = new Map<string, { page: string; startedAt: string; country?: string }>();

router.get("/stats", async (_req, res) => {
  try {
    const [totalWorks, totalOrders, pendingOrders, totalUsers, totalVisitors] = await Promise.all([
      PortfolioWorkModel.countDocuments(),
      OrderModel.countDocuments(),
      OrderModel.countDocuments({ status: "pending" }),
      UserModel.countDocuments(),
      VisitorLogModel.countDocuments(),
    ]);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyVisitors = await VisitorLogModel.countDocuments({ startedAt: { $gte: monthAgo } });
    res.json({ totalVisitors, totalWorks, totalOrders, pendingOrders, totalUsers, monthlyVisitors });
  } catch (err) {
    logger.error(err, "Failed to get stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/active-users", (_req, res) => {
  const sessions = Array.from(activeSessions.entries()).map(([sessionId, data]) => ({
    sessionId,
    currentPage: data.page,
    startedAt: data.startedAt,
    country: data.country || null,
  }));
  res.json({ count: sessions.length, sessions });
});

router.get("/visitor-logs", async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const logs = await VisitorLogModel.find().sort({ startedAt: -1 }).limit(limit);
    res.json(logs.map(l => ({
      id: String(l._id),
      sessionId: l.sessionId,
      journey: Array.isArray(l.journey) ? l.journey : [],
      startedAt: l.startedAt instanceof Date ? l.startedAt.toISOString() : String(l.startedAt),
      endedAt: l.endedAt ? (l.endedAt instanceof Date ? l.endedAt.toISOString() : String(l.endedAt)) : null,
      country: (l as any).country || null,
      device: (l as any).device || null,
    })));
  } catch (err) {
    logger.error(err, "Failed to get visitor logs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/track", async (req, res) => {
  try {
    const { sessionId, page, event } = req.body;
    if (!sessionId || !page || !event) return void res.status(400).json({ error: "Missing fields" });

    if (event === "page_view") {
      if (!activeSessions.has(sessionId)) {
        activeSessions.set(sessionId, { page, startedAt: new Date().toISOString() });
        await VisitorLogModel.findOneAndUpdate(
          { sessionId },
          { $push: { journey: page }, $setOnInsert: { startedAt: new Date() } },
          { upsert: true, new: true }
        );
      } else {
        activeSessions.get(sessionId)!.page = page;
        await VisitorLogModel.findOneAndUpdate({ sessionId }, { $push: { journey: page } });
      }
    } else if (event === "session_end") {
      activeSessions.delete(sessionId);
      await VisitorLogModel.findOneAndUpdate({ sessionId }, { endedAt: new Date() });
    }

    setTimeout(() => activeSessions.delete(sessionId), 5 * 60 * 1000);
    res.json({ status: "ok" });
  } catch (err) {
    logger.error(err, "Failed to track event");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
