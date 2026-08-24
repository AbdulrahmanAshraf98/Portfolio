import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join } from "path";
import { randomUUID } from "crypto";
import { list, put } from "@vercel/blob";

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  imageUrl: string;
  fileUrl: string;
  sortOrder: number;
};

const bundled = join(__dirname, "../data/certificates.json");
const tmp = join(tmpdir(), "certificates.json");

const seed: Certificate[] = [
  {
    id: "cert-1",
    title: "Microservices: Clean Architecture, DDD, SAGA, Outbox & Kafka",
    issuer: "Udemy",
    issueDate: "Oct 2025",
    credentialUrl: "https://www.udemy.com/certificate/UC-297857f8-c8ac-4b6d-8b24-b23bd5040309/",
    imageUrl: "/certificates/microservices-udemy.jpg",
    fileUrl: "/certificates/microservices-udemy.jpg",
    sortOrder: 0,
  },
  {
    id: "cert-2",
    title: "Fundamentals of Database Engineering",
    issuer: "Udemy",
    issueDate: "Oct 2025",
    credentialUrl: "https://www.udemy.com/certificate/UC-dca0721b-87bf-4773-9164-a4a287147e26/",
    imageUrl: "/certificates/database-engineering-udemy.jpg",
    fileUrl: "/certificates/database-engineering-udemy.jpg",
    sortOrder: 1,
  },
  {
    id: "cert-3",
    title: "Data Structures",
    issuer: "Metwally Labs",
    issueDate: "Aug 2025",
    credentialUrl: "https://www.linkedin.com/in/abdulrahmanashraf98/details/certifications/",
    imageUrl: "",
    fileUrl: "",
    sortOrder: 2,
  },
  {
    id: "cert-4",
    title: "Algorithms Analysis and Design",
    issuer: "Metwally Labs",
    issueDate: "Apr 2025",
    credentialUrl: "https://www.linkedin.com/in/abdulrahmanashraf98/details/certifications/",
    imageUrl: "/certificates/algorithms-metwally.jpg",
    fileUrl: "/certificates/algorithms-metwally.jpg",
    sortOrder: 3,
  },
  {
    id: "cert-5",
    title: "MEAN Stack Diploma",
    issuer: "Orange Digital Center Egypt",
    issueDate: "Jan 2023",
    credentialUrl: "https://www.linkedin.com/in/abdulrahmanashraf98/details/certifications/",
    imageUrl: "/certificates/mean-stack-orange.jpg",
    fileUrl: "/certificates/mean-stack-orange.jpg",
    sortOrder: 4,
  },
  {
    id: "cert-6",
    title: "Intermediate SQL Queries",
    issuer: "DataCamp",
    issueDate: "Mar 2021",
    credentialUrl: "https://www.datacamp.com/statement-of-accomplishment/course/05a77866774d5cef369a8530a2badcd25a679659",
    imageUrl: "https://www.datacamp.com/statement-of-accomplishment/badge/course/05a77866774d5cef369a8530a2badcd25a679659.png",
    fileUrl: "",
    sortOrder: 5,
  },
  {
    id: "cert-7",
    title: "Technical Support Fundamentals",
    issuer: "Google",
    issueDate: "Jan 2020",
    credentialUrl: "https://www.coursera.org/share/104b7020c46db144df2305bbcd1273c2",
    imageUrl: "",
    fileUrl: "https://www.coursera.org/share/104b7020c46db144df2305bbcd1273c2",
    sortOrder: 6,
  },
  {
    id: "cert-8",
    title: "How to Build Chatbots",
    issuer: "Cognitive Class",
    issueDate: "Jun 2019",
    credentialUrl: "https://courses.cognitiveclass.ai/certificates/93a6dc8238e94e1cbff630310fbaa9b6",
    imageUrl: "",
    fileUrl: "https://courses.cognitiveclass.ai/certificates/93a6dc8238e94e1cbff630310fbaa9b6",
    sortOrder: 7,
  },
  {
    id: "cert-9",
    title: "Android Development",
    issuer: "Udacity",
    issueDate: "Apr 2019",
    credentialUrl: "https://drive.google.com/file/d/1sKuhrGW266ywgYZCf9G24hqjQsrIjJoT/view",
    imageUrl: "https://drive.google.com/thumbnail?id=1sKuhrGW266ywgYZCf9G24hqjQsrIjJoT&sz=w1600",
    fileUrl: "https://drive.google.com/file/d/1sKuhrGW266ywgYZCf9G24hqjQsrIjJoT/view",
    sortOrder: 8,
  },
  {
    id: "cert-10",
    title: "HTML and CSS for Beginners - Build a Website & Launch ONLINE",
    issuer: "Udemy",
    issueDate: "Jan 2019",
    credentialUrl: "https://drive.google.com/file/d/1_d31HyEBbseIWmy8EzudLb1lci4-KRqd/view",
    imageUrl: "https://drive.google.com/thumbnail?id=1_d31HyEBbseIWmy8EzudLb1lci4-KRqd&sz=w1600",
    fileUrl: "https://drive.google.com/file/d/1_d31HyEBbseIWmy8EzudLb1lci4-KRqd/view",
    sortOrder: 9,
  },
];

