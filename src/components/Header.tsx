"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
    name: string;
    id: string;
};

const navItems: NavItem[] = [
    { name: "Home",     id: "home"     },
    { name: "About",    id: "about"    },
    { name: "Projects", id: "projects" },
    { name: "Contact",  id: "contact"  },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/";

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSectionClick = (id: string) => {
        setMobileMenuOpen(false);
        if (isHome) {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }
        // When not on home page the link navigates via href="/#id" (handled by <Link>)
    };

    const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-[#081B29]/90 backdrop-blur-sm py-2 shadow-lg"
                    : "bg-transparent py-4"
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        {isHome ? (
                            <button
                                onClick={() => handleSectionClick("home")}
                                className="text-white font-bold text-xl hover:text-blue-300 transition-colors"
                                aria-label="Scroll to home section"
                            >
                                <span className="text-blue-400 text-3xl">{`</>`}</span>
                            </button>
                        ) : (
                            <Link
                                href="/"
                                className="text-white font-bold text-xl hover:text-blue-300 transition-colors"
                                aria-label="Go to home page"
                            >
                                <span className="text-blue-400 text-3xl">{`</>`}</span>
                            </Link>
                        )}
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex space-x-8">
                        {/* Home + About */}
                        {navItems.slice(0, 2).map((item) => (
                            <Link
                                key={item.id}
                                href={sectionHref(item.id)}
                                onClick={() => isHome && handleSectionClick(item.id)}
                                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-xl font-medium transition-colors"
                                aria-label={`Go to ${item.name} section`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Blog */}
                        <Link
                            href="/blog"
                            className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-xl font-medium transition-colors"
                        >
                            Blog
                        </Link>

                        {/* Projects + Contact */}
                        {navItems.slice(2).map((item) => (
                            <Link
                                key={item.id}
                                href={sectionHref(item.id)}
                                onClick={() => isHome && handleSectionClick(item.id)}
                                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-xl font-medium transition-colors"
                                aria-label={`Go to ${item.name} section`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile hamburger */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white hover:text-blue-300 focus:outline-none"
                            aria-label="Toggle menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#081B29]/95 backdrop-blur-sm">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        {navItems.slice(0, 2).map((item) => (
                            <Link
                                key={item.id}
                                href={sectionHref(item.id)}
                                onClick={() => handleSectionClick(item.id)}
                                className="text-white hover:bg-blue-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/blog"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-white hover:bg-blue-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                        >
                            Blog
                        </Link>
                        {navItems.slice(2).map((item) => (
                            <Link
                                key={item.id}
                                href={sectionHref(item.id)}
                                onClick={() => handleSectionClick(item.id)}
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
