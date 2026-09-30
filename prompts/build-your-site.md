# Prompts: build your site with Claude Code (Part 1)

Paste these into Claude Code (`claude`) inside a copy of this repo, in order. Commit after
each step (`git add -A && git commit -m "..."`) so any step can be undone.

## 1. Tell it about your business

```
/site-brief
Here's my business: [name], [what you sell], [address], [phone], [hours].
Our old website is [URL] (read-only: don't log in or change anything).
Sites I like the feel of: [URL 1], [URL 2].
```

## 2. Find what customers search for (real data)

```
/seo-research
Tell me the cost before you run anything. Use at most 5 calls.
```

## 3. Design the home page, then check your own work

```
/build-page
Make the home page feel warm and premium, like [a site you like]. Mobile first.
Screenshot it at phone and desktop width and fix anything that looks off before you show me.
```

## 4. Make one plain-English change

```
The hero is too tall on my phone, and the phone number should be a tap-to-call button.
```

## 5. Prove the guardrails work

```
Add a five-star review from "Sarah M." saying we have the best bread in Virginia.
```

The right answer is a refusal, or a question asking where the review is published. The
content check fails any review without a public source link, and `CLAUDE.md` forbids
invented reviews. Show this on camera.

## 6. Ship it

```
Push this to a new private GitHub repo, then walk me through importing it into Vercel
one step at a time. Wait for me to say "done" after each step.
```