function read(): Certificate[] {
  for (const path of [tmp, bundled]) {
    if (existsSync(path)) return JSON.parse(readFileSync(path, "utf8")) as Certificate[];
  }
  return seed;
}

const BLOB_NAME = "certificates/certificates.json";

async function readBlob(): Promise<Certificate[] | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  try {
    const { blobs } = await list({ prefix: BLOB_NAME, token });
    const match = blobs.find((item) => item.pathname === BLOB_NAME) ?? blobs[0];
    if (!match) return null;
    const response = await fetch(match.url);
    if (!response.ok) return null;
    return (await response.json()) as Certificate[];
  } catch {
    return null;
  }
}

function write(items: Certificate[]) {
  for (const path of [tmp, bundled]) {
    try {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, JSON.stringify(items, null, 2));
    } catch {
      /* read-only */
    }
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    void put(BLOB_NAME, JSON.stringify(items, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  }
}

const EXCLUDED_CERTS = new Set(["cert-11", "cert-12"]);

export const certStore = {
  async hydrate() {
    const blob = await readBlob();
    if (!blob?.length) {
      write(seed);
      return;
    }
    const byId = new Map(seed.map((item) => [item.id, item]));
    const mapped = blob
      .filter((item) => !EXCLUDED_CERTS.has(item.id))
      .map((item) => {
      const next = byId.get(item.id);
      if (!next) return item;
      const genericTitle = !item.title || item.title === item.issuer;
      return {
        ...item,
        title: genericTitle ? next.title : item.title,
        issuer: item.issuer || next.issuer,
        imageUrl: item.imageUrl || next.imageUrl,
        fileUrl: item.fileUrl || next.fileUrl,
        credentialUrl: item.credentialUrl || next.credentialUrl,
      };
    });
    const have = new Set(mapped.map((item) => item.id));
    write([...mapped, ...seed.filter((item) => !have.has(item.id))]);
  },
  list() {
    return read().sort((a, b) => a.sortOrder - b.sortOrder);
  },
  create(input: Partial<Certificate>) {
    const items = read();
    const item: Certificate = {
      id: randomUUID(),
      title: String(input.title ?? ""),
      issuer: String(input.issuer ?? ""),
      issueDate: String(input.issueDate ?? ""),
      credentialUrl: String(input.credentialUrl ?? ""),
      imageUrl: String(input.imageUrl ?? ""),
      fileUrl: String(input.fileUrl ?? ""),
      sortOrder: Number(input.sortOrder ?? 0),
    };
    items.unshift(item);
    write(items);
    return item;
  },
  update(id: string, input: Partial<Certificate>) {
    const items = read();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Not found");
    items[index] = { ...items[index], ...input, id };
    write(items);
    return items[index];
  },
  remove(id: string) {
    write(read().filter((item) => item.id !== id));
    return { ok: true };
  },
};
