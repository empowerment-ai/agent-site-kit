# How Lovable-style website builders actually work

…and why you already have the hard part.

## The loop

Every "type a sentence, get an app" tool (Lovable, Bolt, v0, Replit Agent) runs the same
loop underneath:

```
            ┌──────────────────────────────────────────────┐
 prompt ──▶ │  AI model decides the next step              │
            │     │                                        │
            │     ▼                                        │
            │  tool call: run a command / write a file /   │
            │             read a file                      │
            │     │                                        │
            │     ▼                                        │
            │  result goes back to the model ──────────────┼──▶ repeat
            └──────────────────────────────────────────────┘
                     │ model answers without a tool call
                     ▼
             done → show preview → save a version
```

Around the loop they add: a **sandbox** where the code runs, a **preview URL**, a
**saved version** after each run, **memory** of the conversation, and a **billing** system.

## The 10-hour version

Code With Antonio's excellent course *"Build and Deploy a SaaS AI Website Builder
(Lovable clone)"* (10h 34m, June 2025) builds all of that by hand: Next.js, tRPC,
Prisma and Neon, Inngest background jobs and AgentKit, E2B cloud sandboxes from a custom
Docker template, Clerk auth and billing. It's worth watching if you want to *sell* a
builder. Some things it shows about building the loop yourself:

- The agent gets exactly **three tools**: `terminal`, `createOrUpdateFiles`, and `readFiles`.
- The model is told to end with a special summary block, because *"this is the only
  way to terminate the task,"* plus a 15-step cap, *"because you will use all of my OpenAI
  credits."*
- Memory is the **last 5 chat messages**. Each run starts from a fresh sandbox, so a
  follow-up request rebuilds from the chat rather than editing the files that exist.
- Previews **expire after 5 minutes** on the default sandbox plan.
- By our count, about **2h20m** of the 10h34m is the AI engine. The rest is plumbing, UI,
  auth, and billing.

## The same pieces, already built

| Hand-built in a Lovable clone | What you get with Claude Code (this repo) |
|---|---|
| Agent loop, router, iteration cap | Built in. `maxTurns` and `maxBudgetUsd` in the SDK |
| "Only way to terminate" summary hack | Not needed. The loop ends when the model stops calling tools |
| `terminal` tool | Bash (limited here to `npm run check`/`build`) |
| `createOrUpdateFiles` (whole-file rewrites) | Write and **Edit** (targeted edits, so small diffs) |
| `readFiles` | Read, Glob, Grep |
| Hand-written system prompt | `CLAUDE.md` house rules + `DESIGN.md` + skills |
| Docker template with the framework pre-installed | This repo |
| Cloud sandbox | Your project folder plus permission rules (see "What doesn't map" below) |
| Preview URL (expires) | `npm run dev` locally, and a Vercel preview link per branch that doesn't expire |
| Saved "fragments" (URL + files JSON) | Git commits (the builder commits after every request) |
| Memory = last 5 messages | Real files that persist, plus a resumable session |
| Inngest trace UI | The tool-call feed in the builder / Claude Code transcript |
| Credits + Clerk billing | Your Claude plan or API key, with a per-request cap |

## What doesn't map (honestly)

- **It's for one site, not thousands of users.** No customer logins, no billing. That's
  fine: a business needs a website, not a website-builder startup.
- **No container by default.** The agent works in your real folder. The builder limits it
  to file edits and two npm commands; Claude Code asks before anything else. Use git (every
  change is a commit) and review diffs.
- **Localhost isn't shareable.** Push a branch and Vercel gives you a shareable preview link.
- **Nothing runs after you close it.** For a site that's maintained while you're away, use
  an always-on agent like Hermes (see `agents/hermes/`).
