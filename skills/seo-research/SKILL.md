---
name: seo-research
description: Find what local customers actually search for, using real keyword data from the DataForSEO MCP server, and map those searches to pages on the site. Use for "what should my pages target", "what do people search for", "plan blog posts", or before writing new pages.
---

# SEO research with real data

An agent without data gives confident, made-up SEO advice. This skill only uses numbers
that come back from DataForSEO, and it says so when data is missing.

## Cost guardrails (read first)

DataForSEO bills per API call; the calls in this skill cost cents each. Before running:

1. Tell the owner which calls you're about to make and roughly what they cost. Keyword
   suggestions and search-volume lookups are typically a few cents per call; check
   https://dataforseo.com/pricing for current rates.
2. Keep it to **5 calls or fewer** per run unless the owner says otherwise.
3. The MCP server always calls the live API (there's no sandbox switch), so for a
   practice run keep it to one or two calls. That's cents. Check the account balance in
   the DataForSEO dashboard if the owner wants to see it.

## Steps

1. Read `content/business.json`: the `seo.market` (e.g. `"Virginia,United States"`),
   `seo.language`, and `seo.seedKeywords`, plus what the business sells.
2. Using the DataForSEO MCP tools (the repo's `.mcp.json` enables only the keyword-research
   modules):
   - `dataforseo_labs_google_keyword_ideas` or `dataforseo_labs_google_keyword_suggestions`
     for 2–3 seed keywords in the market's location.
   - `kw_data_google_ads_search_volume` for the most relevant 20–40 candidates.
3. Filter hard. Keep searches a real customer of *this* business would type, with local
   or purchase intent. Drop national brands, jobs ("bakery jobs"), and recipes, unless
   the owner wants recipe content.
4. Write `docs/seo/keywords.md` with a table: keyword, monthly searches, which existing
   page should target it (or "new post"), and why. Add the date and the data source.
5. Propose, don't publish: suggest up to 3 concrete changes (a title or description
   rewrite, a new section, or a new journal post) and wait for the owner to pick.
6. When writing, use the keyword naturally in the title, the first paragraph, and one
   heading. Never stuff keywords or invent facts to fit a keyword.
