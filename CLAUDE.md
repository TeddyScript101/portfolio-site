# Portfolio Site – Project Notes

## Writing Style

- **No em dashes (—):** Never use em dashes in any site content: blog posts, project descriptions, profile text, or any other user-facing copy. Use a comma, period, or rewrite the sentence instead.

## MongoDB

**Database:** `portfolio-site`
**Connection:** `src/lib/mongo.ts` (singleton `MongoClient`)

---

### Collection: `projects`

Sorted by `order` (ascending) when fetched.

```json
{
  "_id": "ObjectId (auto)",
  "slug": "beanworks-frontend",
  "title": "BeanWorks – Coffee Shop Frontend",
  "description": "A full-featured coffee shop e-commerce site...",
  "thumbnail": "/projects/beanworks-frontend.png",
  "demoUrls": [
    { "label": "Live Demo", "url": "https://..." },
    { "label": "Swagger",   "url": "https://..." }
  ],
  "githubUrl": "https://github.com/...",   // optional
  "techStack": ["ReactJS", "TypeScript", "Tailwind", "Storybook"],
  "relatedBlogs": [
    {
      "title": "How I structured a React frontend for a coffee shop app",
      "slug": "beanworks-react-frontend-structure"
    }
  ],
  "order": 1
}
```

Seed script: `scripts/seed-projects.mjs`

---

### Collection: `blogs`

Filtered by `{ published: true }` in all public API calls.
`readTime` is computed server-side from word count (not stored).

```json
{
  "_id": "ObjectId (auto)",
  "slug": "my-post-slug",
  "title": "Post Title",
  "date": "2025-01-15",
  "tags": ["Next.js", "TypeScript"],
  "excerpt": "Short summary shown on the blog list page.",
  "content": "Full markdown content of the post.",
  "published": true,
  "githubUrl": "https://github.com/...",   // optional
  "demoUrl": "https://..."                  // optional
}
```

---

### Collection: `profiles`

Single document (fetched with `findOne({})`).

```json
{
  "_id": "ObjectId (auto)",
  "homeIntroText": "Hi, I'm Teddy...",
  "about": {
    "aboutText1": "First paragraph of the About section.",
    "aboutText2": "Second paragraph of the About section.",
    "professionalTech": ["Next.js", "TypeScript"],
    "academicTech": ["Python", "Java"],
    "aiTools": ["Claude", "GitHub Copilot"]
  },
  "workExperience": [
    {
      "title": "Software Engineer",
      "company": "Acme Corp",
      "date": "Jan 2024 – Present",
      "location": "Hong Kong",
      "highlights": ["Built X", "Improved Y by Z%"]
    }
  ],
  "skills": [
    {
      "name": "TypeScript",
      "level": 90,
      "tech": "TypeScript"
    }
  ],
  "education": [
    {
      "degree": "BSc Computer Science",
      "school": "University of XYZ",
      "date": "2020 – 2024",
      "location": "Hong Kong",
      "highlights": ["Dean's List", "Final year project on X"]
    }
  ],
  "socials": [
    {
      "name": "GitHub",
      "url": "https://github.com/TeddyScript101",
      "iconName": "github"
    }
  ]
}
```
