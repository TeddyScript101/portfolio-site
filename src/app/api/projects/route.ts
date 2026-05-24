import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('portfolio-site');
        const projects = await db
            .collection('projects')
            .find({})
            .sort({ order: 1 })
            .toArray();

        const serialized = projects.map((p) => ({
            ...p,
            _id: p._id.toString(),
        }));

        return NextResponse.json(serialized);
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
