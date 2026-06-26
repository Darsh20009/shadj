import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";
import { UserModel } from "./mongodb";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

const ADMIN_ROLES = ["admin", "designer", "writer"];

function getToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7).trim() || null;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getToken(req);
    if (!token) {
      return void res.status(401).json({ error: "غير مصرح، يرجى تسجيل الدخول" });
    }

    const { sessions } = await import("../routes/auth");
    if (!sessions.has(token)) {
      return void res.status(401).json({ error: "الجلسة منتهية، يرجى تسجيل الدخول" });
    }

    const userId = sessions.get(token)!;
    const user = await UserModel.findById(userId);
    if (!user) {
      sessions.delete(token);
      return void res.status(401).json({ error: "الجلسة منتهية، يرجى تسجيل الدخول" });
    }

    req.user = {
      id: String(user._id),
      email: String(user.email),
      name: String(user.name),
      role: String(user.role),
    };
    next();
  } catch (err) {
    logger.error(err, "requireAuth middleware error");
    res.status(500).json({ error: "خطأ داخلي في التحقق" });
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, async () => {
    if (!req.user || !ADMIN_ROLES.includes(req.user.role)) {
      return void res.status(403).json({ error: "هذا الإجراء للمديرين فقط" });
    }
    next();
  });
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getToken(req);
    if (token) {
      const { sessions } = await import("../routes/auth");
      if (sessions.has(token)) {
        const userId = sessions.get(token)!;
        const user = await UserModel.findById(userId);
        if (user) {
          req.user = {
            id: String(user._id),
            email: String(user.email),
            name: String(user.name),
            role: String(user.role),
          };
        }
      }
    }
  } catch {
    // non-blocking
  }
  next();
}

export { ADMIN_ROLES };
