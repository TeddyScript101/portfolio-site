'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/#home' },
        { name: 'About', href: '/#about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/#contact' },
    ];

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-[#081B29]/90 backdrop-blur-sm py-2 shadow-lg'
                    : 'bg-transparent py-4'
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="text-white font-bold text-xl hover:text-blue-300 transition-colors"
                            aria-label="Go to home page"
                        >
                            <span className="text-blue-400 text-3xl">{`</>`}</span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-xl font-medium transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white hover:text-blue-300 focus:outline-none"
                            aria-label="Toggle menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {mobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-[#081B29]/95 backdrop-blur-sm">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white hover:bg-blue-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
