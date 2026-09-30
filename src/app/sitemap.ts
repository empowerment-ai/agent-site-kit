import type { MetadataRoute } from "next";
import { getBusiness, getPosts } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBusiness().url;
  const pages = ["", "/menu", "/about", "/visit", "/journal"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const posts = getPosts().map((p) => ({
    url: `${base}/journal/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
  return [...pages, ...posts];
}
