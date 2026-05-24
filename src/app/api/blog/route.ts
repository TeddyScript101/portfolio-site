import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

const POSTS_PER_PAGE = 6;

function calcReadTime(content: string): number {
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q         = searchParams.get('q')?.trim() ?? '';
        const tagsParam = searchParams.get('tags')?.trim() ?? '';
        const sort      = searchParams.get('sort') === 'asc' ? 1 : -1;
        const pageParam = searchParams.get('page');
        const paginated = pageParam !== null;
        const page      = paginated ? Math.max(1, parseInt(pageParam)) : 1;
        const limit     = parseInt(searchParams.get('limit') ?? String(POSTS_PER_PAGE));

        const client = await clientPromise;
        const db     = client.db('portfolio-site');
        const col    = db.collection('blogs');

        // Build filter
        const filter: Record<string, unknown> = { published: true };

        if (q) {
            filter.$or = [
                { title:   { $regex: q, $options: 'i' } },
                { excerpt: { $regex: q, $options: 'i' } },
            ];
        }

        if (tagsParam) {
            const tags = tagsParam.split(',').filter(Boolean);
            if (tags.length > 0) filter.tags = { $in: tags };
        }

        if (paginated) {
            // Paginated response: { posts, total, page, totalPages }
            const [total, rawPosts] = await Promise.all([
                col.countDocuments(filter),
                col.find(filter)
                    .sort({ date: sort })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .toArray(),
            ]);

            const posts = rawPosts.map((post) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { content: _content, ...rest } = post;
                return { ...rest, _id: post._id.toString(), readTime: calcReadTime(post.content ?? '') };
            });

            return NextResponse.json({
                posts,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            });
        } else {
            // Full list (no pagination) — used by server component for initialPosts
            const rawPosts = await col.find(filter).sort({ date: sort }).toArray();

            const posts = rawPosts.map((post) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { content: _content, ...rest } = post;
                return { ...rest, _id: post._id.toString(), readTime: calcReadTime(post.content ?? '') };
            });

            return NextResponse.json(posts);
        }
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
