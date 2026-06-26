import { Router } from "express";
import { logger } from "../lib/logger";
import { PortfolioWorkModel, OrderModel, UserModel, VisitorLogModel } from "../lib/mongodb";
import { requireAdmin } from "../lib/auth-middleware";

const router = Router();

const activeSessions = new Map<string, { page: string; startedAt: string }>();
const sessionTimers = new Map<string, ReturnType<typeof setTimeout>>();

function scheduleSessionCleanup(sessionId: string) {
  const existing = sessionTimers.get(sessionId);
  if (existing) clearTimeout(existing);
  const timer = setTimeout(() => {
    activeSessions.delete(sessionId);
    sessionTimers.delete(sessionId);
  }, 5 * 60 * 1000);
  sessionTimers.set(sessionId, timer);
}

router.get("/stats", requireAdmin, async (_req, res) => {
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
    res.status(500).json({ error: "خطأ في جلب الإحصائيات" });
  }
});

router.get("/active-users", requireAdmin, (_req, res) => {
  const sessions = Array.from(activeSessions.entries()).map(([sessionId, data]) => ({
    sessionId,
    currentPage: data.page,
    startedAt: data.startedAt,
  }));
  res.json({ count: sessions.length, sessions });
});

router.get("/visitor-logs", requireAdmin, async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 500);
    const logs = await VisitorLogModel.find().sort({ startedAt: -1 }).limit(limit);
    res.json(
      logs.map(l => ({
        id: String(l._id),
        sessionId: String(l.sessionId),
        journey: Array.isArray(l.journey) ? l.journey : [],
        startedAt: l.startedAt instanceof Date ? l.startedAt.toISOString() : String(l.startedAt),
        endedAt: l.endedAt ? (l.endedAt instanceof Date ? l.endedAt.toISOString() : String(l.endedAt)) : null,
        country: (l as any).country || null,
        device: (l as any).device || null,
      }))
    );
  } catch (err) {
    logger.error(err, "Failed to get visitor logs");
    res.status(500).json({ error: "خطأ في جلب سجلات الزوار" });
  }
});

router.post("/track", async (req, res) => {
  try {
    const { sessionId, page, event } = req.body;
    if (!sessionId || !page || !event) {
      return void res.status(400).json({ error: "sessionId و page و event مطلوبون" });
    }

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
      scheduleSessionCleanup(sessionId);
    } else if (event === "session_end") {
      activeSessions.delete(sessionId);
      const timer = sessionTimers.get(sessionId);
      if (timer) { clearTimeout(timer); sessionTimers.delete(sessionId); }
      await VisitorLogModel.findOneAndUpdate({ sessionId }, { endedAt: new Date() });
    }

    res.json({ status: "ok" });
  } catch (err) {
    logger.error(err, "Failed to track event");
    res.status(500).json({ error: "خطأ في تسجيل الحدث" });
  }
});

export default router;
