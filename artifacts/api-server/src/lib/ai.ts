import OpenAI from "openai";
import { logger } from "./logger";

const MOONSHOT_API_KEY = process.env["MOONSHOT_API_KEY"];

const client = new OpenAI({
  apiKey: MOONSHOT_API_KEY || "placeholder",
  baseURL: "https://api.moonshot.ai/v1",
});

const SYSTEM_PROMPT = `أنت "شدجتي"، المساعد الذكي الوقح الظريف لوكالة شَدِج للجرافيكس الجرافيكي.
اسمك شدجتي — عندما يسألك أحد عن اسمك قل: "أنا شدجتي، مساعدك الذكي من شَدِج! 🎨"

شخصيتك: مصري أصيل، صريح، مضحك، وبتقول الحق في وش الناس بأسلوب خفيف الظل. بتتكلم بالعامية المصرية الصح. بتحب الشغل وبتكره التقتير والناس اللي عايزين التصميم ببلاش.

🚫 لو حد طلب تصميم ببلاش أو بسعر "رمزي" أو قال "أنا طالب" أو "ميزانيتي صغيرة جداً":
رد عليه بأسلوب مضحك ومحرج زي:
- "يعم إحنا مش جمعية خيرية، إحنا وكالة تصميم! 😂 المصمم بيدفع فواتير زيك بالظبط"
- "أيوه يسطا... والكهربا بتجي ببلاش؟ والأكل؟ 😅 الإبداع له تمن يا صاحبي"
- "معلش يعم، الببلاش ده خلاه لأهلك، إحنا شغلنا بفلوس 😄"

🚫 لو حد قال "اختي/صاحبتي/جارتي بتحب شدج":
رد عليه: "يسطا خليها هي تتواصل معانا، إنت ليه بتتعب نفسك؟ 😂 وبعدين الدعم ده مش هيعملها بوستر!"

🚫 لو حد قال "التصميم ده مش هياخد وقت" أو "حاجة بسيطة":
رد عليه: "يا عيني عليك! مفيش حاجة بسيطة في التصميم، ده فن يا صاحبي مش Excel Sheet 😄"

🚫 لو حد قال كلام فارغ أو هيجص:
رد عليه بخفة وأعده لموضوع التصميم.

✅ لو العميل جاد وعنده مشروع حقيقي: كن احترافي ومفيد ومتحمس وساعده بكل قلبك.

لغتك: العربية دائماً وأبداً. لا تكتب أي كلمة بالصينية أو الفرنسية أو أي لغة أخرى غير العربية. الاستثناء الوحيد: إذا طلب العميل صراحةً الرد بالإنجليزية فقط، انتقل للإنجليزية. غير ذلك، العربية فقط حتى لو كتب العميل بلغة أخرى — أجبه بالعربية.

اسم الوكالة: شَدِج (Shadj Graphics) — "إبداع بلا حدود".
المؤسسة: شهد. موقع الوكالة: shadj-graphics.space. البريد: gfx@shadj-graphics.space.
خدماتنا: هوية بصرية ولوجو، بوسترات إعلانية، سوشيال ميديا، تصميم فيديوهات وموشن جرافيك، حملات إعلانية.
عملنا فوق 46 مشروع ناجح في مصر والسعودية والخليج.
إذا طُلب منك شيء خارج نطاق التصميم والوكالة، رد بخفة وأعد العميل للموضوع.`;

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  if (!MOONSHOT_API_KEY) {
    throw new Error("MOONSHOT_API_KEY not configured");
  }

  const fullMessages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages,
  ];

  const response = await client.chat.completions.create({
    model: "moonshot-v1-32k",
    messages: fullMessages,
    temperature: 0.7,
    max_tokens: 2048,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from AI");

  const content = raw.replace(
    /[\u2E80-\u2EFF\u2F00-\u2FDF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFE30-\uFE4F\u{20000}-\u{2A6DF}\u{2A700}-\u{2CEAF}]/gu,
    ""
  ).replace(/\s{2,}/g, " ").trim();

  logger.info({ tokens: response.usage?.total_tokens }, "AI response generated");
  return content;
}

export async function generateDesignBrief(opts: {
  clientName: string;
  industry: string;
  designType: string;
  goals: string;
}): Promise<string> {
  const prompt = `اكتب موجز تصميم (Design Brief) احترافي ومفصل لـ:
- اسم العميل: ${opts.clientName}
- المجال: ${opts.industry}
- نوع التصميم: ${opts.designType}
- الأهداف: ${opts.goals}

يجب أن يشمل الموجز: الهدف، الجمهور المستهدف، الألوان والمزاج البصري المقترح، والتسليمات المتوقعة.`;

  return chatWithAI([{ role: "user", content: prompt }]);
}

export async function generateCreativeIdeas(opts: {
  designType: string;
  industry: string;
  brand: string;
}): Promise<string> {
  const prompt = `أنت مدير إبداعي خبير في التصميم الجرافيكي. اقترح 5 أفكار إبداعية مبتكرة وجريئة لـ:
- نوع التصميم: ${opts.designType}
- المجال / الصناعة: ${opts.industry}
- البراند: ${opts.brand}

لكل فكرة اذكر: عنوان الفكرة، الوصف الإبداعي، لماذا ستنجح، والإحساس البصري المقترح. كن جريئاً وإبداعياً وغير تقليدي.`;
  return chatWithAI([{ role: "user", content: prompt }]);
}

export async function generateColorPalette(opts: {
  brand: string;
  mood: string;
  industry: string;
}): Promise<string> {
  const prompt = `أنت خبير في نظرية الألوان والهوية البصرية. اقترح لوحة ألوان احترافية لـ:
- البراند: ${opts.brand}
- المزاج / الإحساس المطلوب: ${opts.mood}
- المجال: ${opts.industry}

اذكر: 5 ألوان رئيسية مع كود HEX لكل لون، وصف للون، ومتى يُستخدم، والمزاج النفسي الذي يعكسه. ثم اقترح تركيبة الاستخدام المثالية بالنسب المئوية.`;
  return chatWithAI([{ role: "user", content: prompt }]);
}

export async function generateSocialContent(opts: {
  platform: string;
  topic: string;
  tone: string;
  brand: string;
}): Promise<string> {
  const prompt = `أنت كاتب محتوى سوشيال ميديا محترف ومتخصص في براندات التصميم. اكتب محتوى لـ:
- المنصة: ${opts.platform}
- الموضوع: ${opts.topic}
- أسلوب الكتابة: ${opts.tone}
- البراند: ${opts.brand}

اكتب: 3 نسخ مختلفة من المحتوى (قصير / متوسط / مفصّل)، مع الهاشتاجات المناسبة لكل نسخة. المحتوى بالعربية.`;
  return chatWithAI([{ role: "user", content: prompt }]);
}

export async function generateFontPairing(opts: {
  brandStyle: string;
  industry: string;
  language: string;
}): Promise<string> {
  const prompt = `أنت خبير طباعة وتصميم جرافيك. اقترح 4 تركيبات خطوط احترافية لـ:
- أسلوب البراند: ${opts.brandStyle}
- المجال: ${opts.industry}
- اللغة الرئيسية: ${opts.language}

لكل تركيبة اذكر:
١. خط العناوين (مع مصدر مجاني إن وجد)
٢. خط النص الأساسي (مع مصدر مجاني)
٣. الإحساس العام للتركيبة
٤. متى تستخدمها بالضبط
٥. مثال جملة كاملة بالتركيبة

اشمل خطوطاً عربية في الاقتراحات، وكن عملياً ومحدداً.`;
  return chatWithAI([{ role: "user", content: prompt }]);
}

export async function generateProjectQuote(opts: {
  clientName: string;
  designType: string;
  description: string;
  budget: string;
  deadline: string;
}): Promise<string> {
  const today = new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
  const prompt = `أنت مدير وكالة تصميم احترافية. اكتب عرض سعر (Project Proposal) كامل ورسمي بالعربية لـ:
- اسم العميل: ${opts.clientName}
- نوع التصميم: ${opts.designType}
- تفاصيل المشروع: ${opts.description}
- الميزانية المتاحة: ${opts.budget || "لم تُحدد"}
- الموعد النهائي: ${opts.deadline || "مرن"}
- التاريخ: ${today}
- الوكالة: شَدِج للجرافيكس

العرض يشمل:
١. مقدمة احترافية وترحيبية
٢. فهم المشروع والهدف
٣. نطاق العمل والتسليمات بالتفصيل
٤. الجدول الزمني المقترح (مراحل)
٥. التسعير والشروط المالية
٦. سياسة التعديلات وحقوق الملكية
٧. خاتمة احترافية موقّعة من شَدِج

اجعله رسمياً وموثوقاً ومقنعاً للعميل.`;
  return chatWithAI([{ role: "user", content: prompt }]);
}

export async function generateTagline(opts: {
  brandName: string;
  industry: string;
  tone: string;
}): Promise<string> {
  const prompt = `أنت خبير براندينج ومتخصص في كتابة الشعارات والتاج لاين. اكتب 7 خيارات تاج لاين (Tagline / Slogan) مبدعة وقوية لـ:
- اسم البراند: ${opts.brandName}
- المجال: ${opts.industry}
- الطابع المطلوب: ${opts.tone}

لكل تاج لاين اكتب: النص بالعربية، نسخة إنجليزية اختيارية قصيرة، ولماذا يعمل. اجعلها قصيرة (3-7 كلمات) وقوية وتُحفر في الذاكرة.`;
  return chatWithAI([{ role: "user", content: prompt }]);
}

export async function generateBrandAnalysis(opts: {
  brandName: string;
  description: string;
  competitors: string;
}): Promise<string> {
  const prompt = `أنت مستشار براندينج محترف. حلّل وقيّم هوية البراند التالي وقدّم توصيات إبداعية:
- اسم البراند: ${opts.brandName}
- وصف النشاط / الرسالة: ${opts.description}
- المنافسون: ${opts.competitors}

قدّم تحليلاً يشمل: نقاط القوة في الهوية الحالية، فرص التمييز، توصيات للتصميم والألوان والخطوط، ورسالة البراند المقترحة (Tagline). كن عملياً وإبداعياً.`;
  return chatWithAI([{ role: "user", content: prompt }]);
}
