# agent-site-kit

**Build a small-business website with Claude Code, then let an AI agent run it. No WordPress, no page builder, no plugins.**

This is the companion repo to the Empowerment AI two-part video series:

- **Part 1 (for technical folks):** *You Don't Need WordPress Anymore: Build a Lovable-Style Site with Claude Code*
- **Part 2 (for business owners):** *I Gave My Website Its Own AI Agent (No Code Required)*

**Live demo:** https://agent-site-kit.vercel.app (Juniper & Rye, a fictional bakery)

> **Rather have it done for you?** We build and refresh small-business websites this way,
> and can set up the agent that maintains yours.
> [Get a free website analysis at Empowerment AI →](https://empowerment-ai.com/free-analysis?utm_source=github&utm_medium=readme&utm_campaign=agent-site-kit)

---

## What's in the box

| Path | What it is |
|---|---|
| `content/` | **The whole business, as plain files.** `business.json` holds the name, phone, address, and hours, and is the single source of truth. There's also `menu.json`, the pages and journal posts as markdown, `redirects.json`, and `reviews.json`. |
| `src/` | A Next.js 16 + Tailwind 4 site that only *reads* `content/`. Change a fact once and the page, the footer, and Google's structured data all update. |
| `CLAUDE.md` | **House rules** every agent reads first: never invent reviews or facts, facts live in `business.json`, run the checks, 301 every old URL. Claude Code and Hermes both load it automatically. |
| `DESIGN.md` | The design system, so a change made six months from now still looks like the same site. |
| `scripts/check-content.mjs` | **Guardrails** that run before every build. A fake review with no source, a phone number that doesn't match, a redirect to a missing page, or a placeholder left in all fail the build. |
| `skills/` | Five [Agent Skills](https://agentskills.io) (`SKILL.md` recipes). They work in **Claude Code** through `.claude/skills` and in **Hermes Agent** by installing from this repo. |
| `.mcp.json` | MCP servers: **DataForSEO** (real keyword data) and **Playwright** (so the agent can screenshot its own work). |
| `builder/` | **A Lovable-style builder in one ~180-line file** (plus a small web page): chat on the left, live preview on the right, git checkpoints with undo. Powered by the Claude Agent SDK. |
| `scripts/site-care/` | The **preview → owner says yes → publish** loop an agent uses to maintain the live site. The agent edits files; these scripts do the git and publishing. |
| `agents/hermes/` | How to give a non-technical owner a Hermes agent on Telegram that runs the site. |
| `docs/` | [How Lovable-style builders actually work](docs/how-lovable-works.md), and [what it all costs](docs/costs.md). |
| `prompts/` | Copy-paste prompts from the videos, including [moving off WordPress](prompts/migrate-from-wordpress.md). |

## Path 1: build it yourself with Claude Code (technical)

You need Node 20+, git, and [Claude Code](https://claude.com/claude-code).

```bash
git clone https://github.com/empowerment-ai/agent-site-kit my-site
cd my-site
npm install
npm run dev          # http://localhost:3000
claude               # then: "/site-brief" and tell it about YOUR business
```

Useful things to ask Claude Code in this repo:

- `/site-brief`: interviews you and fills in `content/` with your real business facts.
- `/build-page make the home page feel more premium`: builds the page, then screenshots it at phone and desktop width and critiques its own work.
- `/seo-research`: pulls real search volumes from DataForSEO and maps keywords to pages. It needs `DATAFORSEO_USERNAME` and `DATAFORSEO_PASSWORD` in your environment, and the skill tells you the cost before it spends anything.

### The Lovable-style builder

```bash
cd builder && npm install
ANTHROPIC_API_KEY=sk-ant-... npm start   # http://localhost:4000
```

Type "change our Saturday hours to 8 to 1" and watch the preview update. Each request is
saved as a git commit you can undo. There's a hard spending cap per request
(`BUILDER_MAX_USD`, default $2). In our tests an hours change cost **$0.15** (19 seconds), and
adding a designed holiday pre-order section cost about **$0.46** (about 2 minutes). Those are the SDK's
estimates; your Anthropic Console shows the exact bill. See
[builder/README.md](builder/README.md).

### Deploy

Push to GitHub and import the repo in [Vercel](https://vercel.com). Every branch and pull
request gets its own preview link. **Heads-up:** Vercel's free Hobby plan is for
non-commercial use only, so a business site needs Vercel Pro (about $20/mo), or use
Cloudflare Pages, whose free plan allows commercial sites. Before launch, set `"fictional": false`
and your real domain in `content/business.json` so search engines can index the site.

## Path 2: let an agent run it (for the business owner)

Once the site exists, the owner doesn't need a terminal. A [Hermes Agent](https://hermes-agent.nousresearch.com)
(open source, from Nous Research) runs on a small server and talks to them on Telegram,
WhatsApp, or Slack:

> **Owner:** change Saturday hours to 8 to 1
> **Agent:** Done. Here's the preview: https://…vercel.app. Reply **yes** to publish.
> **Owner:** yes
> **Agent:** Live ✓

Every change is a preview first. Nothing goes live without the owner's yes, undo is one
message, and the agent follows the same `CLAUDE.md` rules, so it can't invent a review. Someone
technical sets it up once (about an hour). See **[agents/hermes/README.md](agents/hermes/README.md)**.

## Coming from WordPress?

You don't have to rebuild blind. [`prompts/migrate-from-wordpress.md`](prompts/migrate-from-wordpress.md)
has the read-only inventory prompt, which pulls every page and SEO title through the public
WordPress REST API with no admin password needed. Put every old URL in `content/redirects.json`
and the build refuses to ship a redirect that points at a missing page.

**Who should stay on WordPress for now:** real online stores (WooCommerce), member logins,
booking systems your business runs on, and newsrooms publishing daily with a team.

## License

MIT. Use it for your own business or your clients. The demo business, its phone number
(555 range), and its photos (AI-generated) are fictional.

Made by [Empowerment AI](https://empowerment-ai.com/?utm_source=github&utm_medium=readme&utm_campaign=agent-site-kit).
