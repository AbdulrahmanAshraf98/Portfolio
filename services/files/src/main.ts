import { NestFactory } from "@nestjs/core";
import { createApp } from "./bootstrap";

export { NestFactory };

async function main() {
  const server = await createApp();
  server.listen(Number(process.env.FILES_PORT ?? process.env.PORT ?? 3007), () => undefined);
}

void main();
