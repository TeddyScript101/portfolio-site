import { BlogPost } from '@/app/type/blogPost';
import BlogHeader from '@/components/BlogHeader';
import BlogListClient from '@/components/BlogListClient';
import { getBaseUrl } from '@/lib/baseUrl';

async function getPosts(): Promise<BlogPost[]> {
    const baseUrl = getBaseUrl();

    try {
        const res = await fetch(`${baseUrl}/api/blog`, { cache: 'no-cache' });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export const metadata = {
    title: 'Blog | Teddy Yee',
    description: 'Technical articles and thoughts on software development by Teddy Yee.',
};

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#081B29] via-[#0D2D4A] to-[#134074]">
            <BlogHeader />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 max-w-4xl">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                    Blog
                </h1>
                <p className="text-gray-400 mb-10 text-lg">
                    Technical articles on software development, architecture, and things I find interesting.
                </p>

                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl">No posts yet. Stay tuned.</p>
                    </div>
                ) : (
                    <BlogListClient initialPosts={posts} />
                )}
            </main>
        </div>
    );
}
