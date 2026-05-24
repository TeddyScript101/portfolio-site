import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const client = await clientPromise;
        const db = client.db('portfolio-site');
        const collection = db.collection('blogs');

        const post = await collection.findOne({ slug, published: true });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ ...post, _id: post._id.toString() });
    } catch (error) {
        console.error('Failed to fetch blog post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
