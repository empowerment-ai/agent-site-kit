#!/usr/bin/env node
// Content guardrails. Runs before every build (`prebuild`), so a bad edit,
// from a person or an agent, fails the deploy instead of reaching visitors.
//
//   npm run check
//
// Each rule prints a plain-English reason so an agent can fix it on its own.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const C = (...p) => path.join(ROOT, "content", ...p);
const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);
const readJSON = (f) => JSON.parse(fs.readFileSync(C(f), "utf8"));

// ---------- business.json: the single source of truth ----------
const business = readJSON("business.json");
for (const key of ["name", "phone", "email", "url", "timezone", "address", "hours"]) {
  if (!business[key]) fail(`business.json is missing "${key}".`);
}
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
if (Array.isArray(business.hours)) {
  const days = business.hours.map((h) => h.day);
  if (days.join() !== DAYS.join()) fail(`business.json hours must list all 7 days in order, Monday first. Found: ${days.join(", ")}`);
  for (const h of business.hours) {
    if (h.closed) continue;
    if (!TIME.test(h.open ?? "") || !TIME.test(h.close ?? "")) fail(`${h.day} hours must be 24-hour "HH:MM" (e.g. "07:00", "14:00"). Got open="${h.open}" close="${h.close}".`);
    else if (h.open >= h.close) fail(`${h.day} opens at ${h.open} but closes at ${h.close}. Closing time must be after opening time.`);
  }
}

// ---------- menu.json ----------
const menu = readJSON("menu.json");
for (const s of menu.sections ?? []) {
  for (const item of s.items ?? []) {
    if (!item.name || !item.description) fail(`Menu item in "${s.title}" needs a name and a description.`);
    if (typeof item.price !== "number" || item.price <= 0) fail(`Menu item "${item.name}" needs a price greater than 0 (a number, no $ sign).`);
    for (const d of item.days ?? []) if (!DAYS.includes(d)) fail(`Menu item "${item.name}" lists an unknown day "${d}".`);
  }
}

// ---------- reviews.json: never invent reviews ----------
const { reviews = [] } = readJSON("reviews.json");
for (const r of reviews) {
  if (!/^https:\/\//.test(r.source ?? "")) fail(`Review by "${r.author ?? "unknown"}" has no public source link. Only real reviews with a source URL can be published (FTC rule on fake reviews).`);
  if (!r.author || !r.date || !r.text) fail(`Every review needs author, date, and text.`);
}

// ---------- pages and journal posts ----------
const routes = new Set(["/", "/menu", "/about", "/visit", "/journal"]);
const mdFiles = [];
for (const dir of ["pages", "journal"]) {
  for (const f of fs.readdirSync(C(dir)).filter((f) => f.endsWith(".md"))) {
    mdFiles.push({ dir, file: f, full: C(dir, f) });
    if (dir === "journal") routes.add(`/journal/${f.replace(/\.md$/, "")}`);
  }
}

const PLACEHOLDER = /\b(TODO|TBD|lorem ipsum|FIXME)\b|\[(BUSINESS|NAME|PHONE|ADDRESS)[^\]]*\]/i;
const UNSAFE_HTML = /<\s*(script|iframe|style|object|embed|form)\b|\son[a-z]+\s*=|javascript:/i;
const PHONE = /\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g;
const digits = (s) => s.replace(/\D/g, "");

for (const { dir, file, full } of mdFiles) {
  const where = `content/${dir}/${file}`;
  const { data, content } = matter(fs.readFileSync(full, "utf8"));
  const title = String(data.title ?? "");
  const desc = String(data.description ?? "");

  if (!title) fail(`${where}: missing "title" in the front matter.`);
  else if (title.length > 65) fail(`${where}: title is ${title.length} characters. Keep it to 65 or fewer so Google doesn't cut it off.`);
  if (!desc) fail(`${where}: missing "description" in the front matter.`);
  else if (desc.length < 70 || desc.length > 165) fail(`${where}: description is ${desc.length} characters. Aim for 70 to 165.`);

  if (dir === "journal" && !/^\d{4}-\d{2}-\d{2}$/.test(String(data.date ?? ""))) fail(`${where}: journal posts need a "date" like "2026-09-24".`);

  const all = `${JSON.stringify(data)}\n${content}`;
  if (PLACEHOLDER.test(all)) fail(`${where}: contains placeholder text (${all.match(PLACEHOLDER)[0]}). Replace it with real content or ask the owner.`);
  if (UNSAFE_HTML.test(content)) fail(`${where}: contains raw HTML that isn't allowed in content files (scripts, iframes, forms, inline event handlers). Use plain markdown.`);

  for (const m of content.match(PHONE) ?? []) {
    if (digits(m).slice(-10) !== digits(business.phone).slice(-10)) {
      fail(`${where}: mentions phone number ${m}, but business.json says ${business.phone}. Business facts live in content/business.json. Don't hard-code a different one.`);
    }
  }

  // Images: file must exist and have alt text
  const images = [];
  if (data.image) images.push({ src: data.image, alt: data.imageAlt });
  if (data.heroImage) images.push({ src: data.heroImage, alt: data.heroImageAlt });
  for (const m of content.matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)) images.push({ src: m[2], alt: m[1] });
  for (const img of images) {
    if (!img.alt || !String(img.alt).trim()) fail(`${where}: image ${img.src} has no alt text. Describe what's in the photo.`);
    if (img.src.startsWith("/") && !fs.existsSync(path.join(ROOT, "public", img.src))) fail(`${where}: image ${img.src} doesn't exist in /public.`);
  }

  // Internal links must point at real pages
  for (const m of content.matchAll(/\]\((\/[^)\s#]*)/g)) {
    const href = m[1].replace(/\/$/, "") || "/";
    if (!href.startsWith("/images/") && !routes.has(href)) fail(`${where}: links to ${href}, which isn't a page on this site.`);
  }
}

// ---------- redirects: never send Google to a 404 ----------
const { redirects = [] } = readJSON("redirects.json");
const froms = new Set();
for (const r of redirects) {
  if (!r.from?.startsWith("/") || !r.to?.startsWith("/")) { fail(`Redirect ${r.from} -> ${r.to}: both sides must start with "/".`); continue; }
  if (froms.has(r.from)) fail(`Redirect from ${r.from} is listed twice.`);
  froms.add(r.from);
  if (routes.has(r.from)) fail(`Redirect from ${r.from} would hide a real page. Remove the redirect or the page.`);
  if (!routes.has(r.to)) fail(`Redirect ${r.from} -> ${r.to}: the destination page doesn't exist. Point it at a real page.`);
}
for (const r of redirects) if (froms.has(r.to)) warn(`Redirect ${r.from} -> ${r.to} chains into another redirect. Point it straight at the final page.`);

// ---------- report ----------
const checked = `${mdFiles.length} pages and posts, ${redirects.length} redirects, ${reviews.length} reviews`;
for (const w of warnings) console.log(`  ! ${w}`);
if (errors.length) {
  console.error(`\n✗ Content check failed (${errors.length} problem${errors.length > 1 ? "s" : ""}):\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error("\nFix these, then run `npm run check` again.\n");
  process.exit(1);
}
console.log(`✓ Content check passed: ${checked}.`);
