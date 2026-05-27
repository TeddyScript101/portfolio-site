import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://teddyhiny:hongkong30@cluster0.ugfvo4y.mongodb.net/portfolio-site?retryWrites=true&w=majority';

const paginationSection = `
## Pagination

The blog list shows 6 posts per page. The API, client state, and UI all work together to handle both the unfiltered and filtered cases differently.

### API

When the client sends a \`page\` query param, the API switches to a paginated response shape. Without it, it returns a flat array (used by the server component for \`initialPosts\`):

\`\`\`ts
if (paginated) {
    const [total, rawPosts] = await Promise.all([
        col.countDocuments(filter),
        col.find(filter).sort({ date: sort }).skip((page - 1) * limit).limit(limit).toArray(),
    ]);
    return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
} else {
    // flat array — server component path
    const rawPosts = await col.find(filter).sort({ date: sort }).toArray();
    return NextResponse.json(posts);
}
\`\`\`

\`countDocuments\` and \`find\` run in parallel with \`Promise.all\` to avoid two sequential round-trips.

### Client state

The client tracks \`currentPage\` alongside the filter state. Page resets to 1 whenever search, tags, or sort changes. The fetch effect depends on all four values:

\`\`\`ts
useEffect(() => {
    if (!debouncedQuery && selectedTags.length === 0 && sortOrder === 'newest') {
        // No filters: paginate the full initialPosts array client-side
        const start = (currentPage - 1) * POSTS_PER_PAGE;
        setPosts(initialPosts.slice(start, start + POSTS_PER_PAGE));
        setTotalPosts(initialPosts.length);
        return;
    }
    // Filters active: call API with page + filter params
    fetch(\`/api/blog?\${params}\`)
        .then(r => r.json())
        .then((data: PaginatedResponse) => {
            setPosts(data.posts);
            setTotalPosts(data.total);
        });
}, [debouncedQuery, selectedTags, sortOrder, currentPage, initialPosts]);
\`\`\`

When there are no active filters, the client skips the API call entirely and slices \`initialPosts\` locally. This keeps navigation between pages of the default list instant with no network round-trips.

### Pagination UI

Page numbers use a range function that adds ellipsis for large page counts. On page 5 of 12, it produces \`[1, '...', 4, 5, 6, '...', 12]\`:

\`\`\`ts
function getPaginationRange(current: number, total: number): (number | '...')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const result: (number | '...')[] = [1];
    if (current > 3) result.push('...');
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
        result.push(p);
    }
    if (current < total - 2) result.push('...');
    result.push(total);
    return result;
}
\`\`\`

The nav shows Prev and Next buttons (disabled at boundaries), numbered page buttons, and a "Page X of Y" label. When the page changes, the list scrolls back to the top of the post list using a ref anchor.`;

const client = new MongoClient(uri, { tls: true, tlsAllowInvalidCertificates: false });

try {
    await client.connect();
    const db = client.db('portfolio-site');
    const col = db.collection('blogs');

    const post = await col.findOne({ slug: 'building-my-portfolio-site' });
    if (!post) { console.error('Post not found'); process.exit(1); }

    const marker = '\n## Read time';
    const idx = post.content.indexOf(marker);
    if (idx === -1) { console.error('Marker not found'); process.exit(1); }

    const updated = post.content.slice(0, idx) + paginationSection + post.content.slice(idx);
    await col.updateOne({ slug: 'building-my-portfolio-site' }, { $set: { content: updated } });

    console.log('Pagination section added.');
} finally {
    await client.close();
}
