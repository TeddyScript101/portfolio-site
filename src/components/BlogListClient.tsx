'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/app/type/blogPost';

type SortOrder = 'newest' | 'oldest';

type PaginatedResponse = {
    posts: BlogPost[];
    total: number;
    page: number;
    totalPages: number;
};

type Props = {
    initialPosts: BlogPost[];
};

const POSTS_PER_PAGE = 6;

// Build page number array with ellipsis
function getPaginationRange(current: number, total: number): (number | '...')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const result: (number | '...')[] = [1];
    if (current > 3) result.push('...');
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
        result.push(p);
    }
    if (current < total - 2) result.push('...');
    result.push(total);
    return result;
}

function highlight(text: string, query: string) {
    if (!query.trim()) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="bg-blue-400/30 text-blue-200 rounded-sm not-italic">
                {text.slice(idx, idx + query.length)}
            </mark>
            {text.slice(idx + query.length)}
        </>
    );
}

export default function BlogListClient({ initialPosts }: Props) {
    const [query, setQuery]               = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortOrder, setSortOrder]       = useState<SortOrder>('newest');
    const [currentPage, setCurrentPage]   = useState(1);

    const [posts, setPosts]           = useState<BlogPost[]>(() => initialPosts.slice(0, POSTS_PER_PAGE));
    const [totalPosts, setTotalPosts] = useState(initialPosts.length);
    const [loading, setLoading]       = useState(false);

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);

    const searchWrapperRef = useRef<HTMLDivElement>(null);
    const listTopRef       = useRef<HTMLDivElement>(null);
    const inputRef         = useRef<HTMLInputElement>(null);

    const totalPages   = Math.ceil(totalPosts / POSTS_PER_PAGE);
    const isFiltering  = debouncedQuery !== '' || selectedTags.length > 0 || sortOrder !== 'newest';
    const startItem    = (currentPage - 1) * POSTS_PER_PAGE + 1;
    const endItem      = Math.min(currentPage * POSTS_PER_PAGE, totalPosts);

    // Debounce search + reset page
    useEffect(() => {
        setCurrentPage(1);
        const timer = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Fetch / paginate whenever params or page changes
    useEffect(() => {
        if (!debouncedQuery && selectedTags.length === 0 && sortOrder === 'newest') {
            // No active filters: paginate client-side from initialPosts
            const start = (currentPage - 1) * POSTS_PER_PAGE;
            setPosts(initialPosts.slice(start, start + POSTS_PER_PAGE));
            setTotalPosts(initialPosts.length);
            return;
        }

        const params = new URLSearchParams();
        if (debouncedQuery)        params.set('q',     debouncedQuery);
        if (selectedTags.length)   params.set('tags',  selectedTags.join(','));
        if (sortOrder === 'oldest') params.set('sort',  'asc');
        params.set('page',  currentPage.toString());
        params.set('limit', POSTS_PER_PAGE.toString());

        const controller = new AbortController();
        setLoading(true);

        fetch(`/api/blog?${params}`, { signal: controller.signal })
            .then(r => r.json())
            .then((data: PaginatedResponse) => {
                setPosts(data.posts);
                setTotalPosts(data.total);
                setLoading(false);
            })
            .catch(err => {
                if (err.name !== 'AbortError') setLoading(false);
            });

        return () => controller.abort();
    }, [debouncedQuery, selectedTags, sortOrder, currentPage, initialPosts]);

    // Scroll to top of list on page change
    useEffect(() => {
        listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [currentPage]);

    // Tag chips and autocomplete always from full initialPosts
    const allTags = useMemo(() => {
        const set = new Set<string>();
        initialPosts.forEach(p => p.tags.forEach(t => set.add(t)));
        return Array.from(set).sort();
    }, [initialPosts]);

    const suggestions = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return initialPosts
            .filter(p => p.title.toLowerCase().includes(q))
            .map(p => p.title)
            .slice(0, 6);
    }, [query, initialPosts]);

    // Outside-click closes suggestions
    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
                setActiveSuggestion(-1);
            }
        };
        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    }, []);

    const selectSuggestion = useCallback((title: string) => {
        setQuery(title);
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        inputRef.current?.blur();
    }, []);

    const clearAll = useCallback(() => {
        setQuery('');
        setDebouncedQuery('');
        setSelectedTags([]);
        setSortOrder('newest');
        setCurrentPage(1);
        setShowSuggestions(false);
    }, []);

    const toggleTag = useCallback((tag: string) => {
        setCurrentPage(1);
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    }, []);

    const handleSortToggle = useCallback(() => {
        setCurrentPage(1);
        setSortOrder(o => o === 'newest' ? 'oldest' : 'newest');
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter' && activeSuggestion >= 0) {
            e.preventDefault();
            selectSuggestion(suggestions[activeSuggestion]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setActiveSuggestion(-1);
        }
    };

    const paginationRange = getPaginationRange(currentPage, totalPages);

    return (
        <div>
            {/* Search bar */}
            <div ref={searchWrapperRef} className="relative mb-5">
                <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setShowSuggestions(true); setActiveSuggestion(-1); }}
                        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search posts..."
                        autoComplete="off"
                        className="w-full bg-blue-900/20 border border-blue-400/20 rounded-xl pl-12 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50 focus:bg-blue-900/30 transition-all text-base"
                    />
                    {loading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <svg className="w-4 h-4 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    )}
                    {!loading && query && (
                        <button onClick={() => { setQuery(''); setShowSuggestions(false); inputRef.current?.focus(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors" aria-label="Clear search">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {showSuggestions && suggestions.length > 0 && (
                    <ul role="listbox" className="absolute z-30 w-full mt-2 bg-[#0a2038] border border-blue-400/30 rounded-xl overflow-hidden shadow-2xl">
                        {suggestions.map((title, i) => (
                            <li key={title} role="option" aria-selected={i === activeSuggestion}>
                                <button
                                    onMouseDown={() => selectSuggestion(title)}
                                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${i === activeSuggestion ? 'bg-blue-500/25 text-white' : 'text-gray-300 hover:bg-blue-500/10 hover:text-white'}`}
                                >
                                    <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    {highlight(title, query)}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Tag filters + Sort */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-8">
                <div className="flex flex-wrap gap-2 flex-1">
                    <button
                        onClick={() => { setCurrentPage(1); setSelectedTags([]); }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedTags.length === 0 ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-blue-900/30 text-gray-400 border border-blue-400/20 hover:border-blue-400/50 hover:text-gray-200'}`}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedTags.includes(tag) ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-blue-900/30 text-gray-400 border border-blue-400/20 hover:border-blue-400/50 hover:text-gray-200'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSortToggle}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-900/30 text-gray-400 border border-blue-400/20 hover:border-blue-400/50 hover:text-gray-200 transition-all duration-200 shrink-0 self-start"
                >
                    <svg className={`w-4 h-4 transition-transform duration-300 ${sortOrder === 'oldest' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
                </button>
            </div>

            {/* Anchor for scroll-on-page-change */}
            <div ref={listTopRef} className="-mt-24 pt-24 pointer-events-none" aria-hidden />

            {/* Results summary */}
            {totalPosts > 0 && (
                <p className="text-sm text-gray-500 mb-5">
                    {isFiltering
                        ? `${totalPosts} ${totalPosts === 1 ? 'post' : 'posts'} found`
                        : `Showing ${startItem}–${endItem} of ${totalPosts} posts`
                    }
                </p>
            )}

            {/* Post list */}
            <div className={`transition-opacity duration-150 ${loading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                {posts.length === 0 && !loading ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl">No posts match your search.</p>
                        <button onClick={clearAll} className="mt-4 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <article key={post.slug} className="bg-blue-900/20 border border-blue-400/20 rounded-2xl p-6 hover:border-blue-400/50 hover:bg-blue-900/30 transition-all duration-300 group">
                                <Link href={`/blog/${post.slug}`}>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {post.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${selectedTags.includes(tag) ? 'bg-blue-500/40 text-blue-200' : 'bg-blue-500/20 text-blue-300'}`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-400 mb-4 leading-relaxed">{post.excerpt}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <time>
                                                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </time>
                                            {post.readTime && (
                                                <>
                                                    <span className="text-gray-600">·</span>
                                                    <span>{post.readTime} min read</span>
                                                </>
                                            )}
                                        </div>
                                        <span className="text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1">
                                            Read more
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-10 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        {/* Prev button */}
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white hover:bg-blue-900/40 border border-transparent hover:border-blue-400/20"
                            aria-label="Previous page"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Prev
                        </button>

                        {/* Page numbers */}
                        <div className="flex items-center gap-1">
                            {paginationRange.map((item, i) =>
                                item === '...' ? (
                                    <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-600 text-sm select-none">
                                        ···
                                    </span>
                                ) : (
                                    <button
                                        key={item}
                                        onClick={() => setCurrentPage(item as number)}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            currentPage === item
                                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                                : 'text-gray-400 hover:text-white hover:bg-blue-900/40 border border-transparent hover:border-blue-400/20'
                                        }`}
                                        aria-label={`Page ${item}`}
                                        aria-current={currentPage === item ? 'page' : undefined}
                                    >
                                        {item}
                                    </button>
                                )
                            )}
                        </div>

                        {/* Next button */}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white hover:bg-blue-900/40 border border-transparent hover:border-blue-400/20"
                            aria-label="Next page"
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Page indicator */}
                    <p className="text-xs text-gray-600">
                        Page {currentPage} of {totalPages}
                    </p>
                </div>
            )}
        </div>
    );
}
