import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { INestApplication } from "@nestjs/common";
import { AppModule } from "./app.module";
import { applySecurityHeaders, getAllowedOrigins } from "./security";

let cachedNest: INestApplication | null = null;
let cachedExpress: { listen: (port: number, cb: () => void) => void } | null = null;

export async function createNestApp() {
  if (cachedNest) return cachedNest;
  const app = await NestFactory.create(AppModule, { logger: false });
  applySecurityHeaders(app);
  app.enableCors({
    origin: getAllowedOrigins(),
    credentials: true,
    allowedHeaders: ["content-type", "authorization", "x-internal-key"],
  });
  cachedNest = app;
  return app;
}

export async function createApp() {
  if (cachedExpress) return cachedExpress;
  const app = await createNestApp();
  await app.init();
  cachedExpress = app.getHttpAdapter().getInstance();
  return cachedExpress;
}
