'use client';

import { useRef, useState, Children, isValidElement } from 'react';
import type { ReactNode } from 'react';

const LANGUAGE_NAMES: Record<string, string> = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    tsx: 'TSX',
    jsx: 'JSX',
    css: 'CSS',
    html: 'HTML',
    json: 'JSON',
    bash: 'Bash',
    sh: 'Shell',
    shell: 'Shell',
    zsh: 'Shell',
    py: 'Python',
    python: 'Python',
    sql: 'SQL',
    md: 'Markdown',
    yaml: 'YAML',
    yml: 'YAML',
    go: 'Go',
    rust: 'Rust',
    java: 'Java',
    c: 'C',
    cpp: 'C++',
    cs: 'C#',
};

function extractLanguage(children: ReactNode): string {
    for (const child of Children.toArray(children)) {
        if (isValidElement(child)) {
            const props = child.props as { className?: string };
            const match = (props.className ?? '').match(/language-(\w+)/);
            if (match) return match[1];
        }
    }
    return '';
}

export default function CodeBlock({ children }: { children: ReactNode }) {
    const preRef = useRef<HTMLPreElement>(null);
    const [copied, setCopied] = useState(false);

    const rawLang = extractLanguage(children);
    const displayLang =
        LANGUAGE_NAMES[rawLang] ?? (rawLang ? rawLang.toUpperCase() : 'CODE');

    const handleCopy = async () => {
        const text = preRef.current?.textContent ?? '';
        try {
            await navigator.clipboard.writeText(text.trimEnd());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard API not available
        }
    };

    return (
        <div className="relative my-7 rounded-xl overflow-hidden border border-white/10 shadow-xl shadow-black/40">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e2030] border-b border-white/8">
                <div className="flex items-center gap-2">
                    {/* Window dots */}
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                    <span className="ml-3 text-xs font-mono text-gray-500 tracking-wide select-none">
                        {displayLang}
                    </span>
                </div>

                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-all duration-200 ${
                        copied
                            ? 'text-green-400 bg-green-400/10'
                            : 'text-gray-500 hover:text-gray-200 hover:bg-white/8'
                    }`}
                    aria-label="Copy code"
                >
                    {copied ? (
                        <>
                            <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                            Copy
                        </>
                    )}
                </button>
            </div>

            {/* Code area */}
            <pre
                ref={preRef}
                className="overflow-x-auto text-sm leading-relaxed p-5 m-0 bg-[#282c34]"
            >
                {children}
            </pre>
        </div>
    );
}
