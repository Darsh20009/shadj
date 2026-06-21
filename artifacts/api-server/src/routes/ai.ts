import { Router } from "express";
import { chatWithAI, generateDesignBrief } from "../lib/ai";
import { logger } from "../lib/logger";

const router = Router();

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return void res.status(400).json({ error: "messages مطلوبة" });
    }
    const reply = await chatWithAI(messages);
    res.json({ reply });
  } catch (err: any) {
    logger.error(err, "AI chat failed");
    res.status(500).json({ error: "خطأ في خدمة الذكاء الاصطناعي" });
  }
});

router.post("/brief", async (req, res) => {
  try {
    const { clientName, industry, designType, goals } = req.body;
    if (!clientName || !industry || !designType || !goals) {
      return void res.status(400).json({ error: "جميع الحقول مطلوبة" });
    }
    const brief = await generateDesignBrief({ clientName, industry, designType, goals });
    res.json({ brief });
  } catch (err: any) {
    logger.error(err, "Design brief generation failed");
    res.status(500).json({ error: "خطأ في توليد الموجز" });
  }
});

export default router;
