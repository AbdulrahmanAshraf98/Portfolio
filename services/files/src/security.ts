import { timingSafeEqual } from "crypto";
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

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

@Injectable()
export class InternalKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    if (!process.env.INTERNAL_API_SECRET) return true;
    if (!secretsEqual(req.header("x-internal-key"), process.env.INTERNAL_API_SECRET)) {
      throw new UnauthorizedException("Forbidden");
    }
    return true;
  }
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(@Inject(JwtService) private readonly jwt: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) throw new UnauthorizedException("Missing token");
    await this.jwt.verifyAsync(token);
    return true;
  }
}
