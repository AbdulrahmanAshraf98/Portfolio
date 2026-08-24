import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aa-web-abdulrahmanashraf98s-projects.vercel.app";
  return [{ url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
