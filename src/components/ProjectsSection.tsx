import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/app/type/project';
import { TechChip } from '@/components/TechChip';

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
                                    style={{ objectPosition: project.thumbnailPosition ?? 'center' }}
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

                                {/* Buttons */}
                                <div className="mt-auto flex flex-wrap gap-2">
                                    {project.demoUrls.map((demo) => (
                                        <a
                                            key={demo.url}
                                            href={demo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            {demo.label}
                                        </a>
                                    ))}

                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
