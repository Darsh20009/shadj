import { pgTable, text, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const portfolioWorksTable = pgTable("portfolio_works", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  clientName: text("client_name").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  featured: boolean("featured").notNull().default(false),
  designer: text("designer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPortfolioWorkSchema = createInsertSchema(portfolioWorksTable).omit({ id: true, createdAt: true });
export type InsertPortfolioWork = z.infer<typeof insertPortfolioWorkSchema>;
export type PortfolioWork = typeof portfolioWorksTable.$inferSelect;
