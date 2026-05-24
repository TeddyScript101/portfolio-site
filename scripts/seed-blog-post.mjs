import { MongoClient } from 'mongodb';

const uri = '***REMOVED***';

const post = {
    slug: 'building-my-portfolio-site',
    title: 'Building My Portfolio Site: Architecture and Tech Stack',
    date: '2026-05-24',
    tags: ['Next.js', 'MongoDB', 'TypeScript', 'Tailwind CSS'],
    excerpt: 'A walkthrough of how I built this portfolio site — the tech stack I chose, how data flows from MongoDB to the UI, and why I made certain architectural decisions along the way.',
    published: true,
    content: `# Building My Portfolio Site: Architecture and Tech Stack

This post is a technical walkthrough of how this portfolio site is built. I'll cover the folder structure, the data layer, and the key design decisions — including why I store all profile content in MongoDB instead of hardcoding it.

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

No ORM, no GraphQL, no extra abstraction. The native MongoDB driver is lightweight and plenty capable for a portfolio site.

---

## Project Structure

\`\`\`
src/
├── app/
│   ├── api/
│   │   ├── profile/
│   │   │   └── route.ts          # GET profile data
│   │   └── blog/
│   │       ├── route.ts          # GET all published posts
│   │       └── [slug]/
│   │           └── route.ts      # GET single post by slug
│   ├── blog/
│   │   ├── page.tsx              # Blog list page
│   │   └── [slug]/
│   │       └── page.tsx          # Individual post page
│   ├── type/
│   │   ├── profileData.ts        # TypeScript types for profile
│   │   └── blogPost.ts           # TypeScript types for blog posts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Homepage (server component)
├── components/
│   ├── Header.tsx                # Homepage header (scroll-based nav)
│   ├── BlogHeader.tsx            # Blog header (link-based nav)
│   ├── HomeClient.tsx            # Main homepage client component
│   ├── AnimatedCounter.tsx       # Skill level animation
│   └── MarkdownRenderer.tsx      # Renders blog post markdown
├── icon/
│   ├── LinkedInIcon.tsx
│   ├── InstagramIcon.tsx
│   └── EmailIcon.tsx
└── lib/
    └── mongo.ts                  # MongoDB client singleton
\`\`\`

---

## Data Layer: MongoDB

All content — my bio, work experience, skills, education, and socials — lives in MongoDB Atlas. The site never has hardcoded copy; a CMS writes to the database and the site reads from it.

There are two collections:

**\`profiles\`** — a single document holding all homepage content:

\`\`\`json
{
  "homeIntroText": "...",
  "about": {
    "aboutText1": "...",
    "aboutText2": "...",
    "professionalTech": ["TypeScript", "React", "..."],
    "academicTech": ["Python", "Docker", "..."]
  },
  "workExperience": [{ "title": "...", "company": "...", "date": "...", "location": "...", "desc": "..." }],
  "skills": [{ "name": "Frontend", "level": 85, "tech": "React, Next.js, Tailwind" }],
  "education": [{ "degree": "...", "school": "...", "date": "...", "location": "...", "details": "..." }],
  "socials": [{ "name": "LinkedIn", "url": "...", "iconName": "LinkedInIcon" }]
}
\`\`\`

**\`blogs\`** — one document per post:

\`\`\`json
{
  "slug": "my-first-post",
  "title": "Post Title",
  "date": "2026-05-24",
  "tags": ["Next.js", "TypeScript"],
  "excerpt": "Short preview shown on the blog list.",
  "content": "# Full markdown content...",
  "published": true
}
\`\`\`

Setting \`published: false\` acts as a draft flag — the API filters it out.

### The MongoDB Singleton

Next.js in development mode hot-reloads modules constantly. Without a singleton, every reload would open a new database connection and exhaust the connection pool quickly.

\`\`\`ts
// src/lib/mongo.ts
const globalForMongo = globalThis as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === 'development') {
    if (!globalForMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalForMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalForMongo._mongoClientPromise;
} else {
    // In production each serverless instance gets its own connection
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}
\`\`\`

In production on Vercel, each serverless function invocation manages its own connection — there are no persistent processes to worry about.

---

## Server vs. Client Components

Next.js App Router separates components into server and client. I use this boundary deliberately.

**Server components** handle data fetching. The homepage (\`app/page.tsx\`) is a server component that calls the \`/api/profile\` route and passes the result down as props. This means the first paint already has all the content — no loading spinners.

\`\`\`ts
// app/page.tsx — server component
export default async function Home() {
    const res = await fetch(\`\${baseUrl}/api/profile\`, { cache: 'no-cache' });
    const profileData = await res.json();
    return <HomeClient profileData={profileData} />;
}
\`\`\`

**Client components** handle interactivity. \`HomeClient.tsx\` is marked \`'use client'\` because it needs:
- Scroll-based section navigation in the header
- The \`useInView\` hook from \`react-intersection-observer\` to trigger the skill bar animations
- The \`AnimatedCounter\` component that counts up to each skill percentage

The split keeps the server bundle lean and avoids shipping unnecessary JavaScript to the browser.

---

## Skill Bar Animations

When the skills section scrolls into view, the progress bars animate from 0% to their target value and the percentage counter ticks up simultaneously.

\`\`\`tsx
// AnimatedCounter.tsx
useEffect(() => {
    if (!isVisible) return;
    const steps = 1000 / 20;             // 50 steps over 1 second
    const increment = target / steps;

    const counter = setInterval(() => {
        start += increment;
        if (start >= target) { start = target; clearInterval(counter); }
        setCount(Math.floor(start));
    }, 20);

    return () => clearInterval(counter);
}, [isVisible, target]);
\`\`\`

The \`isVisible\` flag comes from \`useInView\` with \`triggerOnce: false\`, so the animation re-runs every time the section enters the viewport.

---

## Blog System

The blog was added after the initial build. It uses [react-markdown](https://github.com/remarkjs/react-markdown) with a few plugins:

- **remark-gfm** — GitHub Flavored Markdown: tables, strikethrough, task lists
- **rehype-highlight** — syntax highlighting via highlight.js with the \`github-dark\` theme
- **rehype-slug** — adds \`id\` attributes to headings for anchor links

All markdown components are overridden in \`MarkdownRenderer.tsx\` to match the site's dark blue colour palette instead of using browser defaults.

The blog has two routes:
- \`/blog\` — lists all published posts (the API omits the \`content\` field for performance)
- \`/blog/[slug]\` — fetches the full post including the markdown body

The blog pages use \`BlogHeader\` instead of \`Header\`. The homepage header uses \`scrollIntoView\` to navigate between sections; on a separate page that makes no sense, so \`BlogHeader\` uses \`<Link href="/#section-id">\` instead.

---

## Design

The colour palette is a dark navy gradient:

\`\`\`
from-[#081B29] via-[#0D2D4A] to-[#134074]
\`\`\`

Accent colour is Tailwind's \`blue-400\` (\`#60a5fa\`). All cards use a semi-transparent \`bg-blue-900/20\` with a \`border-blue-400/20\` border to create depth without heavy contrast.

The font is **Geist Sans** (by Vercel) for body text and **Geist Mono** for code, loaded through \`next/font/google\`.

---

## Deployment

The site is deployed on Vercel. The \`VERCEL_URL\` environment variable is used to construct absolute URLs for server-side \`fetch\` calls, since relative URLs don't work in a Node.js context:

\`\`\`ts
const baseUrl = process.env.VERCEL_URL
    ? \`https://\${process.env.VERCEL_URL}\`
    : 'http://localhost:3000';
\`\`\`

MongoDB Atlas is configured with TLS enabled (\`tls: true\`) and the connection string is stored in \`.env\` / Vercel environment variables.

---

That covers the full architecture. The main takeaway is keeping things simple: one database, no ORM, clear server/client boundaries, and content managed externally so the site never needs a redeploy just to update copy.
`,
};

async function main() {
    const client = new MongoClient(uri, { tls: true, tlsAllowInvalidCertificates: false });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('portfolio-site');
        const collection = db.collection('blogs');

        // Avoid duplicates — replace if the slug already exists
        const result = await collection.replaceOne(
            { slug: post.slug },
            post,
            { upsert: true }
        );

        if (result.upsertedCount > 0) {
            console.log(`Inserted new post: "${post.title}"`);
        } else {
            console.log(`Updated existing post: "${post.title}"`);
        }
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

main().catch(console.error);
