import { createApp } from "./bootstrap";

async function main() {
  const server = await createApp();
  if (!server) throw new Error("failed to start");
  server.listen(Number(process.env.CERTIFICATES_PORT ?? process.env.PORT ?? 3006), () => undefined);
}

void main();
