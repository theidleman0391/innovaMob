import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Star, StarOff, LogOut, Upload, X, Pencil, Check, Loader2, ImagePlus, LayoutGrid, FileText, Eye, EyeOff } from 'lucide-react';

// STORE
import { getProjects, addProject, updateProject, deleteProject, uploadImage } from '../services/projectStore';
import { getPosts, addPost, updatePost, deletePost } from '../services/blogStore';
import type { Project, NewProject } from '../types/project';
import type { BlogPost, NewBlogPost } from '../types/post';
import Editor, {
    Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnStrikeThrough,
    BtnNumberedList, BtnBulletList, BtnLink, BtnClearFormatting,
    BtnStyles, Separator, createDropdown, BtnUndo, BtnRedo
} from 'react-simple-wysiwyg';
import DOMPurify from 'dompurify';

const BtnFontSize = createDropdown('Tamaño', [
    ['Pequeño', () => document.execCommand('fontSize', false, '1'), ''],
    ['Normal', () => document.execCommand('fontSize', false, '3'), ''],
    ['Grande', () => document.execCommand('fontSize', false, '5'), ''],
    ['Muy Grande', () => document.execCommand('fontSize', false, '7'), '']
]);

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD as string;

/* ─── Blank form states ──────────────────────────────────────────── */
const blankProject = (): NewProject => ({
    title: '', construction_type: '', material: '', description: '', images: [], featured: false,
});

const blankPost = (): NewBlogPost => ({
    title: '', slug: '', date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
    category: '', summary: '', content: '', image: '',
});

/* ─── Small reusable components ─────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
            {children}
        </div>
    );
}

const inputCls = "w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 bg-white";
const btnPrimary = "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50";
const btnGhost = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all";

/* ─── Login screen ───────────────────────────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
    const [pass, setPass] = useState('');
    const [err, setErr] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pass === ADMIN_PASS) {
            sessionStorage.setItem('admin_auth', '1');
            onLogin();
        } else {
            setErr(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-light)]">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
                <h1 className="text-xl font-bold text-[var(--color-secondary)] font-serif mb-1">Panel Admin</h1>
                <p className="text-gray-400 text-sm mb-6">InnovaMob – acceso restringido</p>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="relative">
                        <input type={showPass ? 'text' : 'password'} placeholder="Contraseña" value={pass} onChange={e => { setPass(e.target.value); setErr(false); }} className={`${inputCls} pr-10 ${err ? 'border-red-400 ring-2 ring-red-200' : ''}`} autoFocus />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {err && <p className="text-red-500 text-xs">Contraseña incorrecta</p>}
                    <button type="submit" className={btnPrimary + ' justify-center mt-2'}>Ingresar</button>
                </form>
            </div>
        </div>
    );
}

/* ─── Image uploader ─────────────────────────────────────────────── */
function ImageUploader({ images, onChange, projectId }: { images: string[]; onChange: (urls: string[]) => void; projectId: string; }) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            const newUrls: string[] = [];
            for (const file of Array.from(files)) {
                const { url } = await uploadImage(file, projectId);
                newUrls.push(url);
            }
            onChange([...images, ...newUrls]);
        } catch (err) {
            alert('Error al subir imagen: ' + (err as Error).message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
                {images.map((url, i) => (
                    <div key={url} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                        <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => onChange(images.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><X size={18} /></button>
                    </div>
                ))}
                <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading || images.length >= 5} className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-40">
                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
                    <span className="text-xs mt-1">{uploading ? 'Subiendo…' : 'Agregar'}</span>
                </button>
            </div>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
        </div>
    );
}

/* ─── modals ─────────────────────────────────────────────────────── */

