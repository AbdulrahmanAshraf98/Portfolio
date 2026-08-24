import { put, list } from "@vercel/blob";
import type { PortfolioData } from "./entities";

const NAME = "catalog/snapshot.json";

export async function readCatalogBlob(): Promise<PortfolioData | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  try {
    const { blobs } = await list({ prefix: NAME, token });
    const match = blobs.find((item) => item.pathname === NAME) ?? blobs[0];
    if (!match) return null;
    const response = await fetch(match.url);
    if (!response.ok) return null;
    return (await response.json()) as PortfolioData;
  } catch {
    return null;
  }
}

export async function writeCatalogBlob(data: PortfolioData) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return;
  await put(NAME, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  });
}
