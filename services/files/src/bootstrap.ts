import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { getAllowedOrigins } from "./security";
import { getUploadDir } from "./storage";

let cached: { listen: (port: number, cb: () => void) => void } | null = null;

export async function createApp() {
  if (cached) return cached;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: false });
  app.useStaticAssets(getUploadDir(), { prefix: "/uploads/" });
  app.enableCors({
    origin: getAllowedOrigins(),
    credentials: true,
    allowedHeaders: ["content-type", "authorization", "x-internal-key"],
  });
  await app.init();
  cached = app.getHttpAdapter().getInstance();
  return cached;
}
