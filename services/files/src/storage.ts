import { put } from "@vercel/blob";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { tmpdir } from "os";

export type StoredFile = {
  id: string;
  url: string;
  pathname: string;
  originalName: string;
  contentType: string;
  size: number;
  createdAt: string;
};

const metaPath = join(tmpdir(), "portfolio-files.json");
const uploadDir = join(tmpdir(), "portfolio-uploads");

function readMeta(): StoredFile[] {
  if (!existsSync(metaPath)) return [];
  return JSON.parse(readFileSync(metaPath, "utf8")) as StoredFile[];
}

function writeMeta(items: StoredFile[]) {
  writeFileSync(metaPath, JSON.stringify(items, null, 2));
}

export async function saveFile(file: { originalname: string; mimetype: string; size: number; buffer: Buffer }) {
  const id = randomUUID();
  const safe = file.originalname.replace(/[^\w.\-]+/g, "_");
  const pathname = `${id}-${safe}`;
  let url = "";
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`portfolio/${pathname}`, file.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    url = blob.url;
  } else {
    mkdirSync(uploadDir, { recursive: true });
    writeFileSync(join(uploadDir, pathname), file.buffer);
    const base = (process.env.PUBLIC_FILES_URL ?? (process.env.VERCEL ? "https://aa-files.vercel.app" : "http://localhost:3007")).replace(/\/$/, "");
    url = `${base}/uploads/${pathname}`;
  }
  const item: StoredFile = {
    id,
    url,
    pathname,
    originalName: file.originalname,
    contentType: file.mimetype,
    size: file.size,
    createdAt: new Date().toISOString(),
  };
  const items = readMeta();
  items.unshift(item);
  writeMeta(items);
  return item;
}

export function listFiles() {
  return readMeta();
}

export function getUploadDir() {
  return uploadDir;
}
