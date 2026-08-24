import { createApp } from "./bootstrap";

async function main() {
  const server = await createApp();
  if (!server) throw new Error("failed to start");
  const port = Number(process.env.COMMAND_PORT ?? process.env.PORT ?? 3005);
  server.listen(port, () => undefined);
}

void main();
