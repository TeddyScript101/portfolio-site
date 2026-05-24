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
        demoUrl: 'https://coffee-shop-frontend-sandy.vercel.app/',
        githubUrl: 'https://github.com/TeddyScript101/coffee-shop-frontend',
        techStack: ['ReactJS', 'TypeScript', 'Tailwind', 'Storybook'],
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
            'Interactive component library for the BeanWorks design system. Browse and test UI components — auth forms, product cards, membership cards, badges, and more — with live controls and documentation.',
        thumbnail: '/projects/beanworks-storybook.png',
        demoUrl: 'https://coffee-shop-storybook.vercel.app/?path=/docs/components-membership-membershipcard--docs',
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
        slug: 'beanworks-api-swagger',
        title: 'BeanWorks – REST API (Swagger)',
        description:
            'The BeanWorks backend REST API documented with Swagger / OpenAPI 3.0. Covers auth, products, and orders with JWT-protected endpoints.',
        thumbnail: '/projects/beanworks-swagger.png',
        demoUrl: 'https://coffee-shop-frontend-sandy.vercel.app/swagger',
        githubUrl: 'https://github.com/TeddyScript101/dotnetCoffeeShopBackend',
        techStack: ['ASP.NET', 'C#', 'PostgreSQL', 'Docker', 'Swagger'],
        relatedBlogs: [
            {
                title: 'Building a coffee shop API with .NET 10, EF Core TPT inheritance, and JWT auth',
                slug: 'building-coffee-shop-api-dotnet-ef-core-tpt',
            },
        ],
        order: 3,
    },
    {
        slug: 'beanworks-api-scalar',
        title: 'BeanWorks – REST API (Scalar)',
        description:
            'The same BeanWorks REST API presented through the Scalar interactive documentation UI, with client library snippets and live test requests.',
        thumbnail: '/projects/beanworks-scalar.png',
        demoUrl: 'https://coffee-shop-frontend-sandy.vercel.app/scalar',
        githubUrl: 'https://github.com/TeddyScript101/dotnetCoffeeShopBackend',
        techStack: ['ASP.NET', 'C#', 'PostgreSQL', 'Docker', 'Scalar'],
        relatedBlogs: [
            {
                title: 'Building a coffee shop API with .NET 10, EF Core TPT inheritance, and JWT auth',
                slug: 'building-coffee-shop-api-dotnet-ef-core-tpt',
            },
        ],
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
