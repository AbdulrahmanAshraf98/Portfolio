import { createNestApp } from "./bootstrap";

async function main() {
  const app = await createNestApp();
  const port = Number(process.env.GRAPHQL_PORT ?? process.env.PORT ?? 3003);
  await app.listen(port);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
