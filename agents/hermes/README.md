# Give the owner an AI agent that runs the site

This is **Part 2** of the video series. The site is built (Part 1). Now the owner, who will
never open a terminal, gets an assistant on their phone:

> **Owner:** new special this week, pumpkin cardamom buns, $5.50. here's a photo 📷
> **Agent:** Added to the menu with your photo. Preview: https://…vercel.app/menu. Reply **yes** to publish.
> **Owner:** yes
> **Agent:** Live ✓. Say "undo" anytime.

We use [Hermes Agent](https://hermes-agent.nousresearch.com), an open-source (MIT) agent from
Nous Research. It runs 24/7 on a small server, talks over Telegram, WhatsApp, Slack,
Discord, Signal, or email, can use Claude as its model, runs scheduled jobs, and uses the **same
`SKILL.md` format and the same `CLAUDE.md` house rules** as Claude Code. One repo serves both.

## How it fits together

```
 Owner's phone ──Telegram──▶ Hermes agent (small VPS)
                                   │  reads CLAUDE.md house rules + site-care skill
                                   │  edits content/ files in its copy of the repo
                                   ▼
                     npm run care:propose ──▶ GitHub pull request ──▶ Vercel preview link
                                   │                                         │
 Owner: "yes" ◀── preview link ────┘                                         │
        │                                                                    │
        └──▶ npm run care:publish ──▶ merge to main ──▶ Vercel deploys ──▶ live site
```

## The guardrails (read this part)

1. **Preview first, always.** Every change becomes a pull request with its own preview
   link. The agent is instructed to publish only after an explicit "yes" from the owner.
2. **The agent never runs git itself.** It edits files; the fixed `care:*` scripts do the
   committing, pushing, and merging, the same way every time.
3. **Broken changes can't publish.** `npm run check` and the build run before every
   preview. An invented review, a mismatched phone number, or a redirect to nowhere fails.
4. **One-message undo.** "Undo that" makes a revert with its own preview.
5. **Least privilege.** The GitHub token is fine-grained and reaches **this one repository**.
   Only the owner's Telegram user ID can talk to the agent. The agent has no access to DNS,
   the domain registrar, billing, or passwords.
6. **Want a hard lock instead of a rule?** In GitHub, protect `main` and require one
   approving review. The owner then taps **Approve** in the GitHub mobile app, and
   `care:publish` can't merge until they do.

## Setup (someone technical, about an hour, once)

### 1. A server for the agent

Any small Linux VPS works. The simplest is Hostinger's one-click Hermes Agent VPS. A 2 vCPU /
8 GB box is plenty for one business, and about $9/mo intro and $15/mo at renewal as of
Aug 2026 (check current pricing). Or install it yourself:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes model          # choose Anthropic (Claude) with an API key, or another provider
```

Make sure the server has `git` and **Node 20+** (`node -v`), since the site-care scripts and the
site build need them.

### 2. A Telegram bot for the owner

1. In Telegram, message **@BotFather**, send `/newbot`, and copy the token.
2. The owner messages **@userinfobot** to get their numeric user ID.
3. Add both to `~/.hermes/.env`:

   ```bash
   TELEGRAM_BOT_TOKEN=123456:ABC...
   TELEGRAM_ALLOWED_USERS=987654321     # the owner (plus yours, comma-separated)
   ```

4. Run `hermes gateway setup` and pick Telegram, then start the gateway.

Voice memos work too. Hermes transcribes them (see the Hermes Telegram docs for the speech-to-text
options).

### 3. A GitHub token that can only touch this site

GitHub → Settings → Developer settings → **Fine-grained tokens** → *Only select
repositories* → pick the site repo. Permissions: **Contents: Read and write**, **Pull requests:
Read and write**, **Deployments: Read-only**. Add it to `~/.hermes/.env`:

```bash
GITHUB_TOKEN=github_pat_...
```

Hermes hides environment variables from the commands it runs unless they're allowed. The
`site-care` skill declares `GITHUB_TOKEN`, and [config.example.yaml](config.example.yaml)
adds it to `terminal.env_passthrough` as a backstop.

Set the agent's git identity to an account that's a member of your Vercel team (Vercel
only deploys commits from team members on some plans):

```bash
git config --global user.name  "Site Agent"
git config --global user.email "<the-github-account>@users.noreply.github.com"
```

### 4. The agent's own copy of the site

```bash
mkdir -p ~/sites && cd ~/sites
git clone https://x-access-token:${GITHUB_TOKEN}@github.com/<you>/<your-site>.git site
cd site && npm install
```

The Vercel project must be connected to the GitHub repo (Vercel → Add New → Project →
Import). That's what creates a preview link for every pull request. By default Vercel puts
preview links behind a Vercel login (Settings → **Deployment Protection**). Either invite the
owner to your Vercel team, or turn protection off for previews so the link opens on their
phone. For a small-business marketing site, the second option is usually fine.

### 5. Skills and personality

Install the skills straight from this repo:

```bash
hermes skills install https://raw.githubusercontent.com/empowerment-ai/agent-site-kit/main/skills/site-care/SKILL.md
hermes skills install https://raw.githubusercontent.com/empowerment-ai/agent-site-kit/main/skills/seo-checkup/SKILL.md
```

Or point Hermes at the repo's skills folder, so updates arrive with `git pull`. Add this to
`~/.hermes/config.yaml`:

```yaml
skills:
  external_dirs:
    - ~/sites/site/skills
```

Then copy [`SOUL.md`](SOUL.md) to `~/.hermes/SOUL.md`, and edit the business name and owner's
name. That's the agent's personality and standing orders. When the agent works inside
`~/sites/site`, it also loads the repo's `CLAUDE.md` automatically.

### 6. (Optional) The Monday-morning checkup

For the SEO checkup, add the DataForSEO MCP server in `~/.hermes/config.yaml` (see
[config.example.yaml](config.example.yaml)), then tell the agent in Telegram:

> Every Monday at 8am, run the seo-checkup skill in ~/sites/site and send me the report.

Or from the server:

```bash
hermes cron create "every monday at 08:00" \
  "Run the seo-checkup skill and send the owner the report." \
  --skill seo-checkup --workdir ~/sites/site
```

Scheduled jobs can't run commands Hermes flags as dangerous (cron approval mode defaults
to *deny*), which is another reason the checkup only *reports* and never publishes.

## What it costs to run

See [../../docs/costs.md](../../docs/costs.md). In short: a small VPS, model usage (cents per
change), your normal hosting, and pennies of DataForSEO a month for the checkup.

## Rather not set this up yourself?

This is exactly what we do at Empowerment AI: build or refresh the site, then set up the
agent that maintains it.
[Start with a free website analysis →](https://empowerment-ai.com/free-analysis?utm_source=github&utm_medium=hermes-readme&utm_campaign=agent-site-kit)
