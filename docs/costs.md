# What it costs (honestly)

Moving off WordPress doesn't make a website free. It changes *what* you pay for. The money
you stop spending is plugin renewals and paying someone for every small change.

## To build (Part 1)

| Item | Cost | Notes |
|---|---|---|
| Claude Code | Claude Pro, about $20/mo (includes Claude Code) | Or an Anthropic API key, pay per use |
| The builder (`builder/`) | Pay-per-use API | Our tests: **$0.15** for an hours change, **$0.61** for a designed new section. Capped per request (`BUILDER_MAX_USD`, default $2) |
| DataForSEO (keyword data) | Cents per call | Pay-as-you-go. The `seo-research` skill states the cost before it runs, and there's a free sandbox for practice |
| Photos | $0 if you have real ones | Real photos of the real business beat AI images |

## To host

| Option | Cost | Notes |
|---|---|---|
| Vercel Pro | About $20/mo | The free Hobby plan is **non-commercial only**, so a business site needs Pro |
| Cloudflare Pages | $0 | The free plan allows commercial sites. Uses a static export, so redirects go in `public/_redirects` |
| Your domain | What you pay now | Unchanged |

## To run it with an agent (Part 2)

| Item | Cost | Notes |
|---|---|---|
| Small VPS for Hermes | About $9/mo intro, $15/mo at renewal | e.g. Hostinger KVM 2 as of Aug 2026. Check current pricing |
| Model usage | Cents per change | Depends on model and provider. Set a spending limit on your API key |
| DataForSEO checkup | A few cents a month | Weekly or monthly `seo-checkup` |
| GitHub | $0 | A private repo is free |

Prices change, so check each provider before you commit, and set spending limits on every
API key you create.
