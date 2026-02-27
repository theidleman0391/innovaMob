import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { X, Tag, Layers, Info, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Contact from '../components/Contact';
import { getProjects } from '../services/projectStore';
import type { Project } from '../types/project';



/* ── Animated card ───────────────────────────────────────────── */
interface ProjectCardProps {
    project: Project;
    onClick: (p: Project, imgIndex: number) => void;
    index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, index }) => {
    const [currentImg, setCurrentImg] = useState(0);
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.12 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const nextImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImg((prev) => (prev + 1) % project.images.length);
    };
    const prevImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImg((prev) => (prev - 1 + project.images.length) % project.images.length);
    };

    const delay = `${index * 80}ms`;

    return (
        <div
            ref={ref}
            onClick={() => onClick(project, currentImg)}
            style={{ transitionDelay: delay }}
            className={`group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-200 flex flex-col bg-white
        transition-all duration-700 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="aspect-[16/9] overflow-hidden relative">
                {project.images.map((src, idx) => (
                    <img
                        key={src}
                        src={src}
                        alt={`${project.title} ${idx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-500 group-hover:scale-105
              ${idx === currentImg ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        referrerPolicy="no-referrer"
                    />
                ))}

                {project.images.length > 1 && (
                    <>
                        <button
                            onClick={prevImg}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-secondary)] p-1.5 rounded-full shadow-sm backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-20"
                            aria-label="Imagen anterior"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={nextImg}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-secondary)] p-1.5 rounded-full shadow-sm backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-20"
                            aria-label="Siguiente imagen"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}

                {project.images.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {project.images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all ${idx === currentImg ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                    <span className="bg-white text-[var(--color-secondary)] px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Ver detalles
                    </span>
                </div>
            </div>

            <div className="p-4 bg-[var(--color-bg-light)] flex-grow">
                <h3 className="text-base font-bold text-[var(--color-accent)] font-serif mb-1">
                    {project.title}
                </h3>
                <p className="text-gray-500 text-sm">{project.construction_type}</p>
            </div>
        </div>
    );
};

/* ── Page ────────────────────────────────────────────────────── */
const PER_PAGE = 6;

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [selected, setSelected] = useState<{ project: Project; initialImg: number } | null>(null);
    const [modalImgIndex, setModalImgIndex] = useState(0);
    const [heroVisible, setHeroVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getProjects()
            .then(setProjects)
            .catch(console.error)
            .finally(() => setLoadingProjects(false));
    }, []);

    const totalPages = Math.ceil(projects.length / PER_PAGE);
    const pageProjects = projects.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    useEffect(() => {
        // Always start at the top when navigating to this page
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    useEffect(() => {
        // Trigger hero animation after mount
        const t = setTimeout(() => setHeroVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    // Lock scroll when modal open
    useEffect(() => {
        document.body.style.overflow = selected ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [selected]);

    const handleOpen = (project: Project, imgIndex: number) => {
        setSelected({ project, initialImg: imgIndex });
        setModalImgIndex(imgIndex);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        // Smooth scroll to top of grid
        gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const nextModal = () => {
        if (!selected) return;
        setModalImgIndex((p) => (p + 1) % selected.project.images.length);
    };
    const prevModal = () => {
        if (!selected) return;
        setModalImgIndex((p) => (p - 1 + selected.project.images.length) % selected.project.images.length);
    };

    return (
        <>
            <Helmet>
                <title>Proyectos | InnovaMob – Muebles a medida en Puerto Montt</title>
                <meta name="description" content="Explora nuestros proyectos de diseño y fabricación de muebles a medida: cocinas, closets, oficinas y más. InnovaMob, Puerto Montt." />
            </Helmet>

            {/* ── Hero banner ── */}
            <section className="relative pt-20 pb-7 md:pt-24 md:pb-8 overflow-hidden">
                {/* Background image */}
                <img
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                    style={{ filter: 'blur(6px)' }}
                    referrerPolicy="no-referrer"
                />
                {/* Dark gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-secondary)]/80 via-[var(--color-secondary)]/70 to-[var(--color-secondary)]/85" />
                {/* Subtle color tint */}
                <div className="absolute inset-0 bg-[var(--color-primary)]/10" />

                <div
                    className={`container mx-auto px-4 md:px-6 max-w-7xl text-center transition-all duration-700 ease-out
            ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                >
                    <span className="text-[var(--color-primary)] font-semibold tracking-widest uppercase text-xs mb-3 block">
                        Mis Trabajos
                    </span>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3">
                        Proyectos Destacados
                    </h1>
                    <p className="text-gray-300 max-w-xl mx-auto text-xs md:text-base leading-relaxed">
                        Explora nuestros últimos trabajos en diseño y fabricación de muebles a medida.
                        Toca cada proyecto para ver más información.
                    </p>
                </div>
            </section>

            {/* ── Grid ── */}
            <section ref={gridRef} className="py-14 md:py-20 bg-gray-50 scroll-mt-20">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {loadingProjects ? (
                            <div className="col-span-full flex justify-center py-24">
                                <Loader2 size={36} className="animate-spin text-[var(--color-primary)]" />
                            </div>
                        ) : pageProjects.length === 0 ? (
                            <p className="col-span-full text-center text-gray-400 py-16">Aún no hay proyectos publicados.</p>
                        ) : (
                            pageProjects.map((project, i) => (
                                <ProjectCard key={`${project.id}-${currentPage}`} project={project} onClick={handleOpen} index={i} />
                            ))
                        )}
                    </div>

                    {/* ── Pagination ── */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                            {/* Prev */}
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-4 py-2.5 min-w-[44px] min-h-[44px] rounded-full border border-gray-300 text-sm font-medium text-[var(--color-secondary)]
                                    hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5
                                    disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                                aria-label="Página anterior"
                            >
                                <ChevronLeft size={16} />
                                <span className="hidden xs:inline">Anterior</span>
                            </button>

                            {/* Page dots */}
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        className={`transition-all duration-300 rounded-full flex items-center justify-center
                                            ${p === currentPage
                                                ? 'w-9 h-9 bg-[var(--color-primary)] text-white text-xs font-bold shadow-sm'
                                                : 'w-9 h-9 bg-gray-200 text-gray-500 text-xs hover:bg-[var(--color-primary)]/20'}`}
                                        aria-label={`Ir a página ${p}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            {/* Next */}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-4 py-2.5 min-w-[44px] min-h-[44px] rounded-full border border-gray-300 text-sm font-medium text-[var(--color-secondary)]
                                    hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5
                                    disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                                aria-label="Página siguiente"
                            >
                                <span className="hidden xs:inline">Siguiente</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Modal ── */}
            {selected && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setSelected(null)}
                    />
                    <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300 ease-out">
                        {/* Close */}
                        <button
                            onClick={() => setSelected(null)}
                            className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                            aria-label="Cerrar"
                        >
                            <X size={20} />
                        </button>

                        {/* Images */}
                        <div className="w-full md:w-1/2 h-52 sm:h-64 md:h-auto relative group">
                            {selected.project.images.map((src, idx) => (
                                <img
                                    key={src}
                                    src={src}
                                    alt={`${selected.project.title} ${idx + 1}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${idx === modalImgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                    referrerPolicy="no-referrer"
                                />
                            ))}

                            {selected.project.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevModal}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-secondary)] p-2 rounded-full shadow-sm backdrop-blur-sm opacity-100 transition-all z-20"
                                        aria-label="Imagen anterior"
                                    >
                                        <ChevronLeft size={22} />
                                    </button>
                                    <button
                                        onClick={nextModal}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-secondary)] p-2 rounded-full shadow-sm backdrop-blur-sm opacity-100 transition-all z-20"
                                        aria-label="Siguiente imagen"
                                    >
                                        <ChevronRight size={22} />
                                    </button>
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                                        {selected.project.images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setModalImgIndex(idx)}
                                                className={`h-2 rounded-full transition-all ${idx === modalImgIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                                                aria-label={`Ir a imagen ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Details */}
                        <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-10 flex flex-col justify-center">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-accent)] font-serif mb-4">
                                {selected.project.title}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 text-[var(--color-primary)] mb-2">
                                        <Tag size={18} />
                                        <h3 className="font-semibold text-sm uppercase tracking-wider">Tipo de Construcción</h3>
                                    </div>
                                    <p className="text-gray-700">{selected.project.construction_type}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-[var(--color-primary)] mb-2">
                                        <Layers size={18} />
                                        <h3 className="font-semibold text-sm uppercase tracking-wider">Materiales</h3>
                                    </div>
                                    <p className="text-gray-700">{selected.project.material}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-[var(--color-primary)] mb-2">
                                        <Info size={18} />
                                        <h3 className="font-semibold text-sm uppercase tracking-wider">Descripción del Trabajo</h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed text-sm">{selected.project.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ── Contact ── */}
            <Contact />
        </>
    );
}
