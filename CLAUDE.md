# House rules for this website

Any AI agent working on this site reads this file first: Claude Code on a laptop, the
Claude Agent SDK in `builder/`, or a Hermes agent answering the owner on Telegram. Hermes
loads `CLAUDE.md` as project context automatically. Follow these rules for every task.

## What this is

A small-business website built with Next.js and Tailwind. There's no WordPress, no
database, and no plugins. **All content lives in plain files under `content/`**, and
pages only read from them:

| File | What it holds |
|---|---|
| `content/business.json` | Name, phone, email, address, hours, time zone, announcement bar. **The single source of truth for business facts.** |
| `content/menu.json` | Menu sections, items, prices, and which days an item is available. |
| `content/pages/*.md` | Page copy, with `title` and `description` in the front matter. |
| `content/journal/*.md` | Blog posts, with `title`, `description`, `date`, `image`, and `imageAlt`. |
| `content/reviews.json` | Real reviews only, each with a public source link. |
| `content/redirects.json` | Permanent 301 redirects from old URLs. |
| `DESIGN.md` | The design system. Read it before changing anything visual. |

## Rules

1. **Never invent facts.** No made-up reviews, testimonials, prices, awards, statistics,
   staff names, or claims. If something the page needs isn't in `content/`, ask the
   owner. Fake reviews are illegal under the FTC's 2024 rule.
2. **Business facts come from `content/business.json`.** Never hard-code a phone number,
   address, or hours into a page or post. Change the fact in the JSON and every page, the
   footer, and the Google structured data update together.
3. **Change content, not code, whenever you can.** Most requests ("new hours", "add a
   special", "write a post") are edits to files in `content/`. Only touch `src/` for real
   layout or feature changes, and follow `DESIGN.md` when you do.
4. **Run `npm run check` after every change, then `npm run build`.** Fix every error
   before saying you're done. The check explains each problem in plain English.
5. **Every old URL that changes gets a 301** in `content/redirects.json`. Never redirect
   everything to the home page unless there's truly no match.
6. **Images:** put them in `public/images/` with descriptive file names, and always write
   real alt text that says what's in the photo.
7. **No secrets in git.** Keys go in environment variables, never in files. Don't open
   or print `.env` files.
8. **Keep the owner's voice.** Short sentences, warm, specific, no hype words
   ("unparalleled", "elevate", "nestled"). US spelling.
9. **Say what you changed, in plain English**, at the end of every task: which files,
   what changed, and anything you need from the owner.

## Publishing (maintenance agents)

Agents that maintain the live site use the `site-care` skill. The short version: **the
agent edits files; the scripts handle git and publishing; the owner decides what goes
live.**

- `npm run care:propose -- "short description"` checks, builds, commits to a new branch,
  opens a pull request, and prints a **preview link**.
- Send the owner the preview link and a one-line summary. **Wait for an explicit yes.**
- Only after the owner says yes: `npm run care:publish -- <PR number>`.
- To roll back: `npm run care:undo`, then the same yes-then-publish flow.
- Never push to `main` directly, never force-push, and never merge without the owner's yes
  in the current conversation.

## Commands

```bash
npm run dev        # local preview at http://localhost:3000
npm run check      # content guardrails (also runs before every build)
npm run build      # production build
npm run builder    # the Lovable-style chat + preview builder (see builder/README.md)
```
