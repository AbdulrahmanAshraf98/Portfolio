import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join } from "path";
import { put } from "@vercel/blob";

export type AdminRecord = {
  email: string;
  passwordHash: string;
};

export type ApiKeyRecord = {
  id: string;
  prefix: string;
  hash: string;
  createdAt: string;
  revokedAt: string | null;
};

const bundledAdmin = join(__dirname, "../data/admin.json");
const bundledKeys = join(__dirname, "../data/keys.json");
const tmpAdmin = join(tmpdir(), "portfolio-admin.json");
const tmpKeys = join(tmpdir(), "portfolio-keys.json");

function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function writeJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2));
}

async function writeBlob(name: string, value: unknown) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  await put(`identity/${name}.json`, JSON.stringify(value, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

async function readBlob<T>(name: string): Promise<T | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: `identity/${name}.json`, token });
    const match = blobs.find((item) => item.pathname === `identity/${name}.json`) ?? blobs[0];
    if (!match) return null;
    const response = await fetch(match.url);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export const identityStore = {
  async hydrate() {
    const admin = await readBlob<AdminRecord>("admin");
    const keys = await readBlob<ApiKeyRecord[]>("keys");
    if (admin?.passwordHash) this.writeAdmin(admin);
    if (keys) this.writeKeys(keys);
  },

  readAdmin(): AdminRecord {
    for (const path of [tmpAdmin, bundledAdmin]) {
      if (existsSync(path)) return readJson<AdminRecord>(path, { email: "", passwordHash: "" });
    }
    return { email: (process.env.ADMIN_EMAIL ?? "").toLowerCase().trim(), passwordHash: "" };
  },

  readKeys(): ApiKeyRecord[] {
    for (const path of [tmpKeys, bundledKeys]) {
      if (existsSync(path)) return readJson<ApiKeyRecord[]>(path, []);
    }
    return [];
  },

  writeAdmin(admin: AdminRecord) {
    for (const path of [tmpAdmin, bundledAdmin]) {
      try {
        writeJson(path, admin);
      } catch {
        /* read-only host */
      }
    }
    void writeBlob("admin", admin);
  },

  writeKeys(keys: ApiKeyRecord[]) {
    for (const path of [tmpKeys, bundledKeys]) {
      try {
        writeJson(path, keys);
      } catch {
        /* read-only host */
      }
    }
    void writeBlob("keys", keys);
  },
};
