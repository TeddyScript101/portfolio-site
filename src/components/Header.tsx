"use client";

import { useState, useEffect } from "react";

type NavItem = {
    name: string;
    id: string;
};

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setMobileMenuOpen(false);
        }
    };

    const navItems: NavItem[] = [
        { name: "Home", id: "home" },
        { name: "About", id: "about" },
        // { name: "Projects", id: "projects" },
        { name: "Contact", id: "contact" },
    ];

    return (
        <header
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-[#081B29]/90 backdrop-blur-sm py-2 shadow-lg"
                : "bg-transparent py-4"
                }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => scrollToSection("home")}
                            className="text-white font-bold text-xl hover:text-blue-300 transition-colors"
                            aria-label="Scroll to home section"
                        >
                            <span className="text-blue-400 text-3xl">{`</>`}</span>
                        </button>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-xl font-medium transition-colors"
                                aria-label={`Scroll to ${item.name} section`}
                            >
                                {item.name}
                            </button>
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
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="text-white hover:bg-blue-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                                aria-label={`Scroll to ${item.name} section`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
