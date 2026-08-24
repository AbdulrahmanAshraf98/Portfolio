import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-mauve-gamma-79.vercel.app";
  return [{ url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
