'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/app/type/project';

// Re-use the same CDN helpers from HomeClient
const si = (slug: string, color = 'c4b5fd') =>
    `https://cdn.simpleicons.org/${slug}/${color}`;
const sk = (slug: string) =>
    `https://skillicons.dev/icons?i=${slug}&theme=dark`;

const TECH_ICONS: Record<string, string> = {
    'ReactJS':    sk('react'),
    'Next.js':    sk('nextjs'),
    'TypeScript': sk('ts'),
    'Tailwind':   sk('tailwind'),
    'Node.js':    sk('nodejs'),
    'Express':    sk('express'),
    'Nest.js':    sk('nestjs'),
    'ASP.NET':    sk('dotnet'),
    'C#':         sk('cs'),
    'MongoDB':    sk('mongodb'),
    'PostgreSQL': sk('postgres'),
    'MySQL':      sk('mysql'),
    'Docker':     sk('docker'),
    'Python':     sk('python'),
    'Java':       sk('java'),
    'Azure':      sk('azure'),
    'GCP':        sk('gcp'),
    'Redis':      sk('redis'),
    'Swagger':    si('swagger', '85ea2d'),
    'Scalar':     si('scalar', 'c4b5fd'),
    'Storybook':  si('storybook', 'ff4785'),
    'EF Core':    sk('dotnet'),
    'JWT':        si('jsonwebtokens', 'c4b5fd'),
};

function TechChip({ name }: { name: string }) {
    const iconUrl = TECH_ICONS[name];
    return (
        <span className="inline-flex items-center gap-1.5 bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
            {iconUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={iconUrl} alt="" width={14} height={14} className="w-3.5 h-3.5 shrink-0" />
            )}
            {name}
        </span>
    );
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
    return (
        <section id="projects" className="min-h-screen pt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
                    My <span className="text-blue-400">Projects</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project.slug}
                            className="bg-blue-900/20 rounded-2xl border border-blue-400/20 overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:border-blue-400/50"
                        >
                            {/* Thumbnail */}
                            <div className="relative w-full aspect-video bg-blue-900/40">
                                <Image
                                    src={project.thumbnail}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            {/* Card body */}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {project.title}
                                </h3>

                                {project.description && (
                                    <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-1">
                                        {project.description}
                                    </p>
                                )}

                                {/* Tech stack */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.techStack.map((tech) => (
                                        <TechChip key={tech} name={tech} />
                                    ))}
                                </div>

                                {/* Related blogs */}
                                {project.relatedBlogs.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-gray-500 text-xs mb-1.5 uppercase tracking-wide">Related posts</p>
                                        <ul className="space-y-1">
                                            {project.relatedBlogs.map((blog) => (
                                                <li key={blog.slug}>
                                                    <Link
                                                        href={`/blog/${blog.slug}`}
                                                        className="text-blue-400 hover:text-blue-300 text-sm underline underline-offset-2 transition-colors"
                                                    >
                                                        {blog.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Demo link */}
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 w-fit"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Live Demo
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
