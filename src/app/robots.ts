import type { MetadataRoute } from "next";
import { getBusiness } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const b = getBusiness();
  // The demo business is fictional, so keep it out of search results.
  // Set "fictional": false in content/business.json for a real site.
  return {
    rules: b.fictional ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" },
    sitemap: `${b.url}/sitemap.xml`,
  };
}
