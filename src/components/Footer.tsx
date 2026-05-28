export default function Footer() {
    return (
        <footer className="bg-[#081B29] border-t border-blue-400/10 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500 font-mono">
                <span>© {new Date().getFullYear()} Teddy Yee</span>
                <span className="hidden sm:block text-gray-700">·</span>
                <span>
                    Built with{' '}
                    <span className="text-blue-400/70">Next.js</span>
                    {' · '}
                    <span className="text-blue-400/70">TypeScript</span>
                    {' · '}
                    <span className="text-blue-400/70">MongoDB</span>
                </span>
            </div>
        </footer>
    );
}
