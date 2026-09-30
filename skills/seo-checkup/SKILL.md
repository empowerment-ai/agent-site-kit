---
name: seo-checkup
description: Monthly (or weekly) read-only website checkup. Confirms the site builds, spot-checks pages and redirects, pulls real ranking and keyword data from DataForSEO, and sends the owner a short report with up to 3 suggested improvements. Designed to run on a schedule (Hermes cron) and never publishes anything on its own.
---

# SEO checkup (scheduled, read-only)

This skill **reports and suggests. It never publishes.** If the owner replies to the
report with "do #2", hand off to the `site-care` skill, which previews and waits for a yes.

## Steps

1. `git checkout main && git pull`, then `npm run check`. If the check fails, lead the
   report with that (someone edited something by hand) and stop.
2. **Is the site up?** Fetch the live home page and 2–3 other pages from the URL in
   `content/business.json`. Note anything that isn't a 200.
3. **Redirects still work?** For each entry in `content/redirects.json`, request the old
   URL without following redirects and confirm a 301/308 pointing at the right page.
4. **Search data (DataForSEO MCP, about 2–4 calls, pennies):**
   - Keywords the domain currently ranks for (ranked keywords for the site URL in the
     market from `business.json`), if the site is live on a real domain.
   - Search volume for the keywords listed in `docs/seo/keywords.md`, if it exists.
   Compare with last month's file in `docs/seo/history/` if there is one, then save this
   month's results as `docs/seo/history/YYYY-MM.md`.
   If the site is new and ranks for nothing yet, say so plainly. That's normal for the
   first few months.
5. **Write the report** for a non-technical owner, 8 lines or fewer:
   - one line on site health (up, fast, redirects fine)
   - what moved in search, with real numbers only
   - up to **3 suggestions**, numbered, each one sentence with the reason
     (e.g. "1. Add a 'holiday pre-order' section to the menu page. 390 people a month
     search 'holiday bread pre-order' near you.")
   - "Reply with a number and I'll prepare a preview."
6. Commit only the `docs/seo/` report files, and only through `npm run care:propose` if
   the owner wants them kept in the repo. Otherwise leave them uncommitted.

Never invent numbers. If a DataForSEO call fails or returns nothing, say "no data this
month" rather than guessing.
