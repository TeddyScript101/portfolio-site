type WorkExp = {
    title: string;
    company: string;
    date: string;
    location: string;
    desc: string;
};

type Skill = {
    name: string;
    level: number;
    tech: string;
};

type Education = {
    degree: string;
    school: string;
    date: string;
    location: string;
    details: string;
};

type Social = {
    name: string;
    url: string;
    iconName: string;
};


type About = {
    aboutText1: string;
    aboutText2: string;
    professionalTech: string[];
    academicTech: string[];
}

export type ProfileData = {
    homeIntroText: string;
    about: About;
    workExperience: WorkExp[];
    skills: Skill[];
    education: Education[];
    socials: Social[];
};
