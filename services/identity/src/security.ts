import { timingSafeEqual } from "crypto";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { INestApplication } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

export function secretsEqual(provided?: string, expected?: string) {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function getAllowedOrigins() {
  const fallback = process.env.VERCEL
    ? "https://aa-web-abdulrahmanashraf98s-projects.vercel.app,https://aa-dashboard-five.vercel.app,https://aa-dashboard-abdulrahmanashraf98s-projects.vercel.app"
    : "http://localhost:3000,http://localhost:3004,http://127.0.0.1:3000,http://127.0.0.1:3004";
  return (process.env.ALLOWED_ORIGINS ?? fallback)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function applySecurityHeaders(app: INestApplication) {
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    next();
  });
}

@Injectable()
export class InternalKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const key = req.header("x-internal-key");
    if (!process.env.INTERNAL_API_SECRET) return true;
    if (!secretsEqual(key, process.env.INTERNAL_API_SECRET)) {
      throw new UnauthorizedException("Forbidden");
    }
    return true;
  }
}
