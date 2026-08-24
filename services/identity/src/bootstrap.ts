import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AuthService } from "./auth/auth.service";
import { applySecurityHeaders, getAllowedOrigins } from "./security";

let cached: { listen: (port: number, cb: () => void) => void } | null = null;

export async function createApp() {
  if (cached) return cached;
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  applySecurityHeaders(app);
  app.enableCors({
    origin: getAllowedOrigins(),
    credentials: true,
    allowedHeaders: ["content-type", "authorization", "x-internal-key"],
  });
  await app.init();
  await app.get(AuthService).bootstrap();
  cached = app.getHttpAdapter().getInstance();
  return cached;
}
