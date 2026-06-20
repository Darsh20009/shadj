import { pgTable, text, timestamp, serial, jsonb } from "drizzle-orm/pg-core";

export const visitorLogsTable = pgTable("visitor_logs", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  journey: jsonb("journey").notNull().default([]),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
  country: text("country"),
  device: text("device"),
});

export type VisitorLog = typeof visitorLogsTable.$inferSelect;
