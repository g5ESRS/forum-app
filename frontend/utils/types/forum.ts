export interface Category{
    id: number;
    name: string;
    description: string;
    slug: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Topic{
    id: number;
    title: string;
    content: string;
    author: number;
    category: Category;
    tags: string[];
    pinned: boolean;
    closed: boolean;
    views: number;
    last_activity: string | null;
    created_at: string;
    updated_at: string;
    posts: Post[];
}

export interface Post{
    id: number;
    content: string;
    topic: number;
    author: number;
    created_at: string;
}