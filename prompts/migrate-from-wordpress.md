# Prompts: moving off WordPress without losing Google

Run these in Claude Code before you rebuild. They only read public data (the WordPress
REST API and the sitemap). **Never give an agent your WordPress admin password.**

## 1. Inventory the old site (read-only)

```
My current website is a WordPress site at [OLD URL]. Read only. Don't log in and don't
change anything there.

Build a complete inventory in a /migration folder:
1. Pull every page and post from the public REST API (/wp-json/wp/v2/pages and
   /wp-json/wp/v2/posts, per_page=100, follow pagination) and every image from
   /wp-json/wp/v2/media.
2. Cross-check against the sitemap (/wp-sitemap.xml, or /sitemap_index.xml with Yoast) and
   list anything in one but not the other.
3. For every URL record: old URL, title, SEO title and meta description (use the
   yoast_head_json field if present), H1, word count, images, and internal links.
4. Save raw content to /migration/raw and a summary table to /migration/inventory.md, with
   a short list at the top of anything that looks abandoned, duplicated, or broken.
```

If the REST API is blocked by a security plugin, use WordPress admin → Tools → Export →
All content, and hand the agent the XML file instead.

## 2. Keep, merge, or retire (you decide)

```
Using /migration/inventory.md, propose a page map: mark every old URL KEEP, MERGE (into
which page), or RETIRE, with a one-line reason. Save it as /migration/page-map.md. Don't
build or delete anything yet.
```

Overrule it where you know better ("keep that page, it gets calls").

## 3. Move the content into this repo's files

```
Following /migration/page-map.md, move the content into content/: business facts into
business.json, pages into content/pages, posts into content/journal. Convert page-builder
markup into clean markdown. Download images into public/images with descriptive names and
real alt text. Only use content from /migration. Don't write new marketing copy.
```

## 4. Redirect every old URL

```
For every old URL that's changing or retired, add a 301 in content/redirects.json pointing
at the best new page. Never send everything to the home page unless there's truly no
match. Then run npm run check. It fails if any redirect points at a page that doesn't exist.
```

## Before you switch the domain

- **Email:** if your old web host also runs your email, look up your MX records first and
  make sure they survive the move.
- **Don't cancel the old host on launch day.** Keep it 2–4 weeks.
- Submit the new sitemap in Google Search Console and watch it for a couple of weeks.
