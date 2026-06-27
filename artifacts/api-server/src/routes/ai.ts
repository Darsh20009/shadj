import { Router } from "express";
import { chatWithAI, generateDesignBrief, generateCreativeIdeas, generateColorPalette, generateSocialContent, generateBrandAnalysis, generateTagline, generateFontPairing, generateProjectQuote, generateSmartReply, generateVideoScript, generatePortfolioCaption } from "../lib/ai";
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

router.post("/ideas", async (req, res) => {
  try {
    const { designType, industry, brand } = req.body;
    if (!designType || !industry || !brand) return void res.status(400).json({ error: "جميع الحقول مطلوبة" });
    const result = await generateCreativeIdeas({ designType, industry, brand });
    res.json({ result });
  } catch (err: any) {
    logger.error(err, "Creative ideas generation failed");
    res.status(500).json({ error: "خطأ في توليد الأفكار" });
  }
});

router.post("/colors", async (req, res) => {
  try {
    const { brand, mood, industry } = req.body;
    if (!brand || !mood || !industry) return void res.status(400).json({ error: "جميع الحقول مطلوبة" });
    const result = await generateColorPalette({ brand, mood, industry });
    res.json({ result });
  } catch (err: any) {
    logger.error(err, "Color palette generation failed");
    res.status(500).json({ error: "خطأ في توليد الألوان" });
  }
});

router.post("/social", async (req, res) => {
  try {
    const { platform, topic, tone, brand } = req.body;
    if (!platform || !topic || !tone || !brand) return void res.status(400).json({ error: "جميع الحقول مطلوبة" });
    const result = await generateSocialContent({ platform, topic, tone, brand });
    res.json({ result });
  } catch (err: any) {
    logger.error(err, "Social content generation failed");
    res.status(500).json({ error: "خطأ في توليد المحتوى" });
  }
});

router.post("/brand-analysis", async (req, res) => {
  try {
    const { brandName, description, competitors } = req.body;
    if (!brandName || !description) return void res.status(400).json({ error: "اسم البراند والوصف مطلوبان" });
    const result = await generateBrandAnalysis({ brandName, description, competitors: competitors || "غير محدد" });
    res.json({ result });
  } catch (err: any) {
    logger.error(err, "Brand analysis failed");
    res.status(500).json({ error: "خطأ في تحليل البراند" });
  }
});

router.post("/tagline", async (req, res) => {
  try {
    const { brandName, industry, tone } = req.body;
    if (!brandName || !industry || !tone) return void res.status(400).json({ error: "جميع الحقول مطلوبة" });
    const result = await generateTagline({ brandName, industry, tone });
    res.json({ result });
  } catch (err: any) {
    logger.error(err, "Tagline generation failed");
    res.status(500).json({ error: "خطأ في توليد التاج لاين" });
  }
});

router.post("/smart-reply", async (req, res) => {
  try {
    const { messageContent, senderName, subject } = req.body;
    if (!messageContent || !senderName) return void res.status(400).json({ error: "محتوى الرسالة واسم المرسل مطلوبان" });
    const result = await generateSmartReply({ messageContent, senderName, subject: subject || "" });
    res.json({ result });
  } catch (err: any) {
    logger.error(err, "Smart reply generation failed");
    res.status(500).json({ error: "خطأ في توليد الرد الذكي" });
  }
});

router.post("/video-script", async (req, res) => {
  try {
    const { brand, audience, videoType, duration, goal } = req.body;
    if (!brand || !videoType || !goal) return void res.status(400).json({ error: "البراند ونوع الفيديو والهدف مطلوبة" });
    const result = await generateVideoScript({ brand, audience: audience || "الجمهور العام", videoType, duration: duration || "30-60 ثانية", goal });
    res.json({ result });
  } catch (err: any) {
    logger.error(err, "Video script generation failed");
    res.status(500).json({ error: "خطأ في توليد السكريبت" });
  }
});

router.post("/caption", async (req, res) => {
  try {
    const { designType, brand, mood, platform } = req.body;
    if (!designType || !brand) return void res.status(400).json({ error: "نوع التصميم والبراند مطلوبان" });
    const result = await generatePortfolioCaption({ designType, brand, mood: mood || "احترافي", platform: platform || "إنستقرام" });
    res.json({ result });
  } catch (err: any) {
    logger.error(err, "Caption generation failed");
    res.status(500).json({ error: "خطأ في توليد الكابشن" });
  }
});

router.post("/font-pairing", async (req, res) => {
  try {
    const { brandStyle, industry, language } = req.body;
    if (!brandStyle || !industry || !language) return void res.status(400).json({ error: "جميع الحقول مطلوبة" });
    const result = await generateFontPairing({ brandStyle, industry, language });
    res.json({ result });
  } catch (err: any) {
    logger.error(err, "Font pairing generation failed");
    res.status(500).json({ error: "خطأ في توليد مزاوجة الخطوط" });
  }
});

router.post("/quote", async (req, res) => {
  try {
    const { clientName, designType, description, budget, deadline } = req.body;
    if (!clientName || !designType) return void res.status(400).json({ error: "اسم العميل ونوع التصميم مطلوبان" });
    const result = await generateProjectQuote({ clientName, designType, description: description || "", budget: budget || "", deadline: deadline || "" });
    res.json({ result });
  } catch (err: any) {
    logger.error(err, "Quote generation failed");
    res.status(500).json({ error: "خطأ في توليد عرض السعر" });
  }
});

export default router;
