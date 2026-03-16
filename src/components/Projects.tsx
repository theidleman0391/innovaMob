import React, { useState, useEffect, useRef } from 'react';
import { X, Tag, Layers, Info, ChevronLeft, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProjects } from '../services/projectStore';
import type { Project } from '../types/project';

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
            loading="lazy"
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-secondary p-1.5 rounded-full shadow-sm backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-20 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-secondary p-1.5 rounded-full shadow-sm backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-20 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {project.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${idx === currentImg ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
          <span className="bg-white text-secondary px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            Ver detalles
          </span>
        </div>
      </div>
      <div className="p-4 bg-bg-light flex-grow">
        <h3 className="text-base font-bold text-accent font-serif mb-1">
          {project.title}
        </h3>
        <p className="text-gray-500 text-sm">{project.construction_type}</p>
      </div>
    </div>
  );
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<{ project: Project; initialImg: number } | null>(null);
  const [modalImgIndex, setModalImgIndex] = useState(0);

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(data.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const modalRef = useRef<HTMLDivElement>(null);

  // Lock scroll and focus trap when modal open
  useEffect(() => {
    if (!selected) {
        document.body.style.overflow = '';
        return;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelected(null);
        
        if (e.key === 'Tab') {
            if (!modalRef.current) return;
            const focusable = modalRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable.length === 0) return;
            
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last?.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first?.focus();
                    e.preventDefault();
                }
            }
        }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus close button on open
    setTimeout(() => {
        if (modalRef.current) {
            const closeBtn = modalRef.current.querySelector<HTMLElement>('button[aria-label="Cerrar"]');
            closeBtn?.focus();
        }
    }, 100);

    return () => { 
        document.body.style.overflow = ''; 
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected]);

  const handleOpen = (project: Project, imgIndex: number) => {
    setSelected({ project, initialImg: imgIndex });
    setModalImgIndex(imgIndex);
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
    <section id="proyectos" className="py-14 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <span className="text-primary font-semibold tracking-wider uppercase text-xs mb-2 block">
            Nuestros Trabajos
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-accent mb-4">
            Proyectos Destacados
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Explora una selección de nuestros últimos trabajos en diseño y fabricación de muebles a medida. Haz clic en cada proyecto para ver más información.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 size={36} className="animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 py-8">Aún no hay proyectos destacados.</p>
          ) : (
            projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} onClick={handleOpen} index={i} />
            ))
          )}
        </div>

        {!loading && projects.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/proyectos"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full font-medium shadow-md hover:shadow-lg hover:bg-opacity-90 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Ver todos los proyectos
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {selected && (
        <div 
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={selected.project.title}
          ref={modalRef}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300 ease-out">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-sm backdrop-blur-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <div className="w-full md:w-1/2 h-52 sm:h-64 md:h-auto relative group">
              {selected.project.images.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  loading="lazy"
                  alt={`${selected.project.title} ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${idx === modalImgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  referrerPolicy="no-referrer"
                />
              ))}

              {selected.project.images.length > 1 && (
                <>
                  <button
                    onClick={prevModal}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-secondary p-2 rounded-full shadow-sm backdrop-blur-sm opacity-100 transition-all z-20 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={nextModal}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-secondary p-2 rounded-full shadow-sm backdrop-blur-sm opacity-100 transition-all z-20 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
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

            <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-6 lg:p-8 flex flex-col justify-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-accent font-serif mb-4">
                {selected.project.title}
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Tag size={18} />
                    <h3 className="font-semibold text-sm uppercase tracking-wider">Tipo de Construcción</h3>
                  </div>
                  <p className="text-gray-700">{selected.project.construction_type}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Layers size={18} />
                    <h3 className="font-semibold text-sm uppercase tracking-wider">Materiales</h3>
                  </div>
                  <p className="text-gray-700">{selected.project.material}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-primary mb-2">
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
    </section>
  );
}
