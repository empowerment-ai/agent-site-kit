#!/usr/bin/env node
// npm run care:status
// Lists changes waiting for the owner's approval, with their preview links.
import { findCarePRs, waitForDeployment, siteUrl } from "./lib.mjs";

const prs = await findCarePRs();
if (!prs.length) {
  console.log(`Nothing waiting. The live site is ${siteUrl()}`);
  process.exit(0);
}
for (const pr of prs) {
  const preview = await waitForDeployment(pr.head.sha, { environment: "preview", timeoutMs: 1 });
  console.log(`#${pr.number}  ${pr.title}\n     preview: ${preview ?? "(building…)"}\n     opened:  ${pr.created_at.slice(0, 10)}`);
}
