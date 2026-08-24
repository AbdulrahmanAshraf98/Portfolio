import { createApp } from "./bootstrap";

async function main() {
  const server = await createApp();
  server.listen(Number(process.env.FILES_PORT ?? process.env.PORT ?? 3007), () => undefined);
}

void main();
