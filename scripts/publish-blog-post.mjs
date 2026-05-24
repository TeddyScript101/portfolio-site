/**
 * Reads a blog post from a JSON file and upserts it into MongoDB.
 * Usage: node scripts/publish-blog-post.mjs <path-to-post.json>
 */
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';

const uri = process.env.MONGODB_URI
    ?? readEnvFile();

function readEnvFile() {
    try {
        const raw = readFileSync(new URL('../.env', import.meta.url), 'utf8');
        const match = raw.match(/^MONGODB_URI=(.+)$/m);
        if (match) return match[1].trim();
    } catch { /* ignore */ }
    throw new Error('MONGODB_URI not found. Set it as an env var or in .env');
}

const jsonPath = process.argv[2];
if (!jsonPath) {
    console.error('Usage: node scripts/publish-blog-post.mjs <path-to-post.json>');
    process.exit(1);
}

const post = JSON.parse(readFileSync(jsonPath, 'utf8'));

// Validate required fields
const required = ['slug', 'title', 'date', 'tags', 'excerpt', 'content'];
for (const field of required) {
    if (!post[field]) {
        console.error(`Missing required field: ${field}`);
        process.exit(1);
    }
}

const client = new MongoClient(uri, { tls: true, tlsAllowInvalidCertificates: false });

try {
    await client.connect();
    const db = client.db('portfolio-site');
    const collection = db.collection('blogs');

    const result = await collection.replaceOne(
        { slug: post.slug },
        { ...post, published: post.published ?? true },
        { upsert: true }
    );

    if (result.upsertedCount > 0) {
        console.log(`✓ Published new post: "${post.title}"`);
        console.log(`  → /blog/${post.slug}`);
    } else {
        console.log(`✓ Updated existing post: "${post.title}"`);
        console.log(`  → /blog/${post.slug}`);
    }
} finally {
    await client.close();
}
