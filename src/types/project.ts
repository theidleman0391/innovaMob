export interface Project {
    id: string;
    title: string;
    construction_type: string;
    material: string;
    description: string;
    images: string[];
    featured: boolean;
    created_at: string;
}

export type NewProject = Omit<Project, 'id' | 'created_at'>;