// 1. Projects Modal
function ProjectFormModal({ initial, onSave, onClose }: { initial?: Project; onSave: () => void; onClose: () => void; }) {
    const isEdit = !!initial;
    const [form, setForm] = useState<NewProject>(initial || blankProject());
    const [saving, setSaving] = useState(false);
    const [tempId] = useState(() => crypto.randomUUID());
    const projectId = initial?.id ?? tempId;

    const set = (key: keyof NewProject, val: unknown) => setForm(f => ({ ...f, [key]: val }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.construction_type || !form.material || !form.description) return alert('Por favor completa todos los campos.');
        if (form.images.length === 0) return alert('Agrega al menos una imagen.');

        setSaving(true);
        try {
            isEdit ? await updateProject(initial!.id, form) : await addProject(form);
            onSave();
        } catch (err) { alert('Error al guardar: ' + (err as Error).message); }
        finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-base font-bold text-[var(--color-secondary)] font-serif">{isEdit ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    <Field label="Título"><input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Tipo de construcción"><input className={inputCls} value={form.construction_type} onChange={e => set('construction_type', e.target.value)} /></Field>
                        <Field label="Materiales"><input className={inputCls} value={form.material} onChange={e => set('material', e.target.value)} /></Field>
                    </div>
                    <Field label="Descripción"><textarea className={inputCls + ' resize-none'} rows={4} value={form.description} onChange={e => set('description', e.target.value)} /></Field>
                    <Field label="Imágenes (hasta 5)"><ImageUploader images={form.images} onChange={urls => set('images', urls)} projectId={projectId} /></Field>
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <div onClick={() => set('featured', !form.featured)} className={`w-10 h-6 rounded-full transition-colors ${form.featured ? 'bg-[var(--color-primary)]' : 'bg-gray-200'} relative`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.featured ? 'left-5' : 'left-1'}`} /></div>
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Star size={14} className={form.featured ? 'text-yellow-400' : 'text-gray-300'} /> Proyecto destacado (aparece primero)</span>
                    </label>
                    <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose} className={`${btnGhost} border border-gray-200 text-gray-600 hover:bg-gray-50`}>Cancelar</button>
                        <button type="submit" disabled={saving} className={btnPrimary}>{saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} {isEdit ? 'Guardar' : 'Publicar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// 2. Blog Modal
function BlogPostModal({ initial, onSave, onClose }: { initial?: BlogPost; onSave: () => void; onClose: () => void; }) {
    const isEdit = !!initial;
    const [form, setForm] = useState<NewBlogPost>(initial || blankPost());
    const [saving, setSaving] = useState(false);
    const [tempId] = useState(() => crypto.randomUUID());
    const postId = initial?.id ?? tempId;



    const set = (key: keyof NewBlogPost, val: unknown) => {
        setForm(f => {
            const updated = { ...f, [key]: val };
            // Auto-generate slug from title if it's a new post and title is changed
            if (key === 'title' && !isEdit) {
                updated.slug = (val as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.slug || !form.content) return alert('Por favor completa título, slug y contenido.');
        if (!form.image) return alert('Debes agregar una imagen principal.');

        setSaving(true);
        try {
            isEdit ? await updatePost(initial!.id, form) : await addPost(form);
            onSave();
        } catch (err) { alert('Error al guardar: ' + (err as Error).message); }
        finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-base font-bold text-[var(--color-secondary)] font-serif">{isEdit ? 'Editar post' : 'Nuevo post'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    <Field label="Título"><input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Slug (URL)"><input className={inputCls} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="mi-nuevo-post" /></Field>
                        <Field label="Categoría"><input className={inputCls} value={form.category} onChange={e => set('category', e.target.value)} /></Field>
                        <Field label="Fecha visible"><input className={inputCls} value={form.date} onChange={e => set('date', e.target.value)} /></Field>
                    </div>
                    <Field label="Resumen (Introducción)"><textarea className={inputCls + ' resize-none'} rows={2} value={form.summary} onChange={e => set('summary', e.target.value)} /></Field>
                    <Field label="Contenido completo">
                        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                            <Editor value={form.content} onChange={e => set('content', DOMPurify.sanitize(e.target.value))} containerProps={{ style: { height: '300px', border: 'none' } }}>
                                <Toolbar>
                                    <BtnUndo />
                                    <BtnRedo />
                                    <Separator />
                                    <BtnBold />
                                    <BtnItalic />
                                    <BtnUnderline />
                                    <BtnStrikeThrough />
                                    <Separator />
                                    <BtnNumberedList />
                                    <BtnBulletList />
                                    <Separator />
                                    <BtnLink />
                                    <BtnClearFormatting />
                                    <Separator />
                                    <BtnStyles />
                                    <BtnFontSize />
                                </Toolbar>
                            </Editor>
                        </div>
                    </Field>
                    <Field label="Imagen Principal">
                        <ImageUploader
                            images={form.image ? [form.image] : []}
                            onChange={urls => set('image', urls[0] || '')}
                            projectId={`posts/${postId}`}
                        />
                    </Field>
                    <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
                        <button type="button" onClick={onClose} className={`${btnGhost} border border-gray-200 text-gray-600 hover:bg-gray-50`}>Cancelar</button>
                        <button type="submit" disabled={saving} className={btnPrimary}>{saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} {isEdit ? 'Guardar' : 'Publicar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── Tabs ───────────────────────────────────────────────────────── */

// Projects TAB
function ProjectsTab() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Project | undefined>();
    const [deleting, setDeleting] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try { setProjects(await getProjects()); } catch (err) { alert((err as Error).message); } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold font-serif text-[var(--color-secondary)]">Proyectos</h2>
                <button onClick={() => { setEditing(undefined); setShowForm(true); }} className={btnPrimary}><Plus size={16} /> Nuevo proyecto</button>
            </div>

            {loading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" size={32} /></div> :
                projects.length === 0 ? <p className="text-center py-20 text-gray-400">No hay proyectos.</p> :
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map(p => (
                            <div key={p.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border ${p.featured ? 'border-yellow-300 ring-1 ring-yellow-200' : 'border-gray-100'}`}>
                                <div className="aspect-video relative">
                                    {p.images[0] && <img src={p.images[0]} className="w-full h-full object-cover" />}
                                    {p.featured && <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Star size={10} /> Destacado</span>}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-sm text-[var(--color-secondary)] font-serif leading-tight mb-1 line-clamp-2">{p.title}</h3>
                                    <p className="text-xs text-gray-400 mb-3">{p.construction_type}</p>
                                    <div className="flex items-center gap-2">
                                        <button onClick={async () => { await updateProject(p.id, { featured: !p.featured }); load(); }} className={`${btnGhost} flex-1 justify-center ${p.featured ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-500'}`}>
                                            {p.featured ? <StarOff size={13} /> : <Star size={13} />} {p.featured ? 'Quitar dest.' : 'Destacar'}
                                        </button>
                                        <button onClick={() => { setEditing(p); setShowForm(true); }} className={`${btnGhost} bg-blue-50 text-blue-600`}><Pencil size={13} /></button>
                                        <button disabled={deleting === p.id} onClick={async () => {
                                            if (!confirm('¿Eliminar?')) return;
                                            setDeleting(p.id);
                                            await deleteProject(p.id, p.images.map(u => u.match(/project-images\/(.+)/)?.[1] as string).filter(Boolean));
                                            load();
                                        }} className={`${btnGhost} bg-red-50 text-red-500`}>
                                            {deleting === p.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>}

            {showForm && <ProjectFormModal initial={editing} onClose={() => setShowForm(false)} onSave={() => { setShowForm(false); load(); }} />}
        </div>
    );
}

