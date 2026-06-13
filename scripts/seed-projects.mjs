/**
 * Seeds the projects collection in MongoDB.
 * Usage: node scripts/seed-projects.mjs
 */
import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';

const uri =
    process.env.MONGODB_URI ??
    (() => {
        try {
            const raw = readFileSync(new URL('../.env', import.meta.url), 'utf8');
            const match = raw.match(/^MONGODB_URI=(.+)$/m);
            if (match) return match[1].trim();
        } catch { /* ignore */ }
        throw new Error('MONGODB_URI not found');
    })();

const projects = [
    {
        slug: 'beanworks-frontend',
        title: 'BeanWorks – Coffee Shop Frontend',
        description:
            'A full-featured coffee shop e-commerce site with product browsing, a shopping cart, membership tiers, and sign-in. Built with Next.js and Tailwind CSS.',
        thumbnail: '/projects/beanworks-frontend.png',
        demoUrls: [
            { label: 'Live Demo', url: 'https://teddyyee-coffee-shop-frontend.vercel.app/' },
        ],
        githubUrl: 'https://github.com/TeddyScript101/coffee-shop-frontend',
        techStack: ['ReactJS', 'TypeScript', 'Tailwind', 'Storybook', 'Playwright'],
        relatedBlogs: [
            {
                title: 'How I structured a React frontend for a coffee shop app',
                slug: 'beanworks-react-frontend-structure',
            },
        ],
        order: 1,
    },
    {
        slug: 'beanworks-storybook',
        title: 'BeanWorks – Component Library (Storybook)',
        description:
            'Interactive component library for the BeanWorks design system. Browse and test UI components including auth forms, product cards, membership cards, and badges, all with live controls and documentation.',
        thumbnail: '/projects/beanworks-storybook.png',
        demoUrls: [
            { label: 'Live Demo', url: 'https://coffee-shop-storybook.vercel.app/?path=/docs/components-membership-membershipcard--docs' },
        ],
        githubUrl: 'https://github.com/TeddyScript101/coffee-shop-frontend',
        techStack: ['Storybook', 'ReactJS', 'TypeScript', 'Tailwind'],
        relatedBlogs: [
            {
                title: 'How I structured a React frontend for a coffee shop app',
                slug: 'beanworks-react-frontend-structure',
            },
        ],
        order: 2,
    },
    {
        slug: 'beanworks-api',
        title: 'BeanWorks – REST API',
        description:
            'The BeanWorks backend REST API documented with both Swagger / OpenAPI 3.0 and Scalar. Covers auth, products, and orders with JWT-protected endpoints.',
        thumbnail: '/projects/beanworks-swagger.png',
        demoUrls: [
            { label: 'Swagger', url: 'https://coffeeshopapi.fly.dev/swagger/index.html' },
            { label: 'Scalar', url: 'https://coffeeshopapi.fly.dev/scalar/#tag/health' },
        ],
        githubUrl: 'https://github.com/TeddyScript101/dotnetCoffeeShopBackend',
        techStack: ['ASP.NET', 'C#', 'PostgreSQL', 'Docker', 'Swagger', 'Scalar', 'xUnit'],
        relatedBlogs: [
            {
                title: 'Building a coffee shop API with .NET 10, EF Core TPT inheritance, and JWT auth',
                slug: 'building-coffee-shop-api-dotnet-ef-core-tpt',
            },
        ],
        order: 3,
    },
    {
        slug: 'basketball-shot-analyzer',
        title: 'Basketball Shot Analyzer',
        description:
            'Upload a video of your jump shot and get instant AI-powered feedback. MediaPipe Pose detects release angle, elbow extension, knee bend, and shoulder alignment, then scores your form and generates prioritised coaching recommendations.',
        thumbnail: '/projects/basketball-shot-analyzer.jpg',
        demoUrls: [
            { label: 'Live Demo', url: 'https://teddyscript101.github.io/basketball-shot-analyzer/demo' },
        ],
        githubUrl: 'https://github.com/TeddyScript101/basketball-shot-analyzer',
        techStack: ['Next.js', 'TypeScript', 'FastAPI', 'Python', 'MediaPipe', 'PostgreSQL', 'Docker'],
        relatedBlogs: [],
        order: 4,
    },
];

const client = new MongoClient(uri, { tls: true });

try {
    await client.connect();
    const db = client.db('portfolio-site');
    const col = db.collection('projects');

    for (const project of projects) {
        const result = await col.updateOne(
            { slug: project.slug },
            { $set: project },
            { upsert: true }
        );
        const action = result.upsertedCount ? 'inserted' : 'updated';
        console.log(`${action}: ${project.slug}`);
    }

    console.log('\nDone. Projects collection seeded.');
} finally {
    await client.close();
}
