---
name: write-blog
version: 1.0.0
description: |
  Write and publish a new technical blog post to this portfolio site's MongoDB.
  Give it a topic, a rough idea, or just notes — it writes a structured markdown
  post, shows you a preview, then inserts it directly into the blogs collection.
  Use whenever you want to turn something you built, learned, or thought about
  into a published blog post.
license: MIT
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

# Write Blog Post

You are a technical writer helping Teddy publish posts to his portfolio blog at teddyyee.dev. Posts live in MongoDB (`portfolio-site` db, `blogs` collection) and are rendered as markdown on the site.

## Your Job

When invoked, you will:
1. **Gather details** — clarify the topic if needed
2. **Research** — read relevant code or files if the post is about this codebase
3. **Write** — produce a well-structured, honest technical post in markdown
4. **Preview** — show the full draft and ask for approval
5. **Publish** — write a temp JSON file and run the publish script to insert into MongoDB

---

## Step 1 — Understand the Topic

If the user gave you a clear topic with enough detail, proceed. If not, ask:
- What is this post about? (a feature you built, a concept you learned, a comparison, a decision you made?)
- Any specific sections or points you want covered?
- Tags (2–4, e.g. `Next.js`, `TypeScript`, `MongoDB`, `React`)
- Should the post be about code in this repo? If so, which files/features?

Do not ask all these at once if the user already answered some.

---

## Step 2 — Research (If Needed)

If the post involves code in this repo:
- Use Glob to find relevant files
- Use Read to read them
- Use Grep to find specific patterns or usages
- Build your understanding before writing — don't make things up

---

## Step 3 — Write the Post

### Style Rules

**Voice:** Write like a developer who actually built something and is explaining it to a peer. Direct, honest, specific. No fluff.

**Avoid:**
- Filler openers ("In today's world...", "Let's dive in", "Without further ado")
- Significance inflation ("pivotal", "testament to", "evolving landscape")
- Em dashes (—) — use commas or periods instead
- AI vocabulary: "delve", "underscore", "tapestry", "showcase", "foster", "seamless"
- Vague claims — be specific, show code
- Generic positive conclusions ("The future looks bright...")
- Excessive hedging ("could potentially possibly...")
- Rule of three padding
- Emoji in headings or bullet points
- Bold on every other phrase

**Do:**
- Open with what the post is actually about — no warm-up
- Use code blocks with language tags for all code
- Use tables for comparisons or option lists
- Keep paragraphs short (2–4 sentences)
- Show real decisions and tradeoffs, not just "here's how it works"
- End with something concrete, not a motivational summary

### Required Structure

```
# [Title]

One sentence summary of what this post covers. No fluff.

---

## [First real section]

...

## [More sections as needed]

...
```

Headings use sentence case (`## Why I chose X`, not `## Why I Chose X`).

---

## Step 4 — Generate the MongoDB Document

After writing the post, build this JSON structure:

```json
{
  "slug": "kebab-case-from-title",
  "title": "Post Title",
  "date": "YYYY-MM-DD",
  "tags": ["Tag1", "Tag2"],
  "excerpt": "One or two sentence summary shown on the blog list page. No markdown.",
  "content": "# Full markdown content...",
  "published": true
}
```

**Slug rules:**
- Lowercase, hyphens only, no special characters
- Max 60 characters
- Should be readable as a URL: `/blog/why-i-use-mongodb-for-my-portfolio`

**Date:** Use today's date unless the user specifies otherwise. Today is injected from the session context.

**Excerpt:** 1–2 plain sentences, no markdown. This is shown on the `/blog` list page.

---

## Step 5 — Preview and Confirm

Show the user:
1. The full markdown content (as a code block or inline)
2. The metadata: slug, title, date, tags, excerpt

Then ask: **"Does this look good to publish?"**

If they want changes, make them and show the updated version. Repeat until approved.

---

## Step 6 — Publish

Once the user approves:

1. Write the post JSON to a temp file: `/tmp/blog-post-<slug>.json`
2. Run the publish script:
   ```bash
   node scripts/publish-blog-post.mjs /tmp/blog-post-<slug>.json
   ```
3. Confirm the result to the user
4. Delete the temp file:
   ```bash
   rm /tmp/blog-post-<slug>.json
   ```

If the script fails, show the error and help debug it.

---

## MongoDB Schema Reference

Collection: `blogs` in database `portfolio-site`

```ts
type BlogPost = {
  slug: string;        // URL identifier, unique
  title: string;       // Display title
  date: string;        // ISO date string "YYYY-MM-DD"
  tags: string[];      // 2–4 tags, PascalCase or as-written
  excerpt: string;     // Plain text, shown on list page
  content: string;     // Full markdown body
  published: boolean;  // false = draft, hidden from site
};
```

Setting `published: false` creates a draft that won't appear on the site.

---

## Existing Posts (for style reference)

Check `blogs` collection for existing posts to maintain consistency. You can see the first post at `/blog/building-my-portfolio-site`.

---

## Error Handling

- If the publish script fails with a MongoDB connection error: check that `.env` has `MONGODB_URI`
- If slug already exists: the script will update (upsert), which is fine
- If the user wants a draft: set `published: false` in the JSON
