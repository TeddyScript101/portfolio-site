'use client';

import { AnimatedCounter } from '@/components/AnimatedCounter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectsSection from '@/components/ProjectsSection';
import { TechChip } from '@/components/TechChip';
import { useInView } from 'react-intersection-observer';
import { LinkedInIcon } from '@/icon/LinkedInIcon';
import { EmailIcon } from '@/icon/EmailIcon';
import { InstagramIcon } from '@/icon/InstagramIcon';
import { GitHubIcon } from '@/icon/GitHubIcon';
import { Education, ProfileData, Skill, Social, WorkExp } from '@/app/type/profileData';
import { Project } from '@/app/type/project';
import Image from 'next/image';
import Link from 'next/link';



const SOCIAL_ICONS: Record<string, React.ReactElement> = {
    'LinkedInIcon': <LinkedInIcon />,
    'EmailIcon':    <EmailIcon />,
    'InstagramIcon': <InstagramIcon />,
    'github':       <GitHubIcon />,
    'linkedin':     <LinkedInIcon />,
    'email':        <EmailIcon />,
    'instagram':    <InstagramIcon />,
};

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

    const heroContent = (
        <>
            <p className="text-lg mb-8 text-gray-300 max-w-lg">
                {profileData.homeIntroText}
            </p>
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                    View My Work
                </button>
                <Link
                    href="/blog"
                    className="bg-blue-900/50 hover:bg-blue-900/80 border border-blue-400/40 hover:border-blue-400/70 text-blue-300 hover:text-blue-200 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                    Read My Blog
                </Link>
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
        </>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#081B29] via-[#0D2D4A] to-[#134074]">
            <Header />
            <section id="home" className="min-h-screen pt-20 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 md:gap-x-12 md:gap-y-12 items-center">
                        {/* Text column */}
                        <div className="text-white">
                            <h1 style={{ animation: 'fadeInUp 0.7s ease-out both' }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Hi, I&rsquo;m <span className="text-blue-400">Teddy Yee</span>
                            </h1>
                            <h2 style={{ animation: 'fadeInUp 0.7s ease-out both', animationDelay: '0.15s' }} className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-0 md:mb-6 text-blue-300">
                                Full Stack Developer
                            </h2>
                            <div style={{ animation: 'fadeInUp 0.7s ease-out both', animationDelay: '0.3s' }} className="hidden md:block">
                                {heroContent}
                            </div>
                        </div>

                        {/* Photo */}
                        <div style={{ animation: 'fadeInUp 0.7s ease-out both', animationDelay: '0.25s' }} className="relative">
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

                        {/* Mobile-only: description, buttons, and tech chips below photo */}
                        <div style={{ animation: 'fadeInUp 0.7s ease-out both', animationDelay: '0.4s' }} className="md:hidden text-white">
                            {heroContent}
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
                                            <p className="text-blue-300 text-sm mb-1">{exp.company} · {exp.date}</p>
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
                                                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-700 ease-out"
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
                                            <p className="text-blue-300 text-sm mb-1">{edu.school} · {edu.date}</p>
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
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
                        Contact <span className="text-blue-400">Me</span>
                    </h2>
                    <p className="text-gray-400 text-center mb-12 text-lg">
                        Open to new opportunities. Feel free to reach out.
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-10">
                        {profileData.socials.map((social: Social) => {
                            const icon = SOCIAL_ICONS[social.iconName];
                            if (!icon) return null;
                            return (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 text-gray-400 hover:text-blue-300 transition-colors group"
                                >
                                    <span className="transition-transform duration-200 group-hover:scale-110">
                                        {icon}
                                    </span>
                                    <span className="text-sm font-medium">{social.name}</span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
