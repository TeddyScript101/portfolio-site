'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import 'highlight.js/styles/atom-one-dark.css';
import CodeBlock from '@/components/CodeBlock';

type Props = {
    content: string;
};

export default function MarkdownRenderer({ content }: Props) {
    return (
        <div className="prose-blog">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug, rehypeHighlight]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-white mt-10 mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold text-white mt-8 mb-3 border-b border-blue-400/20 pb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-semibold text-blue-200 mt-6 mb-2">{children}</h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="text-lg font-semibold text-blue-300 mt-4 mb-2">{children}</h4>
                    ),
                    p: ({ children }) => (
                        <p className="text-gray-300 leading-7 mb-5">{children}</p>
                    ),
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                        >
                            {children}
                        </a>
                    ),
                    ul: ({ children }) => (
                        <ul className="list-disc list-outside pl-6 mb-5 space-y-1 text-gray-300">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-outside pl-6 mb-5 space-y-1 text-gray-300">{children}</ol>
                    ),
                    li: ({ children }) => (
                        <li className="leading-7">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-400 pl-5 my-6 text-gray-400 italic">
                            {children}
                        </blockquote>
                    ),
                    // Block code: delegate to CodeBlock for header + copy button
                    pre: ({ children }) => (
                        <CodeBlock>{children}</CodeBlock>
                    ),
                    // Inline code only (block code is handled by pre above)
                    code: ({ children, className }) => {
                        const isBlock = className?.includes('language-');
                        if (isBlock) {
                            // Pass through — CodeBlock will render this inside <pre>
                            return <code className={className}>{children}</code>;
                        }
                        return (
                            <code className="bg-white/8 text-blue-200 px-1.5 py-0.5 rounded text-[0.875em] font-mono border border-white/10">
                                {children}
                            </code>
                        );
                    },
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-6">
                            <table className="w-full text-sm text-gray-300 border-collapse">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-blue-900/40 text-blue-200">{children}</thead>
                    ),
                    th: ({ children }) => (
                        <th className="px-4 py-3 text-left font-semibold border border-blue-400/20">{children}</th>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 py-3 border border-blue-400/20">{children}</td>
                    ),
                    tr: ({ children }) => (
                        <tr className="even:bg-blue-900/20">{children}</tr>
                    ),
                    hr: () => (
                        <hr className="border-blue-400/20 my-8" />
                    ),
                    strong: ({ children }) => (
                        <strong className="font-semibold text-white">{children}</strong>
                    ),
                    em: ({ children }) => (
                        <em className="italic text-gray-300">{children}</em>
                    ),
                    img: ({ src, alt }) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={src}
                            alt={alt ?? ''}
                            className="rounded-xl max-w-full my-6 border border-blue-400/20"
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
