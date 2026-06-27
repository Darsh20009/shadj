import mongoose from "mongoose";
import crypto from "crypto";
import { logger } from "./logger";

const MONGODB_URI = process.env["MONGODB_URI"];

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}

let connected = false;

export async function connectMongoDB() {
  if (connected) return;
  await mongoose.connect(MONGODB_URI!);
  connected = true;
  logger.info("Connected to MongoDB");
}

// ─── MODELS ──────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, sparse: true },
  phone: { type: String, sparse: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "client" },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});
export const UserModel = mongoose.models["User"] || mongoose.model("User", UserSchema);

const PortfolioWorkSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  titleAr: { type: String, required: true },
  clientName: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, default: null },
  featured: { type: Boolean, default: false },
  designer: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});
export const PortfolioWorkModel =
  mongoose.models["PortfolioWork"] || mongoose.model("PortfolioWork", PortfolioWorkSchema);

const OrderSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, default: null },
  designType: { type: String, required: true },
  description: { type: String, required: true },
  references: { type: String, default: null },
  status: { type: String, default: "pending" },
  budget: { type: String, default: null },
  deadline: { type: String, default: null },
  notes: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});
export const OrderModel = mongoose.models["Order"] || mongoose.model("Order", OrderSchema);

const MessageSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
  fromRole: { type: String, required: true },
  fromName: { type: String, required: true },
  fromEmail: { type: String, required: true },
  toEmail: { type: String, required: true },
  toName: { type: String, default: "" },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
export const MessageModel =
  mongoose.models["Message"] || mongoose.model("Message", MessageSchema);

export function serializeMessage(doc: any) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(obj._id),
    orderId: obj.orderId ? String(obj.orderId) : null,
    fromRole: obj.fromRole,
    fromName: obj.fromName,
    fromEmail: obj.fromEmail,
    toEmail: obj.toEmail,
    toName: obj.toName || "",
    subject: obj.subject,
    content: obj.content,
    read: obj.read,
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : String(obj.createdAt),
  };
}

const VisitorLogSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  journey: { type: [String], default: [] },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date, default: null },
  country: { type: String, default: null },
  device: { type: String, default: null },
});
export const VisitorLogModel =
  mongoose.models["VisitorLog"] || mongoose.model("VisitorLog", VisitorLogSchema);

// ─── SERIALIZERS ─────────────────────────────────────────────────────────────

export function serializeUser(doc: any) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(obj._id),
    name: obj.name,
    email: obj.email,
    phone: obj.phone || null,
    role: obj.role,
    avatar: obj.avatar || null,
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : String(obj.createdAt),
  };
}

export function serializeWork(doc: any) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(obj._id),
    title: obj.title || "",
    titleAr: obj.titleAr,
    clientName: obj.clientName,
    category: obj.category,
    imageUrl: obj.imageUrl,
    description: obj.description || null,
    featured: obj.featured,
    designer: obj.designer || null,
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : String(obj.createdAt),
  };
}

export function serializeOrder(doc: any) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  return {
    id: String(obj._id),
    clientName: obj.clientName,
    clientEmail: obj.clientEmail,
    clientPhone: obj.clientPhone || null,
    designType: obj.designType,
    description: obj.description,
    references: obj.references || null,
    status: obj.status,
    budget: obj.budget || null,
    deadline: obj.deadline || null,
    notes: obj.notes || null,
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : String(obj.createdAt),
  };
}

// ─── SEED ────────────────────────────────────────────────────────────────────

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password + "shadj_salt_2024").digest("hex");
}

