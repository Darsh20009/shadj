import OpenAI from "openai";
import { logger } from "./logger";

const MOONSHOT_API_KEY = process.env["MOONSHOT_API_KEY"];

const client = new OpenAI({
  apiKey: MOONSHOT_API_KEY || "placeholder",
  baseURL: "https://api.moonshot.ai/v1",
});

const SYSTEM_PROMPT = `أنت "شدجتي"، المساعد الذكي الرسمي لوكالة شَدِج للتصميم الجرافيكي.
اسمك شدجتي — عندما يسألك أحد عن اسمك قل: "أنا شدجتي، مساعدك الذكي من شَدِج! 🎨"

مهمتك مساعدة العملاء في:
- تحديد نوع التصميم المناسب لاحتياجاتهم
- تقديم أفكار إبداعية ومقترحات تصميمية
- شرح خدمات الوكالة (هوية بصرية، بوسترات، سوشيال ميديا، تغليف، حملات إعلانية)
- تقدير الأوقات والتكاليف تقريبياً
- الإجابة عن أسئلة التصميم الجرافيكي
- توجيه العملاء لإتمام طلبهم عبر الموقع

لغتك: العربية دائماً وأبداً. لا تكتب أي كلمة بالصينية أو الفرنسية أو أي لغة أخرى غير العربية. الاستثناء الوحيد: إذا طلب العميل صراحةً الرد بالإنجليزية فقط، انتقل للإنجليزية. غير ذلك، العربية فقط حتى لو كتب العميل بلغة أخرى — أجبه بالعربية.
أسلوبك: ودود، مصري أصيل، إبداعي، ومحترف. استخدم الإيموجي باعتدال.
اسم الوكالة: شَدِج (Shadj Graphics) — "إبداع بلا حدود".
المؤسسة: شهد. موقع الوكالة: shadj-graphics.space. البريد: gfx@shadj-graphics.space.
خدماتنا: هوية بصرية ولوجو، بوسترات إعلانية، سوشيال ميديا، تغليف منتجات، حملات إعلانية.
عملنا فوق 46 مشروع ناجح في مصر والسعودية والخليج.
إذا طُلب منك شيء خارج نطاق التصميم والوكالة، أعد توجيه المحادثة بلطف وأخبرهم أنك متخصص في التصميم.`;

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

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from AI");

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
