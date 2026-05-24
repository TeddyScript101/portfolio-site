import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlogPost } from '@/app/type/blogPost';
import BlogHeader from '@/components/BlogHeader';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { getBaseUrl } from '@/lib/baseUrl';

function calcReadTime(content: string): number {
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
}

async function getPost(slug: string): Promise<BlogPost | null> {
    const baseUrl = getBaseUrl();

    try {
        const res = await fetch(`${baseUrl}/api/blog/${slug}`, { cache: 'no-cache' });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const readTime = calcReadTime(post.content);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#081B29] via-[#0D2D4A] to-[#134074]">
            <BlogHeader />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20 max-w-3xl">
                {/* Back link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-10 text-sm font-medium"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Blog
                </Link>

                {/* Post header */}
                <header className="mb-10">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs font-medium bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <time>
                            {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                        <span className="text-gray-600">·</span>
                        <span>{readTime} min read</span>
                    </div>
                </header>

                {/* Divider */}
                <div className="border-t border-blue-400/20 mb-10" />

                {/* Markdown content — strip leading # heading to avoid duplicating the title above */}
                <MarkdownRenderer content={post.content.replace(/^#[^\n]*\n+/, '')} />
            </main>
        </div>
    );
}
