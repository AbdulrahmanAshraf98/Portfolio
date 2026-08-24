import { createApp } from "./bootstrap";

async function main() {
  const server = await createApp();
  if (!server) throw new Error("failed to start");
  const port = Number(process.env.QUERY_PORT ?? process.env.PORT ?? 3002);
  server.listen(port, () => undefined);
}

void main();