// Blog TAB
function BlogTab() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<BlogPost | undefined>();
    const [deleting, setDeleting] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try { setPosts(await getPosts()); } catch (err) { alert((err as Error).message); } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold font-serif text-[var(--color-secondary)]">Artículos del Blog</h2>
                <button onClick={() => { setEditing(undefined); setShowForm(true); }} className={btnPrimary}><Plus size={16} /> Nuevo post</button>
            </div>

            {loading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[var(--color-primary)]" size={32} /></div> :
                posts.length === 0 ? <p className="text-center py-20 text-gray-400">No hay posts.</p> :
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {posts.map(p => (
                            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                                <div className="aspect-video relative">
                                    {p.image && <img src={p.image} className="w-full h-full object-cover" />}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="font-bold text-sm text-[var(--color-secondary)] font-serif leading-tight mb-1 line-clamp-2">{p.title}</h3>
                                    <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-grow">{p.summary}</p>
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                                        <button onClick={() => { setEditing(p); setShowForm(true); }} className={`${btnGhost} flex-1 justify-center bg-blue-50 text-blue-600`}><Pencil size={13} /> Editar</button>
                                        <button disabled={deleting === p.id} onClick={async () => {
                                            if (!confirm('¿Eliminar?')) return;
                                            setDeleting(p.id);
                                            await deletePost(p.id, p.image.match(/project-images\/(.+)/)?.[1] || null);
                                            load();
                                        }} className={`${btnGhost} bg-red-50 text-red-500`}>
                                            {deleting === p.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>}

            {showForm && <BlogPostModal initial={editing} onClose={() => setShowForm(false)} onSave={() => { setShowForm(false); load(); }} />}
        </div>
    );
}


/* ─── Main admin dashboard ───────────────────────────────────────── */
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
    const [tab, setTab] = useState<'projects' | 'blog'>('projects');

    return (
        <div className="min-h-screen bg-[var(--color-bg-light)]">
            <header className="bg-[var(--color-secondary)] text-white px-4 md:px-8 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-8">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-0.5">InnovaMob</p>
                        <h1 className="font-serif font-bold text-lg">Panel de Administración</h1>
                    </div>
                    {/* PC Tabs */}
                    <div className="hidden md:flex bg-white/10 p-1 rounded-xl gap-1">
                        <button onClick={() => setTab('projects')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'projects' ? 'bg-white text-[var(--color-secondary)] shadow' : 'text-gray-300 hover:text-white'}`}><LayoutGrid size={16} /> Proyectos</button>
                        <button onClick={() => setTab('blog')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'blog' ? 'bg-white text-[var(--color-secondary)] shadow' : 'text-gray-300 hover:text-white'}`}><FileText size={16} /> Blog</button>
                    </div>
                </div>
                <button onClick={onLogout} className="text-gray-400 hover:text-white transition-colors p-2 flex items-center gap-2 text-sm"><LogOut size={16} /> <span className="hidden sm:inline">Cerrar Sesión</span></button>
            </header>

            {/* Mobile Tabs */}
            <div className="md:hidden flex bg-white border-b border-gray-100">
                <button onClick={() => setTab('projects')} className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-medium border-b-2 ${tab === 'projects' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500'}`}><LayoutGrid size={18} /> Proyectos</button>
                <button onClick={() => setTab('blog')} className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-medium border-b-2 ${tab === 'blog' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500'}`}><FileText size={18} /> Blog</button>
            </div>

            <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
                {tab === 'projects' ? <ProjectsTab /> : <BlogTab />}
            </main>
        </div>
    );
}

/* ─── Root export ────────────────────────────────────────────────── */
export default function AdminPage() {
    const [auth, setAuth] = useState(() => sessionStorage.getItem('admin_auth') === '1');
    const logout = () => { sessionStorage.removeItem('admin_auth'); setAuth(false); };

    return (
        <>
            <Helmet><title>Admin | InnovaMob</title></Helmet>
            {auth ? <AdminDashboard onLogout={logout} /> : <LoginScreen onLogin={() => setAuth(true)} />}
        </>
    );
}
