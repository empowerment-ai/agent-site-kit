// A Lovable-style website builder in one file.
//
// Lovable, Bolt, and v0 are, underneath, the same loop: your prompt goes to an
// AI agent that has tools (read files, write files, run commands), it works on
// a real project, and you watch a live preview update. You don't have to build
// that loop: the Claude Agent SDK *is* that loop (it's Claude Code as a
// library). This file just puts a chat box and a preview next to it.
//
//   cd builder && npm install
//   ANTHROPIC_API_KEY=sk-ant-... npm start      → http://localhost:4000
//
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { query } from "@anthropic-ai/claude-agent-sdk";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, "..");               // the website repo the agent works on
const PORT = Number(process.env.BUILDER_PORT ?? 4000);
const PREVIEW = process.env.PREVIEW_URL ?? "http://localhost:3000";
const MAX_BUDGET = Number(process.env.BUILDER_MAX_USD ?? 2);   // hard cap per request, in dollars

// What the agent may do without asking. Everything else is refused (see canUseTool).
const ALLOWED = [
  "Read", "Write", "Edit", "Glob", "Grep", "Skill", "TodoWrite",
  "Bash(npm run check)", "Bash(npm run build)",
  "mcp__playwright__browser_navigate", "mcp__playwright__browser_resize", "mcp__playwright__browser_take_screenshot",
];

let sessionId = null; // conversation memory: every message resumes the same session

// ---- git checkpoints: Lovable's "version history", for free ----
const git = (...args) => execFileSync("git", args, { cwd: SITE, encoding: "utf8" }).trim();
function checkpoint(message) {
  try {
    if (!git("status", "--porcelain")) return null;
    git("add", "-A");
    git("commit", "-m", `builder: ${message.slice(0, 72)}`);
    return git("rev-parse", "--short", "HEAD");
  } catch { return null; }
}
function history() {
  try {
    return git("log", "-12", "--format=%h\t%s\t%cr").split("\n").filter(Boolean).map((l) => {
      const [sha, subject, when] = l.split("\t");
      return { sha, subject, when };
    });
  } catch { return []; }
}

// ---- a readable one-liner for each tool call, for the activity feed ----
function describe(name, input = {}) {
  const rel = (p) => (p ? path.relative(SITE, p) || p : "");
  switch (name) {
    case "Read": return `Reading ${rel(input.file_path)}`;
    case "Write": return `Writing ${rel(input.file_path)}`;
    case "Edit": return `Editing ${rel(input.file_path)}`;
    case "Glob": return `Looking for ${input.pattern}`;
    case "Grep": return `Searching for “${input.pattern}”`;
    case "Bash": return `Running ${input.command}`;
    case "Skill": return `Using the ${input.skill ?? input.command ?? ""} skill`;
    case "TodoWrite": return "Planning the steps";
    default: return name.startsWith("mcp__playwright") ? "Taking a screenshot to check the design" : name;
  }
}

// ---- one chat turn, streamed to the browser as Server-Sent Events ----
async function runTurn(message, send) {
  const run = query({
    prompt: message,
    options: {
      cwd: SITE,
      settingSources: ["project"],                // loads CLAUDE.md, .claude/skills, .mcp.json
      systemPrompt: {
        type: "preset",
        preset: "claude_code",
        append:
          "You are running inside a Lovable-style website builder. The owner watches a live preview of the site next to this chat. " +
          "Make the change they ask for, following CLAUDE.md and DESIGN.md. Run `npm run check` after editing content. " +
          "Finish with two or three plain-English sentences on what changed. No file paths unless they ask.",
      },
      permissionMode: "acceptEdits",
      allowedTools: ALLOWED,
      canUseTool: async (tool) => ({
        behavior: "deny",
        message: `${tool} isn't allowed in the builder. Stick to editing files and running npm run check/build.`,
      }),
      maxTurns: 40,
      maxBudgetUsd: MAX_BUDGET,
      ...(process.env.BUILDER_MODEL ? { model: process.env.BUILDER_MODEL } : {}),
      ...(sessionId ? { resume: sessionId } : {}),
    },
  });

  try {
    for await (const msg of run) {
      if (msg.type === "system" && msg.subtype === "init") {
        sessionId = msg.session_id;
      } else if (msg.type === "assistant" && !msg.parent_tool_use_id) {
        for (const block of msg.message.content ?? []) {
          if (block.type === "text" && block.text.trim()) send({ type: "text", text: block.text });
          if (block.type === "tool_use") {
            send({ type: "tool", name: block.name, label: describe(block.name, block.input) });
            if (block.name === "Write" || block.name === "Edit") send({ type: "refresh" });
          }
        }
      } else if (msg.type === "result") {
        sessionId = msg.session_id;
        const sha = checkpoint(message);
        send({
          type: "done",
          ok: !msg.is_error,
          error: msg.is_error ? (msg.errors?.join(" ") || msg.subtype) : undefined,
          cost: msg.total_cost_usd,
          seconds: Math.round(msg.duration_ms / 1000),
          checkpoint: sha,
          history: history(),
        });
      }
    }
  } catch (err) {
    send({ type: "done", ok: false, error: String(err?.message ?? err), history: history() });
  }
}

// ---- tiny HTTP server (localhost only) ----
const json = (res, code, body) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };
const readBody = (req) => new Promise((ok) => { let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => ok(b)); });
let busy = false;

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(fs.readFileSync(path.join(HERE, "index.html"), "utf8").replace("__PREVIEW_URL__", PREVIEW));
  }
  if (req.method === "GET" && req.url === "/api/history") return json(res, 200, history());
  if (req.method === "POST" && req.url === "/api/new") { sessionId = null; return json(res, 200, { ok: true }); }
  if (req.method === "POST" && req.url === "/api/undo") {
    try {
      const subject = git("log", "-1", "--format=%s");
      if (!subject.startsWith("builder:")) return json(res, 400, { error: "The last change wasn't made by the builder, so I won't undo it." });
      git("revert", "--no-edit", "HEAD");
      return json(res, 200, { ok: true, history: history() });
    } catch (e) { return json(res, 500, { error: String(e.message) }); }
  }
  if (req.method === "POST" && req.url === "/api/chat") {
    if (busy) return json(res, 409, { error: "Still working on the last request." });
    const { message } = JSON.parse((await readBody(req)) || "{}");
    if (!message?.trim()) return json(res, 400, { error: "Empty message." });
    busy = true;
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    const send = (e) => res.write(`data: ${JSON.stringify(e)}\n\n`);
    await runTurn(message.trim(), send);
    busy = false;
    return res.end();
  }
  res.writeHead(404); res.end();
});

// Start the site's dev server too, unless one is already running.
if (!process.env.NO_DEV_SERVER) {
  const dev = spawn("npm", ["run", "dev", "--", "-p", new URL(PREVIEW).port || "3000"], { cwd: SITE, stdio: "ignore" });
  process.on("exit", () => dev.kill());
  process.on("SIGINT", () => process.exit(0));
}

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n  Builder:  http://localhost:${PORT}`);
  console.log(`  Preview:  ${PREVIEW}`);
  console.log(`  Budget:   $${MAX_BUDGET} max per request (BUILDER_MAX_USD)\n`);
});
