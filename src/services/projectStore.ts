import { supabase } from '../lib/supabase';
import type { Project, NewProject } from '../types/project';

/** Fetch all projects: featured first, then newest first */
export async function getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
}

/** Add a new project */
export async function addProject(project: NewProject): Promise<Project> {
    const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

    if (error) throw error;
    return data as Project;
}

/** Update an existing project */
export async function updateProject(id: string, fields: Partial<NewProject>): Promise<void> {
    const { error } = await supabase
        .from('projects')
        .update(fields)
        .eq('id', id);

    if (error) throw error;
}

/** Delete a project and its images from storage */
export async function deleteProject(id: string, imagePaths: string[]): Promise<void> {
    // Remove images from storage
    if (imagePaths.length > 0) {
        await supabase.storage.from('project-images').remove(imagePaths);
    }

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
}

/** Upload an image file and return its public URL */
export async function uploadImage(file: File, projectId: string): Promise<{ url: string; path: string }> {
    const ext = file.name.split('.').pop();
    const path = `${projectId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
        .from('project-images')
        .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from('project-images').getPublicUrl(path);
    return { url: data.publicUrl, path };
}
