import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImgUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : "/" + path;
  return base + clean;
}
