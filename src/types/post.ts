export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    date: string;
    category: string;
    summary: string;
    content: string;
    image: string; // URL
    created_at: string;
}

export type NewBlogPost = Omit<BlogPost, 'id' | 'created_at'>;
