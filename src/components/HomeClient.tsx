'use client';

import { AnimatedCounter } from '@/components/AnimatedCounter';
import Header from '@/components/Header';
import { useInView } from 'react-intersection-observer';
import { LinkedInIcon } from '@/icon/LinkedInIcon';
import { EmailIcon } from '@/icon/EmailIcon';
import { InstagramIcon } from '@/icon/InstagramIcon';
import { Education, ProfileData, Skill, Social, WorkExp } from '@/app/type/profileData';
import Image from 'next/image';

export default function HomeClient({ profileData }: { profileData: ProfileData }) {
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative order-1 md:order-2">
                            <div className="relative w-full aspect-[16/16] max-w-[530px] mx-auto bg-blue-900/20 rounded-2xl overflow-hidden border-2 border-blue-400/30">
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

                        <div className="text-white order-2 md:order-1">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Hi, I&rsquo;m <span className="text-blue-400">Teddy Yee</span>
                            </h1>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 text-blue-300">
                                Full Stack Developer
                            </h2>
                            <p className="text-lg mb-8 text-gray-300 max-w-lg">
                                {profileData.homeIntroText}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href='https://github.com/TeddyScript101' target="_blank" rel="noopener noreferrer">
                                    <button
                                        // onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                                    >
                                        View My Work
                                    </button>
                                </a>
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
                                        <span
                                            key={tech}
                                            className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full text-sm font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-gray-400 mt-8 mb-4 italic">Tech I&rsquo;ve used in academic and personal projects:</p>
                                <div className="flex flex-wrap gap-3">
                                    {profileData.about.academicTech.map((tech: string) => (
                                        <span
                                            key={tech}
                                            className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full text-sm font-medium"
                                        >
                                            {tech}
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
                            <div className="bg-blue-900/20 p-8 rounded-2xl border border-blue-400/20 mb-8">
                                <h3 className="text-2xl font-semibold text-white mb-4">My Journey</h3>
                                <p className="text-gray-300 mb-4">
                                    {profileData.about.aboutText1}
                                </p>
                                <p className="text-gray-300">
                                    {profileData.about.aboutText2}
                                </p>
                            </div>

                            <div className="bg-blue-900/20 p-8 rounded-2xl border border-blue-400/20 mb-8">
                                <h3 className="text-2xl font-semibold text-white mb-6">Working Experience</h3>
                                <div className="space-y-4">
                                    {profileData.workExperience.map((exp: WorkExp, i: number) => (
                                        <div key={i} className="bg-blue-900/30 p-4 rounded-xl border border-blue-400/20">
                                            <h4 className="text-lg font-semibold text-white mb-1">{exp.title}</h4>
                                            <p className="text-blue-300 text-sm mb-1">{exp.company} — {exp.date}</p>
                                            <p className="text-gray-400 text-xs mb-2">{exp.location}</p>
                                            <p className="text-gray-300 text-sm">{exp.desc}</p>
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
                                            <p className="text-gray-300 text-sm">{edu.details}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contact" className="min-h-screen pt-20 bg-[#0D2D4A] flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
                        Contact <span className="text-blue-400">Me</span>
                    </h2>
                    <div className="flex justify-center items-center gap-8">
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
