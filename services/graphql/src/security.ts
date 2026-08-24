import { timingSafeEqual } from "crypto";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { INestApplication } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { NextFunction, Request, Response } from "express";

export function secretsEqual(provided?: string, expected?: string) {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function getAllowedOrigins() {
  return (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:3004,http://127.0.0.1:3000,http://127.0.0.1:3004")
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

export async function isAllowedGatewayKey(key?: string) {
  if (secretsEqual(key, process.env.INTERNAL_API_SECRET)) return true;
  if (!key) return false;
  try {
    const base = (process.env.IDENTITY_URL ?? "http://localhost:3001").replace(/\/$/, "");
    const response = await fetch(`${base}/internal/keys/verify`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-key": process.env.INTERNAL_API_SECRET ?? "",
      },
      body: JSON.stringify({ key }),
    });
    if (!response.ok) return false;
    const json = (await response.json()) as { ok?: boolean };
    return json.ok === true;
  } catch {
    return false;
  }
}

@Injectable()
export class InternalKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const gql = GqlExecutionContext.create(context);
    const req = (gql.getContext()?.req ?? context.switchToHttp().getRequest()) as Request;
    const key = req.header?.("x-internal-key") ?? (req.headers["x-internal-key"] as string | undefined);
    if (!(await isAllowedGatewayKey(key))) {
      throw new UnauthorizedException("Forbidden");
    }
    return true;
  }
}
