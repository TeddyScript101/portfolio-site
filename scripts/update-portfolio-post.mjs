import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://teddyhiny:hongkong30@cluster0.ugfvo4y.mongodb.net/portfolio-site?retryWrites=true&w=majority';

const newSection = `
## Search, filter, and sort

The blog list needed more than a static list once it had more than a handful of posts. I added three controls: a text search with autocomplete, a tag filter, and a date sort toggle.

All three work client-side. The server component fetches the full post list once; a \`BlogListClient\` component receives that array as props and handles all the state locally. No extra API calls on every keystroke.

\`\`\`
page.tsx (server)
  └── BlogListClient.tsx (client)  — search / filter / sort state
\`\`\`

### Search and autocomplete

The input filters posts by matching the query against the title and excerpt. The autocomplete dropdown derives suggestions from the same array using \`useMemo\`:

\`\`\`ts
const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return posts
        .filter(p => p.title.toLowerCase().includes(q))
        .map(p => p.title)
        .slice(0, 6);
}, [query, posts]);
\`\`\`

Matched characters are highlighted in the dropdown using a small \`highlight\` helper that returns JSX with a \`<mark>\` element styled to the dark palette.

Keyboard navigation (arrows, Enter, Escape) and outside-click dismissal are handled with a \`useRef\` on the wrapper div and a \`mousedown\` event listener:

\`\`\`ts
useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
        if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
            setShowSuggestions(false);
        }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
}, []);
\`\`\`

### Tag filter

Tag chips are derived at render time from all posts, so no manual list needs maintaining:

\`\`\`ts
const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(p => p.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
}, [posts]);
\`\`\`

Clicking a tag toggles it in a \`selectedTags\` array. The filter uses OR logic: a post shows up if it has at least one of the selected tags. Active tags are also highlighted in a slightly brighter shade on each card.

### Sort

A single button toggles between \`newest\` and \`oldest\`. The sort runs inside the same \`filteredPosts\` memo that applies search and tag filters, so all three compose without extra passes over the array:

\`\`\`ts
const filteredPosts = useMemo(() => {
    let result = posts;

    if (query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(
            p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
        );
    }

    if (selectedTags.length > 0) {
        result = result.filter(p => selectedTags.some(tag => p.tags.includes(tag)));
    }

    return [...result].sort((a, b) => {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return sortOrder === 'newest' ? diff : -diff;
    });
}, [posts, query, selectedTags, sortOrder]);
\`\`\``;

const readTimeSection = `
## Read time

Each post displays an estimated read time next to the date, calculated from the word count of the markdown content at 200 words per minute.

On the list page, the API computes it server-side so the content field itself is never sent to the client:

\`\`\`ts
const serialized = posts.map((post) => {
    const wordCount = post.content.trim().split(/\\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    const { content: _content, ...rest } = post;
    return { ...rest, _id: post._id.toString(), readTime };
});
\`\`\`

On the individual post page, the same calculation runs server-side since the full content is already available.`;

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

    // Find the "---" before "## Design" and insert the new sections before it
    const insertMarker = '\n---\n\n## Design';
    const insertPoint = post.content.indexOf(insertMarker);

    if (insertPoint === -1) {
        console.error('Could not find insertion point ("## Design" section)');
        process.exit(1);
    }

    const updatedContent =
        post.content.slice(0, insertPoint) +
        '\n' + newSection +
        '\n' + readTimeSection +
        post.content.slice(insertPoint);

    await collection.updateOne(
        { slug: 'building-my-portfolio-site' },
        { $set: { content: updatedContent } }
    );

    console.log('Post updated successfully.');
} finally {
    await client.close();
}
