---
name: site-brief
description: Interview a business owner and turn the answers into the site's content files (business.json, menu or services, page copy). Use at the start of a new site, or when the owner says "set up my website", "here's my business", or pastes notes about their business.
---

# Site brief

This is the "type a prompt, get a website" moment from tools like Lovable, done properly:
the agent asks for real facts first, so nothing on the site is invented.

## Steps

1. **Gather what the owner already has.** Ask them to paste anything useful: an old
   website URL, a Google Business profile, a menu or price list, an "about us"
   paragraph, photos. If there's an old site, read it (read-only) and pull facts from it.
2. **Ask only for what's missing**, in one short list, not one question at a time:
   - Business name, phone, email, street address, and time zone
   - Hours for each day (and which days they're closed)
   - What they sell or offer, with prices if they publish them
   - Who it's for, and what makes them different, in their words
   - Two or three websites they like the feel of
3. **Write the facts into `content/business.json`** (hours as 24-hour `"HH:MM"`) and
   offerings into `content/menu.json` (or a services file if it's not a food business).
4. **Draft page copy** in `content/pages/*.md` using only what the owner told you. Keep
   their voice: short, specific, warm. Each page needs a `title` (65 characters or
   fewer) and a `description` (70–165 characters) in the front matter.
5. **Leave gaps visible.** If a page needs something you don't have, stop and ask. Never
   fill space with invented reviews, awards, years in business, or statistics.
6. Run `npm run check`, fix anything it flags, then summarize for the owner: what you
   filled in, what you still need from them, and the next step (the `build-page` skill
   for design, or `seo-research` to find what customers search for).
