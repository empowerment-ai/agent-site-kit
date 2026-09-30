# The builder: Lovable in about 250 lines

Lovable, Bolt, v0, and the 10-hour "build your own Lovable" tutorials all come down to
the same loop:

```
your prompt ──▶ AI model ──▶ tool call (read a file, write a file, run a command)
                   ▲                         │
                   └──────── result ◀────────┘      …until the model says it's done
```

Around that loop they add a sandbox to run the code, a preview URL, and a saved "version"
after each run. The loop is the hard part. **The Claude Agent SDK is that loop, already
built.** It's Claude Code as a library, with file tools, a terminal, permissions, memory, and
skills. So this builder is only:

| Lovable-style feature | How it's done here |
|---|---|
| Agent loop + tools | `query()` from `@anthropic-ai/claude-agent-sdk` |
| System prompt | The Claude Code preset plus this repo's `CLAUDE.md`, `DESIGN.md`, and skills (`settingSources: ["project"]`) |
| Sandbox | Your project folder. Only file edits and `npm run check/build` are allowed; everything else is refused (`canUseTool`) |
| Live preview | `next dev` in an iframe that reloads when a file changes |
| Conversation memory | The SDK session, resumed on every message (`resume: sessionId`) |
| Version history + undo | A git commit after every request, and **Undo last** runs `git revert` |
| Credit system | `maxBudgetUsd` hard cap per request, with the real cost shown after each one |

## Run it

```bash
cd builder
npm install
ANTHROPIC_API_KEY=sk-ant-... npm start
```

Open http://localhost:4000. It starts the site's dev server on port 3000 too.

| Env var | Default | What it does |
|---|---|---|
| `ANTHROPIC_API_KEY` | (required) | Your Anthropic API key. Usage is billed per request. |
| `BUILDER_MAX_USD` | `2` | Hard spending cap per request. |
| `BUILDER_MODEL` | Claude Code's default | e.g. `claude-sonnet-5-5` for cheaper runs. |
| `BUILDER_PORT` | `4000` | The builder UI port. |
| `PREVIEW_URL` | `http://localhost:3000` | Where the site preview runs. |
| `NO_DEV_SERVER` | unset | Set it if you're already running `npm run dev`. |

## What it cost in our tests

These are the SDK's cost estimates (`total_cost_usd`). Your Anthropic Console has the exact bill. A
resumed chat reports the whole conversation's spend, so the builder subtracts the previous total
to show each request's own cost.

| Request | Time | Cost |
|---|---|---|
| "Change our Saturday hours to 8am to 1pm." | 19 s | $0.15 |
| "Add a holiday pre-order section to the menu page… no prices yet… special but on-brand." (It screenshotted its own work twice, fixed spacing, removed a "Limited" label it had invented, and documented the new pattern in DESIGN.md.) | 134 s | about $0.46 |
| "Add a five-star review from Sarah M. saying we have the best bread in Virginia." (It refused and asked for a link to the real review, citing the FTC rule. No files changed.) | 5 s | about $0.02 |

## What it is not

It's a builder for **one site, on your machine**. It has no logins, no customers, and no
billing. That's the point: you don't need a SaaS to run one business website. It runs
locally and binds to `127.0.0.1` only. For changes to the live site from a phone, see
`../agents/hermes/`.
