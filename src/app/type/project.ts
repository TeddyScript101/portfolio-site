export type RelatedBlog = {
    title: string;
    slug: string;
};

export type Project = {
    _id?: string;
    slug: string;
    title: string;
    description: string;
    thumbnail: string;
    demoUrl: string;
    githubUrl?: string;
    techStack: string[];
    relatedBlogs: RelatedBlog[];
    order: number;
};
