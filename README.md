# Portfolio Site

Personal portfolio and blog built with Next.js 15, TypeScript, Tailwind CSS v4, and MongoDB Atlas. All content (profile data, blog posts) is stored in MongoDB, making the site fully data-driven with no hardcoded copy.

**Live:** [teddyyee.dev](https://teddyyee.dev) &nbsp;|&nbsp; **Deployed on:** Vercel

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | MongoDB Atlas |
| DB Driver | mongodb (native Node.js driver) |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── blog/
│   │   │   ├── route.ts          # GET /api/blog — list + search + paginate
│   │   │   └── [slug]/route.ts   # GET /api/blog/:slug — single post
│   │   └── profile/route.ts      # GET /api/profile — profile data
│   ├── blog/
│   │   ├── page.tsx              # Blog listing page
│   │   └── [slug]/page.tsx       # Blog post page
│   ├── layout.tsx
│   └── page.tsx                  # Home page (server component)
├── components/
│   ├── Header.tsx                # Home page nav (scroll-based)
│   ├── BlogHeader.tsx            # Blog nav (link-based)
│   ├── HomeClient.tsx            # Hero, About, Contact sections
│   ├── BlogListClient.tsx        # Search, tag filter, sort, pagination
│   ├── MarkdownRenderer.tsx      # Renders blog post markdown
│   ├── MermaidDiagram.tsx        # Renders mermaid code blocks as SVG
│   ├── CodeBlock.tsx             # Syntax-highlighted code blocks
│   └── AnimatedCounter.tsx       # Skill bar percentage animation
├── lib/
│   ├── mongo.ts                  # MongoDB client singleton
│   └── baseUrl.ts                # Resolves base URL for server-side fetches
└── icon/                         # SVG icon components
scripts/
├── publish-blog-post.mjs         # Upserts a post JSON into MongoDB
└── seed-blog-post.mjs            # Seeds initial blog data
```

---

## MongoDB Collections

Database: `portfolio-site`

### `profiles`

One document. Stores all profile content rendered on the home page.

```ts
type ProfileData = {
  homeIntroText: string;
  about: {
    aboutText1: string;
    aboutText2: string;
    professionalTech: string[];
    academicTech: string[];
  };
  workExperience: { title; company; date; location; desc }[];
  skills:         { name; level: number; tech }[];
  education:      { degree; school; date; location; details }[];
  socials:        { name; url; iconName }[];
};
```

### `blogs`

One document per post.

```ts
type BlogPost = {
  slug: string;          // URL path: /blog/<slug>
  title: string;
  date: string;          // "YYYY-MM-DD"
  tags: string[];
  excerpt: string;       // Plain text, shown on listing page
  content: string;       // Full markdown body
  published: boolean;    // false = draft, hidden from site
  githubUrl?: string;
  deployedUrl?: string;
};
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create `.env` in the project root:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/portfolio-site?retryWrites=true&w=majority
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Publishing a Blog Post

Blog posts are published via a script that upserts a JSON document into MongoDB.

### Format

```json
{
  "slug": "my-post-slug",
  "title": "Post Title",
  "date": "2026-05-24",
  "tags": ["Next.js", "TypeScript"],
  "excerpt": "Plain text summary shown on the listing page.",
  "content": "# Post Title\n\nMarkdown body...",
  "published": true,
  "githubUrl": "https://github.com/...",
  "deployedUrl": "https://..."
}
```

`githubUrl` and `deployedUrl` are optional. `published: false` saves a draft that won't appear on the site.

### Publish

```bash
node scripts/publish-blog-post.mjs /path/to/post.json
```

The script reads `MONGODB_URI` from the environment or falls back to `.env`. Running it again on the same slug updates the post.

---

## Blog API

| Endpoint | Description |
|---|---|
| `GET /api/blog` | All published posts (no `content` field, includes `readTime`) |
| `GET /api/blog?q=query` | Search by title and excerpt |
| `GET /api/blog?tags=Next.js,MongoDB` | Filter by tags |
| `GET /api/blog?sort=asc` | Oldest first (default: newest) |
| `GET /api/blog?page=1&limit=6` | Paginated response: `{ posts, total, page, totalPages }` |
| `GET /api/blog/:slug` | Single post with full content |

---

## Deployment

Deployed on Vercel. Set `MONGODB_URI` in the Vercel project environment variables. No other configuration needed.
