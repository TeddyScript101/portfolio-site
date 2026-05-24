export type BlogPost = {
    _id?: string;
    slug: string;
    title: string;
    date: string;
    tags: string[];
    excerpt: string;
    content: string;
    published: boolean;
    readTime?: number; // minutes, computed by the API from word count
};
