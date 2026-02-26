import { supabase } from '../lib/supabase';
import type { BlogPost, NewBlogPost } from '../types/post';

/** Fetch all posts ordered by date (newest first) */
export async function getPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as BlogPost[];
}

/** Get a single post by slug */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
    return data as BlogPost | null;
}

/** Add a new post */
export async function addPost(post: NewBlogPost): Promise<BlogPost> {
    const { data, error } = await supabase
        .from('posts')
        .insert([post])
        .select()
        .single();

    if (error) throw error;
    return data as BlogPost;
}

/** Update an existing post */
export async function updatePost(id: string, fields: Partial<NewBlogPost>): Promise<void> {
    const { error } = await supabase
        .from('posts')
        .update(fields)
        .eq('id', id);

    if (error) throw error;
}

/** Delete a post and its image from storage */
export async function deletePost(id: string, imagePath: string | null): Promise<void> {
    // Remove image from storage if it exists (and is a Supabase storage URL)
    if (imagePath) {
        await supabase.storage.from('project-images').remove([imagePath]);
    }

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
}
