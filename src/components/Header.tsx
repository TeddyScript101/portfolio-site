"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
    name: string;
    href: string;
    isSection: boolean;
};

const navItems: NavItem[] = [
    { name: "Home",     href: "home",     isSection: true  },
    { name: "About",    href: "about",    isSection: true  },
    { name: "Blog",     href: "/blog",    isSection: false },
    { name: "Projects", href: "projects", isSection: true  },
    { name: "Contact",  href: "contact",  isSection: true  },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const pathname = usePathname();
    const headerRef = useRef<HTMLElement>(null);
    const isHome = pathname === "/";

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!isHome) return;
        const sectionIds = navItems.filter(i => i.isSection).map(i => i.href);
        const handleScroll = () => {
            const scrollY = window.scrollY + 120;
            let current = sectionIds[0];
            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (el && el.offsetTop <= scrollY) current = id;
            }
            setActiveSection(current);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHome]);

    useEffect(() => {
        const onMouseDown = (e: MouseEvent) => {
            if (mobileMenuOpen && headerRef.current && !headerRef.current.contains(e.target as Node)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", onMouseDown);
        return () => document.removeEventListener("mousedown", onMouseDown);
    }, [mobileMenuOpen]);

    const resolvedHref = (item: NavItem) => {
        if (!item.isSection) return item.href;
        return isHome ? `#${item.href}` : `/#${item.href}`;
    };

    const handleClick = (item: NavItem) => {
        setMobileMenuOpen(false);
        if (item.isSection && isHome) {
            document.getElementById(item.href)?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const isActive = (item: NavItem) => {
        if (!item.isSection) return pathname.startsWith(item.href);
        return isHome && activeSection === item.href;
    };

    return (
        <header
            ref={headerRef}
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-brand-dark/90 backdrop-blur-sm py-2 shadow-lg"
                    : "bg-transparent py-4"
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        {isHome ? (
                            <button
                                onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
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
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={resolvedHref(item)}
                                onClick={() => handleClick(item)}
                                className={`px-3 py-2 rounded-md text-xl font-medium transition-colors relative ${
                                    isActive(item)
                                        ? 'text-blue-400 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-blue-400 after:rounded-full'
                                        : 'text-white hover:text-blue-300'
                                }`}
                                aria-label={item.isSection ? `Go to ${item.name} section` : undefined}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile hamburger */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
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
                <div className="md:hidden bg-brand-dark/95 backdrop-blur-sm">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={resolvedHref(item)}
                                onClick={() => handleClick(item)}
                                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                                    isActive(item)
                                        ? 'text-blue-400 bg-blue-900/30'
                                        : 'text-white hover:bg-blue-800 hover:text-white'
                                }`}
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
