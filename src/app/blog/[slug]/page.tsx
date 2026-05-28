import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlogPost } from '@/app/type/blogPost';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
        <div className="min-h-screen bg-gradient-to-br from-[#081B29] via-[#0D2D4A] to-[#134074] flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20 max-w-3xl">
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

                    {(post.demoUrl || post.githubUrl) && (
                        <div className="flex flex-wrap gap-3 mt-6">
                            {post.demoUrl && (
                                <a
                                    href={post.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Live Demo
                                </a>
                            )}
                            {post.githubUrl && (
                                <a
                                    href={post.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-blue-900/50 hover:bg-blue-900/80 border border-blue-400/40 hover:border-blue-400/70 text-blue-300 hover:text-blue-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    GitHub
                                </a>
                            )}
                        </div>
                    )}
                </header>

                {/* Divider */}
                <div className="border-t border-blue-400/20 mb-10" />

                {/* Markdown content — strip leading # heading to avoid duplicating the title above */}
                <MarkdownRenderer content={post.content.replace(/^#[^\n]*\n+/, '')} />
            </main>
            <Footer />
        </div>
    );
}
