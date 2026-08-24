import { NestFactory } from "@nestjs/core";
import { createApp } from "./bootstrap";

export { NestFactory };

async function main() {
  const server = await createApp();
  if (!server) throw new Error("identity failed to start");
  const port = Number(process.env.IDENTITY_PORT ?? process.env.PORT ?? 3001);
  server.listen(port, () => undefined);
}

void main();
