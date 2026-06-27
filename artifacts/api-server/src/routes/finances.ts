import { Router } from "express";
import mongoose, { Schema, Document } from "mongoose";
import { requireAdmin } from "../lib/auth-middleware";

const router = Router();

interface ITransaction extends Document {
  amount: number;
  description: string;
  type: "income" | "expense";
  orderId?: string;
  date: Date;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount:      { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    type:        { type: String, enum: ["income", "expense"], default: "income" },
    orderId:     { type: String, default: null },
    date:        { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Transaction = mongoose.models.Transaction as mongoose.Model<ITransaction>
  || mongoose.model<ITransaction>("Transaction", TransactionSchema);

const MILESTONES = [13_000, 50_000, 250_000, 1_000_000];

router.get("/summary", requireAdmin, async (_req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  const totalIncome  = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const netProfit    = totalIncome - totalExpense;

  const milestones = MILESTONES.map(target => ({
    target,
    reached:    netProfit >= target,
    progress:   Math.min(100, Math.round((netProfit / target) * 100)),
    remaining:  Math.max(0, target - netProfit),
    current:    netProfit < target && (MILESTONES.indexOf(target) === 0 || netProfit >= MILESTONES[MILESTONES.indexOf(target) - 1]),
  }));

  res.json({ totalIncome, totalExpense, netProfit, milestones, transactionCount: transactions.length });
});

router.get("/transactions", requireAdmin, async (_req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  res.json(transactions);
});

router.post("/transactions", requireAdmin, async (req, res) => {
  const { amount, description, type = "income", orderId, date } = req.body;
  if (!amount || !description) return res.status(400).json({ error: "amount و description مطلوبان" });
  const t = await Transaction.create({ amount: Number(amount), description, type, orderId, date: date ? new Date(date) : new Date() });
  res.status(201).json(t);
});

router.delete("/transactions/:id", requireAdmin, async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
