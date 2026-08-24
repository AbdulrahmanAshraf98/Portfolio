import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { jsonStore } from "./infrastructure/json.store";
import { getAllowedOrigins } from "./security";

let cached: { listen: (port: number, cb: () => void) => void } | null = null;

export async function createApp() {
  if (cached) return cached;
  const app = await NestFactory.create(AppModule, { logger: false });
  app.enableCors({
    origin: getAllowedOrigins(),
    credentials: true,
    allowedHeaders: ["content-type", "authorization", "x-internal-key"],
  });
  await app.init();
  await jsonStore.hydrateFromBlob();
  cached = app.getHttpAdapter().getInstance();
  return cached;
}
