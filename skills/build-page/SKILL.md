---
name: build-page
description: Design or redesign a page (or a section of one) following DESIGN.md, then screenshot it at phone and desktop width and critique it before showing the owner. Use for "make the homepage look better", "add a section", "build the menu page", or any visual change.
---

# Build a page, then check your own work

## Before you start

- Read `DESIGN.md` and `src/app/globals.css`. Use only the existing color tokens, fonts,
  and components. Don't add a new color or font without asking.
- Content comes from `content/`. Layout code in `src/` reads it; it never hard-codes facts.

## Build

1. Make the change in the smallest set of files that does the job.
2. Mobile first: it must work at 390px wide with no sideways scrolling.
3. Every image needs real alt text. Every button needs a clear label.

## Critique (don't skip this)

1. Start the site (`npm run dev`) if it isn't running.
2. Take screenshots at **390px** and **1440px** wide. Use the Playwright MCP tools
   (`browser_resize`, then `browser_take_screenshot` with `fullPage: true`) if they're
   connected; otherwise ask the owner to check the preview.
3. Look at the screenshots critically, like a designer would:
   - Does anything overflow, overlap, or look cramped at 390px?
   - Is there one clear primary action per screen?
   - Is text readable against its background (no muted text on dark panels)?
   - Does it still look like the rest of the site (DESIGN.md)?
4. Fix what you find, screenshot again, and only then show the owner.
5. If you set a rule worth keeping (a new component or pattern), add it to `DESIGN.md`.

Finish with `npm run check` and `npm run build`, then summarize the change in plain English.
