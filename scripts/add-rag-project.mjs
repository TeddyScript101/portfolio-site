/**
 * Upserts the RAG demo project and adds new skills to the profile.
 * Usage: node scripts/add-rag-project.mjs
 */
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';

const uri =
    process.env.MONGODB_URI ??
    (() => {
        const raw = readFileSync(new URL('../.env', import.meta.url), 'utf8');
        const match = raw.match(/^MONGODB_URI=(.+)$/m);
        if (match) return match[1].trim();
        throw new Error('MONGODB_URI not found');
    })();

const client = new MongoClient(uri, { tls: true });

const RAG_PROJECT = {
    slug: 'rag-portfolio-demo',
    title: 'AI Portfolio RAG Demo',
    description:
        'An interactive chat interface that answers questions about my background using Retrieval-Augmented Generation. Documents are injected into the LLM context at runtime with streaming responses, inline citation source pills, and a document viewer panel. Includes a read-only /chat/demo route for sharing with interviewers without exposing API quota.',
    thumbnail: '/projects/rag-portfolio-demo.png',
    demoUrls: [
        { label: 'Live Demo', url: 'https://rag-demo-qnrx.vercel.app/' },
    ],
    githubUrl: 'https://github.com/TeddyScript101/rag-demo',
    techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'Groq', 'RAG'],
    relatedBlogs: [
        {
            title: 'Building a RAG portfolio assistant with Next.js and Groq',
            slug: 'rag-portfolio-assistant-nextjs-groq',
        },
    ],
    order: 5,
};

const NEW_SKILLS = [
    { name: 'Groq API', level: 78, tech: 'Groq' },
    { name: 'LLM Integration', level: 80, tech: 'AI' },
    { name: 'RAG', level: 75, tech: 'RAG' },
];

try {
    await client.connect();
    const db = client.db('portfolio-site');

    // Upsert project
    const projects = db.collection('projects');
    const r = await projects.updateOne(
        { slug: RAG_PROJECT.slug },
        { $set: RAG_PROJECT },
        { upsert: true }
    );
    console.log(r.upsertedCount ? '✓ Inserted project' : '✓ Updated project', RAG_PROJECT.title);

    // Add skills (skip any already present by name)
    const profiles = db.collection('profiles');
    const profile = await profiles.findOne({});
    const existingNames = new Set((profile?.skills ?? []).map(s => s.name));

    const toAdd = NEW_SKILLS.filter(s => !existingNames.has(s.name));
    if (toAdd.length === 0) {
        console.log('✓ All skills already present, nothing to add');
    } else {
        await profiles.updateOne(
            {},
            { $push: { skills: { $each: toAdd } } }
        );
        console.log('✓ Added skills:', toAdd.map(s => s.name).join(', '));
    }
} finally {
    await client.close();
}
