// Loads the site's content from /content at build time.
// Pages never hard-code business facts; they read them from here.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const CONTENT = path.join(process.cwd(), "content");

export type Hours = { day: string; open?: string; close?: string; closed?: boolean };

export type Business = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  fictional?: boolean;
  url: string;
  phone: string;
  email: string;
  address: { street: string; city: string; region: string; postalCode: string; country: string };
  timezone: string;
  hours: Hours[];
  announcement?: { show: boolean; text: string };
  social?: Record<string, string>;
};

export type MenuItem = { name: string; description: string; price: number; daily?: boolean; days?: string[] };
export type MenuSection = { id: string; title: string; note?: string; items: MenuItem[] };

export type Page = {
  slug: string;
  title: string;
  description: string;
  html: string;
  data: Record<string, string>;
};

export type Post = Page & { date: string; image?: string; imageAlt?: string };

function readJSON<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT, file), "utf8")) as T;
}

export function getBusiness(): Business {
  return readJSON<Business>("business.json");
}

export function getMenu(): MenuSection[] {
  return readJSON<{ sections: MenuSection[] }>("menu.json").sections;
}

function readMarkdown(dir: string, slug: string): Page {
  const raw = fs.readFileSync(path.join(CONTENT, dir, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    html: marked.parse(content, { async: false }) as string,
    data: data as Record<string, string>,
  };
}

export function getPage(slug: string): Page {
  return readMarkdown("pages", slug);
}

// Splits a page's markdown into its "## " sections, for layouts that
// place each section in its own card.
export function getSections(slug: string): { heading: string; html: string }[] {
  const raw = fs.readFileSync(path.join(CONTENT, "pages", `${slug}.md`), "utf8");
  const { content } = matter(raw);
  return content
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const [heading, ...rest] = chunk.split("\n");
      return {
        heading: heading.trim(),
        html: marked.parse(rest.join("\n").trim(), { async: false }) as string,
      };
    });
}

export function getPosts(): Post[] {
  const dir = path.join(CONTENT, "journal");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const page = readMarkdown("journal", f.replace(/\.md$/, ""));
      return {
        ...page,
        date: String(page.data.date ?? ""),
        image: page.data.image,
        imageAlt: page.data.imageAlt,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function getRedirects(): { from: string; to: string }[] {
  return readJSON<{ redirects: { from: string; to: string }[] }>("redirects.json").redirects;
}

// "07:00" -> "7am", "14:30" -> "2:30pm"
export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${suffix}` : `${hour}${suffix}`;
}

export function formatPrice(p: number): string {
  return Number.isInteger(p) ? `$${p}` : `$${p.toFixed(2)}`;
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
