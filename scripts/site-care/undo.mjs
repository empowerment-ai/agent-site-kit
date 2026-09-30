#!/usr/bin/env node
// npm run care:undo
//
// Proposes undoing the most recent published change. It creates a revert with
// a preview link, and still needs the owner's yes and care:publish to go live.
import { sh, git, die, stamp } from "./lib.mjs";
import { propose } from "./propose.mjs";

if (sh("git status --porcelain")) die("There are unsaved edits. Propose or discard them before undoing.");
sh("git checkout main", { inherit: true });
sh("git pull --ff-only", { inherit: true });

const subject = sh("git log -1 --format=%s");
const sha = sh("git log -1 --format=%H");
console.log(`• Undoing: ${subject}`);

git(["checkout", "-b", `care/${stamp()}-undo`]);
try {
  git(["revert", "--no-edit", sha]);
} catch {
  die("That change can't be undone automatically (it overlaps a later change). Ask a person to help.");
}
await propose(`Undo: ${subject}`);
