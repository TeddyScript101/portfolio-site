'use client';

import { AnimatedCounter } from '@/components/AnimatedCounter';
import Header from '@/components/Header';
import ProjectsSection from '@/components/ProjectsSection';
import { useInView } from 'react-intersection-observer';
import { LinkedInIcon } from '@/icon/LinkedInIcon';
import { EmailIcon } from '@/icon/EmailIcon';
import { InstagramIcon } from '@/icon/InstagramIcon';
import { Education, ProfileData, Skill, Social, WorkExp } from '@/app/type/profileData';
import { Project } from '@/app/type/project';
import Image from 'next/image';
import Link from 'next/link';

// CDN helpers
const si = (slug: string, color = 'c4b5fd') =>
    `https://cdn.simpleicons.org/${slug}/${color}`;
const sk = (slug: string) =>
    `https://skillicons.dev/icons?i=${slug}&theme=dark`;

// URL-based icons (CDN)
const TECH_ICONS: Record<string, string> = {
    'ReactJS':        sk('react'),
    'React Native':   sk('react'),
    'Next.js':        sk('nextjs'),
    'TypeScript':     sk('ts'),
    'Tailwind':       sk('tailwind'),
    'Material UI':    sk('materialui'),
    'Node.js':        sk('nodejs'),
    'Express':        sk('express'),
    'Nest.js':        sk('nestjs'),
    'MongoDB':        sk('mongodb'),
    'PostgreSQL':     sk('postgres'),
    'MySQL':          sk('mysql'),
    'Docker':         sk('docker'),
    'Python':         sk('python'),
    'Java':           sk('java'),
    'C#':             sk('cs'),
    'ASP.NET':        sk('dotnet'),
    'Azure':          sk('azure'),
    'Kubernetes':     sk('kubernetes'),
    'Terraform':      sk('terraform'),
    'GCP':            sk('gcp'),
    'Jenkins':        sk('jenkins'),
    'Android Native': sk('androidstudio'),
    'Storybook':       si('storybook', 'ff4785'),
    'Swagger':         si('swagger', '85ea2d'),
    'Claude Code':     si('anthropic'),
    'GitHub Copilot':  si('githubcopilot'),
    'Gemini':          si('googlegemini'),
    'Antigravity IDE': 'https://antigravity.google/assets/image/brand/antigravity-icon__full-color.png',
};

// Inline SVG icons for tools not available on any CDN (fill="currentColor" inherits chip text colour)
const TECH_SVG: Record<string, React.ReactElement> = {
    'ChatGPT': (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073zm-9.022 12.608a4.476 4.476 0 01-2.876-1.04l.141-.082 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.495zm-9.661-4.125a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.141-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.676l5.815 3.355-2.02 1.168a.076.076 0 01-.072 0l-4.83-2.786A4.504 4.504 0 012.34 7.872zm16.597 3.855l-5.843-3.371 2.019-1.168a.075.075 0 01.072 0l4.83 2.786a4.494 4.494 0 01-.678 8.105v-5.678a.789.789 0 00-.4-.674zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 00-.785 0L9.409 9.23V6.897a.066.066 0 01.028-.061l4.83-2.787a4.5 4.5 0 016.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 01-.038-.057V6.075a4.5 4.5 0 017.375-3.453l-.142.08-4.778 2.758a.795.795 0 00-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
        </svg>
    ),
};

function TechChip({ name, className }: { name: string; className: string }) {
    const iconUrl = TECH_ICONS[name];
    const iconSvg = TECH_SVG[name];
    return (
        <span className={`inline-flex items-center gap-1.5 ${className}`}>
            {iconSvg ?? (iconUrl
                ? /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={iconUrl} alt="" width={16} height={16} className="w-4 h-4 shrink-0" />
                : null
            )}
            {name}
        </span>
    );
}