export async function seedIfEmpty() {
  const adminExists = await UserModel.findOne({ role: "admin" });
  if (!adminExists) {
    await UserModel.create({
      name: "شهد",
      email: "admin@shadj-graphics.space",
      phone: "+201129085243",
      passwordHash: hashPassword("123456"),
      role: "admin",
    });
    logger.info("Admin user seeded");
  } else {
    logger.info("Admin user already exists — skipping seed");
  }

  const worksCount = await PortfolioWorkModel.countDocuments();
  if (worksCount > 0) return;

  logger.info("Seeding MongoDB with portfolio works...");

  // Portfolio works
  const works = [
    { titleAr: "شعار قهوة الخليج الرئيسي", title: "Al-Khalij Coffee Main Logo", clientName: "قهوة الخليج", category: "هوية بصرية", imageUrl: "/posters/poster_01.png", featured: true },
    { titleAr: "الهوية البصرية الكاملة — قهوة الخليج", title: "Full Brand Identity - Al-Khalij", clientName: "قهوة الخليج", category: "هوية بصرية", imageUrl: "/posters/poster_02.png", featured: true },
    { titleAr: "تصميم المنيو — قهوة الخليج", title: "Menu Design - Al-Khalij Coffee", clientName: "قهوة الخليج", category: "هوية بصرية", imageUrl: "/posters/poster_03.png", featured: true },
    { titleAr: "ألوان وخطوط العلامة — قهوة الخليج", title: "Brand Colors & Typography", clientName: "قهوة الخليج", category: "هوية بصرية", imageUrl: "/posters/poster_04.png", featured: true },
    { titleAr: "بوستر ترويجي — قهوة الخليج", title: "Promotional Poster", clientName: "قهوة الخليج", category: "هوية بصرية", imageUrl: "/posters/poster_05.png", featured: false },
    { titleAr: "كرت العمل — قهوة الخليج", title: "Business Card Design", clientName: "قهوة الخليج", category: "هوية بصرية", imageUrl: "/posters/poster_06.png", featured: false },
    { titleAr: "إطلاق منتج جديد — تك فيجن", title: "New Product Launch", clientName: "تك فيجن", category: "بوسترات", imageUrl: "/posters/poster_07.png", featured: true },
    { titleAr: "عرض تقني احترافي — تك فيجن", title: "Professional Tech Presentation", clientName: "تك فيجن", category: "بوسترات", imageUrl: "/posters/poster_08.png", featured: true },
    { titleAr: "إعلان خصم موسمي — تك فيجن", title: "Seasonal Discount Ad", clientName: "تك فيجن", category: "بوسترات", imageUrl: "/posters/poster_09.png", featured: true },
    { titleAr: "بوستر حدث تقني — تك فيجن", title: "Tech Event Poster", clientName: "تك فيجن", category: "بوسترات", imageUrl: "/posters/poster_10.png", featured: true },
    { titleAr: "إعلان توظيف — تك فيجن", title: "Hiring Announcement", clientName: "تك فيجن", category: "بوسترات", imageUrl: "/posters/poster_11.png", featured: false },
    { titleAr: "رسالة براندينج — تك فيجن", title: "Brand Message Poster", clientName: "تك فيجن", category: "بوسترات", imageUrl: "/posters/poster_12.png", featured: false },
    { titleAr: "محتوى إنستقرام — فيوتشر ستايل", title: "Instagram Content", clientName: "فيوتشر ستايل", category: "سوشيال ميديا", imageUrl: "/posters/poster_13.png", featured: true },
    { titleAr: "ستوري ترويجي — فيوتشر ستايل", title: "Promotional Story", clientName: "فيوتشر ستايل", category: "سوشيال ميديا", imageUrl: "/posters/poster_14.png", featured: true },
    { titleAr: "كاروسيل منتجات — فيوتشر ستايل", title: "Product Carousel", clientName: "فيوتشر ستايل", category: "سوشيال ميديا", imageUrl: "/posters/poster_15.png", featured: true },
    { titleAr: "بوست رمضاني — فيوتشر ستايل", title: "Ramadan Post", clientName: "فيوتشر ستايل", category: "سوشيال ميديا", imageUrl: "/posters/poster_16.png", featured: false },
    { titleAr: "إعلان تخفيضات — فيوتشر ستايل", title: "Sale Announcement", clientName: "فيوتشر ستايل", category: "سوشيال ميديا", imageUrl: "/posters/poster_17.png", featured: false },
    { titleAr: "ستوري نيويير — فيوتشر ستايل", title: "New Year Story", clientName: "فيوتشر ستايل", category: "سوشيال ميديا", imageUrl: "/posters/poster_18.png", featured: false },
    { titleAr: "تغليف صندوق الوجبة — كايرو فوود", title: "Meal Box Packaging", clientName: "كايرو فوود", category: "تغليف", imageUrl: "/posters/poster_19.png", featured: true },
    { titleAr: "تصميم الكيس الورقي — كايرو فوود", title: "Paper Bag Design", clientName: "كايرو فوود", category: "تغليف", imageUrl: "/posters/poster_20.png", featured: true },
    { titleAr: "لصيقة العبوة — كايرو فوود", title: "Package Label Design", clientName: "كايرو فوود", category: "تغليف", imageUrl: "/posters/poster_21.png", featured: true },
    { titleAr: "علبة السلطة — كايرو فوود", title: "Salad Box Packaging", clientName: "كايرو فوود", category: "تغليف", imageUrl: "/posters/poster_22.png", featured: false },
    { titleAr: "كوب القهوة — كايرو فوود", title: "Coffee Cup Design", clientName: "كايرو فوود", category: "تغليف", imageUrl: "/posters/poster_23.png", featured: false },
    { titleAr: "هوية التغليف الكاملة — كايرو فوود", title: "Full Packaging Identity", clientName: "كايرو فوود", category: "تغليف", imageUrl: "/posters/poster_24.png", featured: false },
    { titleAr: "حملة الإطلاق — نيكست ليفل", title: "Launch Campaign", clientName: "نيكست ليفل", category: "حملات إعلانية", imageUrl: "/posters/poster_25.png", featured: true },
    { titleAr: "إعلان ميديا سوشيال — نيكست ليفل", title: "Social Media Ad", clientName: "نيكست ليفل", category: "حملات إعلانية", imageUrl: "/posters/poster_26.png", featured: true },
    { titleAr: "لوحة إعلانية خارجية — نيكست ليفل", title: "Outdoor Billboard", clientName: "نيكست ليفل", category: "حملات إعلانية", imageUrl: "/posters/poster_27.png", featured: true },
    { titleAr: "إعلان ريلز — نيكست ليفل", title: "Reels Ad Creative", clientName: "نيكست ليفل", category: "حملات إعلانية", imageUrl: "/posters/poster_28.png", featured: false },
    { titleAr: "بانر رقمي — نيكست ليفل", title: "Digital Banner", clientName: "نيكست ليفل", category: "حملات إعلانية", imageUrl: "/posters/poster_29.png", featured: false },
    { titleAr: "ختام الحملة — نيكست ليفل", title: "Campaign Finale", clientName: "نيكست ليفل", category: "حملات إعلانية", imageUrl: "/posters/poster_30.png", featured: false },
    { titleAr: "بوستر فاشن — إيليت ديزاين", title: "Fashion Poster", clientName: "إيليت ديزاين", category: "بوسترات", imageUrl: "/posters/poster_31.png", featured: false },
    { titleAr: "إعلان كوليكشن جديد — إيليت ديزاين", title: "New Collection Ad", clientName: "إيليت ديزاين", category: "بوسترات", imageUrl: "/posters/poster_32.png", featured: false },
    { titleAr: "بوستر عطور — إيليت ديزاين", title: "Perfume Poster", clientName: "إيليت ديزاين", category: "بوسترات", imageUrl: "/posters/poster_33.png", featured: false },
    { titleAr: "إعلان سيزن سيل — إيليت ديزاين", title: "Season Sale Ad", clientName: "إيليت ديزاين", category: "بوسترات", imageUrl: "/posters/poster_34.png", featured: false },
    { titleAr: "بوستر بلاك فرايداي — إيليت ديزاين", title: "Black Friday Poster", clientName: "إيليت ديزاين", category: "بوسترات", imageUrl: "/posters/poster_35.png", featured: false },
    { titleAr: "إعلان فيب أوفر — إيليت ديزاين", title: "VIP Offer Ad", clientName: "إيليت ديزاين", category: "بوسترات", imageUrl: "/posters/poster_36.png", featured: false },
    { titleAr: "لوجو ستار برانديد", title: "Star Branded Logo", clientName: "ستار برانديد", category: "هوية بصرية", imageUrl: "/posters/poster_37.png", featured: false },
    { titleAr: "دليل الهوية البصرية — ستار برانديد", title: "Brand Guide", clientName: "ستار برانديد", category: "هوية بصرية", imageUrl: "/posters/poster_38.png", featured: false },
    { titleAr: "تصميم الغلاف — ستار برانديد", title: "Cover Design", clientName: "ستار برانديد", category: "هوية بصرية", imageUrl: "/posters/poster_39.png", featured: false },
    { titleAr: "بطاقة الشركة — ستار برانديد", title: "Company Card", clientName: "ستار برانديد", category: "هوية بصرية", imageUrl: "/posters/poster_40.png", featured: false },
    { titleAr: "ورقة الرسالة — ستار برانديد", title: "Letterhead Design", clientName: "ستار برانديد", category: "هوية بصرية", imageUrl: "/posters/poster_41.png", featured: false },
    { titleAr: "الموكب البصري — ستار برانديد", title: "Visual Mockup", clientName: "ستار برانديد", category: "هوية بصرية", imageUrl: "/posters/poster_42.png", featured: false },
    { titleAr: "بوست افتتاح — ميلينيوم", title: "Opening Post", clientName: "ميلينيوم", category: "سوشيال ميديا", imageUrl: "/posters/poster_43.png", featured: false },
    { titleAr: "محتوى أسبوعي — ميلينيوم", title: "Weekly Content", clientName: "ميلينيوم", category: "سوشيال ميديا", imageUrl: "/posters/poster_44.png", featured: false },
    { titleAr: "إنفوجراف خدمات — ميلينيوم", title: "Services Infographic", clientName: "ميلينيوم", category: "سوشيال ميديا", imageUrl: "/posters/poster_45.png", featured: false },
    { titleAr: "حملة تفاعل — ميلينيوم", title: "Engagement Campaign", clientName: "ميلينيوم", category: "سوشيال ميديا", imageUrl: "/posters/poster_46.png", featured: false },
  ];

  await PortfolioWorkModel.insertMany(works);
  logger.info(`Seeded ${works.length} portfolio works`);
}
