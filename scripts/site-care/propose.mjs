#!/usr/bin/env node
// npm run care:propose -- "Change Saturday hours to 9am to 2pm"
//
// Checks and builds the site, commits the change to a care/* branch, opens (or
// updates) a pull request, and prints a preview link for the owner to approve.
// Nothing goes live here. Publishing is a separate step (care:publish).
import { sh, git, die, gh, repo, slugify, stamp, waitForDeployment } from "./lib.mjs";

export async function propose(summary, { branchPrefix = "" } = {}) {
  if (!summary) die('Say what changed: npm run care:propose -- "Change Saturday hours to 9am to 2pm"');

  let branch = sh("git rev-parse --abbrev-ref HEAD");
  const dirty = sh("git status --porcelain");
  if (branch === "main") {
    if (!dirty) die("There are no changes to propose. Edit the content files first.");
    branch = `care/${stamp()}-${branchPrefix}${slugify(summary)}`;
    git(["checkout", "-b", branch]);
  } else if (!branch.startsWith("care/")) {
    die(`You're on branch "${branch}". Site-care changes start from main (git checkout main && git pull).`);
  }

  console.log("• Checking content and building the site (this catches mistakes before anyone sees them)…");
  try {
    sh("npm run check", { inherit: true });
    sh("npm run build", { inherit: true });
  } catch {
    die("The check or build failed. Read the message above, fix the file, and run care:propose again.");
  }

  if (sh("git status --porcelain")) {
    git(["add", "-A"]);
    git(["commit", "-m", summary]);
  }
  git(["push", "-u", "origin", branch], { inherit: true });
  const sha = sh("git rev-parse HEAD");

  const { owner, name } = repo();
  const existing = await gh(`/repos/${owner}/${name}/pulls?state=open&head=${owner}:${encodeURIComponent(branch)}`);
  const pr =
    existing[0] ??
    (await gh(`/repos/${owner}/${name}/pulls`, {
      method: "POST",
      body: {
        title: summary,
        head: branch,
        base: "main",
        body: `${summary}\n\nProposed by the site-care agent. Nothing is live until the owner approves and \`care:publish\` merges this.`,
      },
    }));

  console.log(`• Change #${pr.number} opened: ${pr.html_url}`);
  console.log("• Waiting for the preview link…");
  const preview = await waitForDeployment(sha, { environment: "preview" });

  console.log("\n────────────────────────────────────────");
  console.log(`CHANGE:   #${pr.number}  ${summary}`);
  console.log(`PREVIEW:  ${preview ?? "(not ready yet; run `npm run care:status` in a minute)"}`);
  console.log(`PUBLISH:  only after the owner says yes → npm run care:publish -- ${pr.number}`);
  console.log("────────────────────────────────────────\n");
  return { pr: pr.number, preview };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await propose(process.argv.slice(2).join(" ").trim());
}
