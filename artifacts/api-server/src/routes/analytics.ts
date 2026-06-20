import { Router } from "express";
import { db, visitorLogsTable, portfolioWorksTable, ordersTable, usersTable } from "@workspace/db";
import { eq, sql, gte } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

const activeSessions = new Map<string, { page: string; startedAt: string; country?: string }>();

router.get("/stats", async (_req, res) => {
  try {
    const [worksResult] = await db.select({ count: sql<number>`count(*)::int` }).from(portfolioWorksTable);
    const [ordersResult] = await db.select({ count: sql<number>`count(*)::int` }).from(ordersTable);
    const [pendingResult] = await db.select({ count: sql<number>`count(*)::int` }).from(ordersTable).where(eq(ordersTable.status, "pending"));
    const [usersResult] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable);
    const [visitorsResult] = await db.select({ count: sql<number>`count(*)::int` }).from(visitorLogsTable);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [monthlyResult] = await db.select({ count: sql<number>`count(*)::int` }).from(visitorLogsTable).where(gte(visitorLogsTable.startedAt, monthAgo));
    res.json({
      totalVisitors: visitorsResult.count,
      totalWorks: worksResult.count,
      totalOrders: ordersResult.count,
      pendingOrders: pendingResult.count,
      totalUsers: usersResult.count,
      monthlyVisitors: monthlyResult.count,
    });
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
    const logs = await db.select().from(visitorLogsTable).orderBy(visitorLogsTable.startedAt).limit(limit);
    res.json(logs.map(l => ({
      id: String(l.id),
      sessionId: l.sessionId,
      journey: Array.isArray(l.journey) ? l.journey : [],
      startedAt: l.startedAt.toISOString(),
      endedAt: l.endedAt?.toISOString() || null,
      country: l.country || null,
      device: l.device || null,
    })));
  } catch (err) {
    logger.error(err, "Failed to get visitor logs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/track", async (req, res) => {
  try {
    const { sessionId, page, event, metadata } = req.body;
    if (!sessionId || !page || !event) return res.status(400).json({ error: "Missing fields" });

    if (event === "page_view") {
      if (!activeSessions.has(sessionId)) {
        activeSessions.set(sessionId, { page, startedAt: new Date().toISOString() });
        const existing = await db.select().from(visitorLogsTable).where(eq(visitorLogsTable.sessionId, sessionId));
        if (existing.length === 0) {
          await db.insert(visitorLogsTable).values({
            sessionId,
            journey: [page],
          });
        } else {
          const current = existing[0];
          const journey = Array.isArray(current.journey) ? [...(current.journey as string[]), page] : [page];
          await db.update(visitorLogsTable).set({ journey }).where(eq(visitorLogsTable.sessionId, sessionId));
        }
      } else {
        activeSessions.get(sessionId)!.page = page;
        const existing = await db.select().from(visitorLogsTable).where(eq(visitorLogsTable.sessionId, sessionId));
        if (existing.length > 0) {
          const current = existing[0];
          const journey = Array.isArray(current.journey) ? [...(current.journey as string[]), page] : [page];
          await db.update(visitorLogsTable).set({ journey }).where(eq(visitorLogsTable.sessionId, sessionId));
        }
      }
    } else if (event === "session_end") {
      activeSessions.delete(sessionId);
      await db.update(visitorLogsTable).set({ endedAt: new Date() }).where(eq(visitorLogsTable.sessionId, sessionId));
    }

    setTimeout(() => {
      activeSessions.delete(sessionId);
    }, 5 * 60 * 1000);

    res.json({ status: "ok" });
  } catch (err) {
    logger.error(err, "Failed to track event");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
