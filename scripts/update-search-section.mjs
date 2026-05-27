import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://teddyhiny:hongkong30@cluster0.ugfvo4y.mongodb.net/portfolio-site?retryWrites=true&w=majority';

const newSearchSection = `## Search, filter, and sort

The blog list passes search queries, tag filters, and sort order to the API as query parameters. MongoDB handles all the filtering and sorting, and the client just renders what comes back.

### API query parameters

| Param | Type | Example |
|---|---|---|
| \`q\` | string | \`?q=mongodb\` |
| \`tags\` | comma-separated | \`?tags=Next.js,TypeScript\` |
| \`sort\` | \`asc\` or \`desc\` | \`?sort=asc\` |

The route builds a MongoDB filter from those params before hitting the database:

\`\`\`ts
const filter: Record<string, unknown> = { published: true };

if (q) {
    filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
    ];
}

if (tags.length > 0) {
    filter.tags = { $in: tags };
}

const posts = await collection.find(filter).sort({ date: sort }).toArray();
\`\`\`

Search uses a case-insensitive \`$regex\` on both the title and excerpt fields. Tag filter uses \`$in\`, which matches a post if it contains at least one of the selected tags (OR logic). Sort is just a \`1\` or \`-1\` on the date field.

### Client state

The server component fetches the full post list once and passes it to \`BlogListClient\` as \`initialPosts\`. The client keeps two arrays:

- \`initialPosts\` (prop, never changes) — used for autocomplete suggestions and tag chip generation, both of which need the full list regardless of what filter is active
- \`posts\` (state) — the filtered results shown in the list, replaced on every API response

When no filters are active, the client skips the API call entirely and renders \`initialPosts\` directly:

\`\`\`ts
if (!debouncedQuery && selectedTags.length === 0 && sortOrder === 'newest') {
    setPosts(initialPosts);
    return;
}
\`\`\`

### Debouncing

Search uses two separate state values. \`query\` updates on every keystroke and drives the autocomplete dropdown immediately. \`debouncedQuery\` updates after a 300ms delay and is the value actually sent to the API:

\`\`\`ts
useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
}, [query]);
\`\`\`

Tag and sort changes trigger the API immediately since they are discrete selections, not continuous input. Each fetch uses an \`AbortController\` so a new request cancels any in-flight previous one. During a fetch, the post list dims to 40% opacity to indicate loading without hiding the previous results.`;

const client = new MongoClient(uri, { tls: true, tlsAllowInvalidCertificates: false });

try {
    await client.connect();
    const db = client.db('portfolio-site');
    const collection = db.collection('blogs');

    const post = await collection.findOne({ slug: 'building-my-portfolio-site' });
    if (!post) {
        console.error('Post not found');
        process.exit(1);
    }

    // Replace between ## Search, filter, and sort and ## Read time
    const startMarker = '## Search, filter, and sort';
    const endMarker = '\n## Read time';

    const startIdx = post.content.indexOf(startMarker);
    const endIdx = post.content.indexOf(endMarker);

    if (startIdx === -1 || endIdx === -1) {
        console.error('Could not find section markers');
        console.log('start:', startIdx, 'end:', endIdx);
        process.exit(1);
    }

    const updatedContent =
        post.content.slice(0, startIdx) +
        newSearchSection +
        post.content.slice(endIdx);

    await collection.updateOne(
        { slug: 'building-my-portfolio-site' },
        { $set: { content: updatedContent } }
    );

    console.log('Section updated successfully.');
} finally {
    await client.close();
}
