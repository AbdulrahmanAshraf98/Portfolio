import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join } from "path";
import { randomUUID } from "crypto";
import { seedData } from "../database/seed-data";
import type { PortfolioData, ResourceKey } from "../entities";
import { readCatalogBlob, writeCatalogBlob } from "../persist";

const bundledDir = join(__dirname, "../../data");
const tmpDir = join(tmpdir(), "portfolio-parts");

const PARTS = {
  profile: "profile.json",
  experiences: "experiences.json",
  educations: "educations.json",
  skills: "skills.json",
  projects: "projects.json",
  socialLinks: "socials.json",
  contacts: "contacts.json",
  highlights: "highlights.json",
  settings: "settings.json",
} as const;

function withIds<T extends object>(items: T[], prefix: string) {
  return items.map((item, index) => ({
    id: `${prefix}-${index + 1}`,
    sortOrder: index,
    ...item,
  }));
}

function fromSeed(): PortfolioData {
  return {
    profile: { id: "profile-1", ...seedData.profile },
    experiences: withIds(seedData.experiences, "exp"),
    educations: withIds(seedData.educations, "edu"),
    skills: withIds(seedData.skills, "skill"),
    projects: withIds(seedData.projects, "proj"),
    socialLinks: withIds(seedData.socialLinks, "social"),
    contacts: withIds(seedData.contacts, "contact"),
    highlights: withIds(seedData.highlights, "feat"),
    settings: seedData.settings,
  };
}

function readPart<T>(dir: string, file: string): T | null {
  const path = join(dir, file);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function writePart(dir: string, file: string, value: unknown) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, file), JSON.stringify(value, null, 2));
}

export class JsonStore {
  private cache: PortfolioData | null = null;

  private dirs() {
    return [tmpDir, bundledDir];
  }

  async hydrate() {
    await this.syncFromBlob();
  }

  async syncFromBlob() {
    const blob = await readCatalogBlob();
    if (!blob?.profile) return false;
    await this.replaceAsync({ ...blob, highlights: blob.highlights ?? [] });
    return true;
  }

  load(): PortfolioData {
    if (this.cache) return this.cache;
    const seed = fromSeed();
    const data = { ...seed };
    for (const dir of this.dirs()) {
      const profile = readPart<PortfolioData["profile"]>(dir, PARTS.profile);
      if (profile) data.profile = profile;
      const experiences = readPart<PortfolioData["experiences"]>(dir, PARTS.experiences);
      if (experiences) data.experiences = experiences;
      const educations = readPart<PortfolioData["educations"]>(dir, PARTS.educations);
      if (educations) data.educations = educations;
      const skills = readPart<PortfolioData["skills"]>(dir, PARTS.skills);
      if (skills) data.skills = skills;
      const projects = readPart<PortfolioData["projects"]>(dir, PARTS.projects);
      if (projects) data.projects = projects;
      const socialLinks = readPart<PortfolioData["socialLinks"]>(dir, PARTS.socialLinks);
      if (socialLinks) data.socialLinks = socialLinks;
      const contacts = readPart<PortfolioData["contacts"]>(dir, PARTS.contacts);
      if (contacts) data.contacts = contacts;
      const highlights = readPart<PortfolioData["highlights"]>(dir, PARTS.highlights);
      if (highlights) data.highlights = highlights;
      const settings = readPart<PortfolioData["settings"]>(dir, PARTS.settings);
      if (settings) data.settings = settings;
    }
    if (!Array.isArray(data.settings?.sectionOrder) || data.settings.sectionOrder.length === 0) {
      data.settings = {
        ...data.settings,
        sectionOrder: ["skills", "experience", "projects", "education", "featured", "certificates", "earlier"],
      };
    }
    this.cache = data;
    this.persistLocal(data);
    return data;
  }

  replace(data: PortfolioData) {
    void this.save({ ...data, highlights: data.highlights ?? [] });
  }

  async replaceAsync(data: PortfolioData) {
    await this.save({ ...data, highlights: data.highlights ?? [] });
  }

  snapshot(): PortfolioData {
    return this.load();
  }

  async save(data: PortfolioData) {
    this.cache = data;
    await writeCatalogBlob(data);
    this.persistLocal(data);
  }

  private persistLocal(data: PortfolioData) {
    for (const dir of [tmpDir, bundledDir]) {
      try {
        writePart(dir, PARTS.profile, data.profile);
        writePart(dir, PARTS.experiences, data.experiences);
        writePart(dir, PARTS.educations, data.educations);
        writePart(dir, PARTS.skills, data.skills);
        writePart(dir, PARTS.projects, data.projects);
        writePart(dir, PARTS.socialLinks, data.socialLinks);
        writePart(dir, PARTS.contacts, data.contacts);
        writePart(dir, PARTS.highlights, data.highlights ?? []);
        writePart(dir, PARTS.settings, data.settings);
      } catch {
        /* read-only host */
      }
    }
  }

  portfolio(category?: string) {
    const data = this.load();
    const projects =
      category && category !== "All"
        ? data.projects.filter((project) => project.published && project.categories.includes(category))
        : data.projects.filter((project) => project.published);
    return { ...data, projects };
  }

  list(resource: ResourceKey) {
    const data = this.load();
    if (resource === "profiles") return [data.profile];
    if (resource === "settings") return [data.settings];
    return (this.collection(resource) as { sortOrder?: number }[])
      .slice()
      .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0));
  }

  async create(resource: ResourceKey, input: Record<string, unknown>) {
    const data = this.load();
    if (resource === "profiles" || resource === "settings") {
      return this.update(resource, "singleton", input);
    }
    const item = { id: randomUUID(), sortOrder: 0, ...input };
    this.collection(resource).unshift(item as never);
    await this.save(data);
    return item;
  }

  async update(resource: ResourceKey, id: string, input: Record<string, unknown>) {
    const data = this.load();
    if (resource === "profiles") {
      data.profile = { ...data.profile, ...input, id: data.profile.id };
      await this.save(data);
      return data.profile;
    }
    if (resource === "settings") {
      data.settings = { ...data.settings, ...input };
      await this.save(data);
      return data.settings;
    }
    const items = this.collection(resource) as { id: string }[];
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Not found");
    items[index] = { ...items[index], ...input, id };
    await this.save(data);
    return items[index];
  }

  async remove(resource: ResourceKey, id: string) {
    if (resource === "profiles" || resource === "settings") {
      throw new Error("Cannot delete this resource");
    }
    const data = this.load();
    const key = this.collectionKey(resource);
    (data[key] as { id: string }[]) = (data[key] as { id: string }[]).filter((item) => item.id !== id);
    await this.save(data);
    return { ok: true };
  }

  private collectionKey(resource: ResourceKey): keyof PortfolioData {
    const map: Record<Exclude<ResourceKey, "profiles" | "settings">, keyof PortfolioData> = {
      experiences: "experiences",
      educations: "educations",
      skills: "skills",
      projects: "projects",
      socials: "socialLinks",
      contacts: "contacts",
      highlights: "highlights",
    };
    return map[resource as Exclude<ResourceKey, "profiles" | "settings">];
  }

  private collection(resource: ResourceKey) {
    const data = this.load();
    return data[this.collectionKey(resource)] as unknown[];
  }
}

export const jsonStore = new JsonStore();
