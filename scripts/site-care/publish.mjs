#!/usr/bin/env node
// npm run care:publish -- 12
//
// Publishes an approved change: merges pull request #12 into main, which makes
// the host deploy it to the live site. Run this ONLY after the owner has said
// yes to the preview in the current conversation.
import { sh, git, die, gh, repo, siteUrl, waitForDeployment } from "./lib.mjs";

const number = Number(process.argv[2]);
if (!number) die("Which change? npm run care:publish -- <number>  (see npm run care:status)");

const { owner, name } = repo();
const pr = await gh(`/repos/${owner}/${name}/pulls/${number}`);
if (pr.state !== "open") die(`Change #${number} is ${pr.merged ? "already published" : "closed"}.`);
if (pr.base.ref !== "main" || !pr.head.ref.startsWith("care/")) die(`#${number} isn't a site-care change (branch ${pr.head.ref}). Publish it by hand if you really mean to.`);

console.log(`• Publishing #${number}: ${pr.title}`);
const merge = await gh(`/repos/${owner}/${name}/pulls/${number}/merge`, {
  method: "PUT",
  body: { merge_method: "squash", commit_title: `${pr.title} (#${number})` },
});
// Clean up the branch (fine if GitHub already auto-deleted it).
await gh(`/repos/${owner}/${name}/git/refs/heads/${pr.head.ref}`, { method: "DELETE", allowFail: true });

sh("git checkout main", { inherit: true });
sh("git pull --ff-only", { inherit: true });
try { git(["branch", "-D", pr.head.ref]); } catch {}

console.log("• Waiting for the live site to update…");
const url = await waitForDeployment(merge.sha, { environment: "production" });
console.log(`\n✓ Live: ${siteUrl()}${url ? `  (deployment: ${url})` : ""}`);
console.log("  If anything looks wrong: npm run care:undo\n");
