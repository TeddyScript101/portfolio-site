export type RelatedBlog = {
    title: string;
    slug: string;
};

export type DemoLink = {
    label: string;
    url: string;
};

export type Project = {
    _id?: string;
    slug: string;
    title: string;
    description: string;
    thumbnail: string;
    demoUrls: DemoLink[];
    githubUrl?: string;
    techStack: string[];
    relatedBlogs: RelatedBlog[];
    order: number;
};
