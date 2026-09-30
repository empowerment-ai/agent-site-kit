// Shared helpers for the site-care scripts.
// The agent never runs git or talks to GitHub directly. These scripts do,
// in one fixed, reviewable way.
import { execSync, execFileSync } from "node:child_process";
import fs from "node:fs";

// Fixed commands only (no variables). Anything built from input goes through git().
export function sh(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf8", stdio: opts.inherit ? "inherit" : ["ignore", "pipe", "pipe"], ...opts })?.toString().trim();
}

// Runs git with an argument array, no shell, so text like a commit message
// can never be interpreted as a command.
export function git(args, opts = {}) {
  return execFileSync("git", args, { encoding: "utf8", stdio: opts.inherit ? "inherit" : ["ignore", "pipe", "pipe"] })?.toString().trim();
}

export function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

export function token() {
  const t = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (t) return t;
  try {
    return sh("gh auth token");
  } catch {
    die("No GitHub token. Set GITHUB_TOKEN to a fine-grained token for this repository (Contents: read/write, Pull requests: read/write, Deployments: read).");
  }
}

export function repo() {
  const url = sh("git remote get-url origin");
  const m = url.match(/github\.com[:/]([^/]+)\/([^/.]+)(\.git)?$/);
  if (!m) die(`The git remote "origin" (${url}) isn't a GitHub repository.`);
  return { owner: m[1], name: m[2] };
}

export async function gh(path, { method = "GET", body, allowFail = false } = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (allowFail) return null;
    die(`GitHub said ${res.status} for ${method} ${path}: ${data.message ?? "unknown error"}`);
  }
  return data;
}

export function siteUrl() {
  return JSON.parse(fs.readFileSync("content/business.json", "utf8")).url;
}

export function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "change";
}

export function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Waits for the hosting provider (e.g. Vercel's GitHub integration) to report a
// deployment for this commit, and returns its URL. Works with any host that
// posts GitHub deployment statuses.
export async function waitForDeployment(sha, { environment, timeoutMs = 6 * 60_000 } = {}) {
  const { owner, name } = repo();
  const started = Date.now();
  let lastState = "";
  // Always check at least once, then poll until the timeout.
  for (;;) {
    const deployments = await gh(`/repos/${owner}/${name}/deployments?sha=${sha}&per_page=10`);
    const matches = deployments.filter((d) => !environment || d.environment.toLowerCase().includes(environment));
    for (const d of matches) {
      const statuses = await gh(`/repos/${owner}/${name}/deployments/${d.id}/statuses?per_page=5`);
      const s = statuses[0];
      if (!s) continue;
      if (s.state !== lastState) {
        process.stdout.write(`  … deployment ${s.state}\n`);
        lastState = s.state;
      }
      if (s.state === "success") return s.environment_url || s.target_url;
      if (s.state === "failure" || s.state === "error") die(`The deployment failed. Details: ${s.target_url ?? "see the hosting dashboard"}`);
    }
    if (Date.now() - started >= timeoutMs) return null;
    await sleep(8000);
  }
}

export async function findCarePRs() {
  const { owner, name } = repo();
  const prs = await gh(`/repos/${owner}/${name}/pulls?state=open&base=main&per_page=50`);
  return prs.filter((p) => p.head.ref.startsWith("care/"));
}