export default function HomeClient({ profileData, projects }: { profileData: ProfileData; projects: Project[] }) {
    const { ref: skillsRef, inView: isSkillsInView } = useInView({
        threshold: 0.2,
        triggerOnce: false,
    });

    if (!profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Failed to load profile data.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#081B29] via-[#0D2D4A] to-[#134074]">
            <Header />
            <section id="home" className="min-h-screen pt-20 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 md:gap-x-12 md:gap-y-12 items-center">
                        {/* Text column: on mobile only shows h1 + h2; on desktop shows all text */}
                        <div className="text-white">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Hi, I&rsquo;m <span className="text-blue-400">Teddy Yee</span>
                            </h1>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-0 md:mb-6 text-blue-300">
                                Full Stack Developer
                            </h2>
                            {/* Hidden on mobile; shown on desktop inside this column */}
                            <div className="hidden md:block">
                                <p className="text-lg mb-8 text-gray-300 max-w-lg">
                                    {profileData.homeIntroText}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <a href='https://github.com/TeddyScript101' target="_blank" rel="noopener noreferrer">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                                            View My Work
                                        </button>
                                    </a>
                                    <Link
                                        href="/blog"
                                        className="bg-blue-900/50 hover:bg-blue-900/80 border border-blue-400/40 hover:border-blue-400/70 text-blue-300 hover:text-blue-200 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                                    >
                                        Read My Blog
                                    </Link>
                                    <button
                                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                                    >
                                        Contact Me
                                    </button>
                                </div>
                                <div className="mt-12">
                                    <p className="text-gray-400 mb-4 italic">Tech I&rsquo;m comfortable with professionally</p>
                                    <div className="flex flex-wrap gap-3">
                                        {profileData.about.professionalTech.map((tech: string) => (
                                            <TechChip key={tech} name={tech} className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full text-sm font-medium" />
                                        ))}
                                    </div>
                                    <p className="text-gray-400 mt-8 mb-4 italic">Tech I&rsquo;ve used in academic and personal projects:</p>
                                    <div className="flex flex-wrap gap-3">
                                        {profileData.about.academicTech.map((tech: string) => (
                                            <TechChip key={tech} name={tech} className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full text-sm font-medium" />
                                        ))}
                                    </div>
                                    <p className="text-gray-400 mt-8 mb-4 italic">AI tools I use daily:</p>
                                    <div className="flex flex-wrap gap-3">
                                        {profileData.about.aiTools.map((tool: string) => (
                                            <TechChip key={tool} name={tool} className="bg-violet-900/50 text-violet-300 px-4 py-2 rounded-full text-sm font-medium border border-violet-400/20" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Photo: on mobile sits between h1/h2 and the rest of the text */}
                        <div className="relative">
                            <div className="relative w-full aspect-square max-w-[260px] md:max-w-[530px] mx-auto bg-blue-900/20 rounded-2xl overflow-hidden border-2 border-blue-400/30">
                                <Image
                                    src="/teddy.jpeg"
                                    alt="Hero Illustration"
                                    fill
                                    className="object-cover rounded-2xl"
                                />
                                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-blue-400/50 rounded-tl-2xl"></div>
                                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-blue-400/50 rounded-br-2xl"></div>
                            </div>
                        </div>

                        {/* Mobile-only: description, buttons, and tech tags below the photo */}
                        <div className="md:hidden text-white">
                            <p className="text-lg mb-8 text-gray-300 max-w-lg">
                                {profileData.homeIntroText}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href='https://github.com/TeddyScript101' target="_blank" rel="noopener noreferrer">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                                        View My Work
                                    </button>
                                </a>
                                <Link
                                    href="/blog"
                                    className="bg-blue-900/50 hover:bg-blue-900/80 border border-blue-400/40 hover:border-blue-400/70 text-blue-300 hover:text-blue-200 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                                >
                                    Read My Blog
                                </Link>
                                <button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                                >
                                    Contact Me
                                </button>
                            </div>
                            <div className="mt-12">
                                <p className="text-gray-400 mb-4 italic">Tech I&rsquo;m comfortable with professionally</p>
                                <div className="flex flex-wrap gap-3">
                                    {profileData.about.professionalTech.map((tech: string) => (
                                        <span key={tech} className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-gray-400 mt-8 mb-4 italic">Tech I&rsquo;ve used in academic and personal projects:</p>
                                <div className="flex flex-wrap gap-3">
                                    {profileData.about.academicTech.map((tech: string) => (
                                        <span key={tech} className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-gray-400 mt-8 mb-4 italic">AI tools I use daily:</p>
                                <div className="flex flex-wrap gap-3">
                                    {profileData.about.aiTools.map((tool: string) => (
                                        <span key={tool} className="bg-violet-900/50 text-violet-300 px-4 py-2 rounded-full text-sm font-medium border border-violet-400/20">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="min-h-screen pt-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
                        About <span className="text-blue-400">Me</span>
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <div className="bg-blue-900/20 p-5 sm:p-8 rounded-2xl border border-blue-400/20 mb-8">
                                <h3 className="text-2xl font-semibold text-white mb-4">My Journey</h3>
                                <p className="text-gray-300 mb-4">
                                    {profileData.about.aboutText1}
                                </p>
                                <p className="text-gray-300">
                                    {profileData.about.aboutText2}
                                </p>
                            </div>

                            <div className="bg-blue-900/20 p-5 sm:p-8 rounded-2xl border border-blue-400/20 mb-8">
                                <h3 className="text-2xl font-semibold text-white mb-6">Working Experience</h3>
                                <div className="space-y-4">
                                    {profileData.workExperience.map((exp: WorkExp, i: number) => (
                                        <div key={i} className="bg-blue-900/30 p-4 rounded-xl border border-blue-400/20">
                                            <h4 className="text-lg font-semibold text-white mb-1">{exp.title}</h4>
                                            <p className="text-blue-300 text-sm mb-1">{exp.company} — {exp.date}</p>
                                            <p className="text-gray-400 text-xs mb-2">{exp.location}</p>
                                            <ul className="list-disc list-outside pl-4 space-y-1">
                                                {exp.highlights.map((point, j) => (
                                                    <li key={j} className="text-gray-300 text-sm leading-relaxed">{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div ref={skillsRef} className="bg-blue-900/20 p-8 rounded-2xl border border-blue-400/20 mb-8">
                                <h3 className="text-2xl font-semibold text-white mb-6">My Skills</h3>
                                <div className="space-y-4">
                                    {profileData.skills.map((skill: Skill, i: number) => (
                                        <div key={i}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-blue-300 font-medium">{skill.name}</span>
                                                <span className="text-gray-400 text-sm">
                                                    <AnimatedCounter target={skill.level} isVisible={isSkillsInView} />
                                                </span>
                                            </div>
                                            <div className="w-full bg-blue-900/40 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className={`bg-blue-500 h-2.5 rounded-full transition-all duration-700 ease-out`}
                                                    style={{ width: isSkillsInView ? `${skill.level}%` : '0%' }}
                                                ></div>
                                            </div>
                                            <p className="text-gray-400 text-sm mt-1">{skill.tech}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-blue-900/20 p-8 rounded-2xl border border-blue-400/20">
                                <h3 className="text-2xl font-semibold text-white mb-6">Education</h3>
                                <div className="space-y-4">
                                    {profileData.education.map((edu: Education, i: number) => (
                                        <div key={i} className="bg-blue-900/30 p-4 rounded-xl border border-blue-400/20">
                                            <h4 className="text-lg font-semibold text-white mb-1">{edu.degree}</h4>
                                            <p className="text-blue-300 text-sm mb-1">{edu.school} — {edu.date}</p>
                                            <p className="text-gray-400 text-xs mb-2">{edu.location}</p>
                                            <ul className="list-disc list-outside pl-4 space-y-1">
                                                {edu.highlights.map((point, j) => (
                                                    <li key={j} className="text-gray-300 text-sm leading-relaxed">{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ProjectsSection projects={projects} />

            <section id="contact" className="min-h-screen pt-20 bg-[#0D2D4A] flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
                        Contact <span className="text-blue-400">Me</span>
                    </h2>
                    <div className="flex flex-wrap justify-center items-center gap-8">
                        {profileData.socials.map((social: Social) => {
                            let IconComponent = null;
                            if (social.iconName === 'LinkedInIcon') IconComponent = <LinkedInIcon />;
                            else if (social.iconName === 'InstagramIcon') IconComponent = <InstagramIcon />;
                            else if (social.iconName === 'EmailIcon') IconComponent = <EmailIcon />;

                            return (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center text-blue-300 hover:text-blue-400 transition-colors"
                                >
                                    {IconComponent}
                                    <span className="text-sm mt-2">{social.name}</span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
