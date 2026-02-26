import React, { useState } from 'react';
import { X, Tag, Layers, Info, ChevronLeft, ChevronRight } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Cocina Americana con Isla Central',
    images: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=2070&auto=format&fit=crop'
    ],
    constructionType: 'Remodelación de Cocina',
    material: 'Melamina Acacia y Cubierta de Cuarzo Blanco',
    description: 'Se realizó la demolición del muro divisorio para integrar la cocina al living-comedor. Se fabricó mobiliario a medida con sistema de cierre suave, incorporando una isla central funcional que sirve como comedor de diario y área de preparación. Se instaló iluminación LED bajo los gabinetes superiores para mejorar la visibilidad del área de trabajo.'
  },
  {
    id: 2,
    title: 'Walk-in Closet Principal',
    images: [
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2070&auto=format&fit=crop',
    ],
    constructionType: 'Mobiliario de Dormitorio',
    material: 'Melamina Texturizada Lino y Herrajes Premium',
    description: 'Diseño y fabricación de un walk-in closet optimizado para maximizar el almacenamiento. Incluye cajoneras con correderas telescópicas, barras de colgar a distintas alturas para ropa larga y corta, y zapateras extraíbles. El diseño abierto permite una visualización rápida de todas las prendas.'
  },
  {
    id: 3,
    title: 'Oficina Corporativa Open Space',
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop'
    ],
    constructionType: 'Mobiliario Comercial',
    material: 'Melamina Grafito, Peral y Estructuras Metálicas',
    description: 'Habilitación completa de mobiliario para oficina de 50m2. Se fabricaron escritorios operativos en formato isla con separadores acústicos, cajoneras móviles para cada puesto de trabajo y un mueble mural para archivo general. El diseño prioriza la ergonomía y el paso oculto de cables.'
  },
  {
    id: 4,
    title: 'Mueble de Baño Suspendido',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=2070&auto=format&fit=crop'
    ],
    constructionType: 'Remodelación de Baño',
    material: 'MDF Lacado Poliuretano y Cubierta de Mármol',
    description: 'Fabricación de vanitorio suspendido (flotante) de doble lavabo. El uso de MDF lacado garantiza una alta resistencia a la humedad del ambiente. Cuenta con amplios cajones de extracción total para facilitar el acceso a los artículos de aseo personal, manteniendo una estética minimalista y limpia.'
  }
];

interface ProjectCardProps {
  project: typeof projects[0];
  onClick: (p: typeof projects[0], imgIndex: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [currentImg, setCurrentImg] = useState(0);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev + 1) % project.images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div
      className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 flex flex-col bg-white"
      onClick={() => onClick(project, currentImg)}
    >
      <div className="aspect-[16/9] overflow-hidden relative">
        <img
          src={project.images[currentImg]}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Navigation Arrows */}
        {project.images.length > 1 && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-secondary)] p-1.5 rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImg}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-secondary)] p-1.5 rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image Indicators */}
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

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="bg-white text-[var(--color-secondary)] px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            Ver detalles
          </span>
        </div>
      </div>
      <div className="p-6 bg-[var(--color-bg-light)] flex-grow">
        <h3 className="text-xl font-bold text-[var(--color-secondary)] font-serif mb-2">
          {project.title}
        </h3>
        <p className="text-gray-500 text-sm">
          {project.constructionType}
        </p>
      </div>
    </div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<{ project: typeof projects[0], initialImg: number } | null>(null);
  const [modalImgIndex, setModalImgIndex] = useState(0);

  const handleOpenModal = (project: typeof projects[0], imgIndex: number) => {
    setSelectedProject({ project, initialImg: imgIndex });
    setModalImgIndex(imgIndex);
  };

  const nextModalImg = () => {
    if (!selectedProject) return;
    setModalImgIndex((prev) => (prev + 1) % selectedProject.project.images.length);
  };

  const prevModalImg = () => {
    if (!selectedProject) return;
    setModalImgIndex((prev) => (prev - 1 + selectedProject.project.images.length) % selectedProject.project.images.length);
  };

  // Prevenir scroll cuando el modal está abierto
  if (selectedProject) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  return (
    <section id="proyectos" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[var(--color-primary)] font-semibold tracking-wider uppercase text-sm mb-4 block">
            Nuestros Trabajos
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[var(--color-secondary)] mb-6">
            Proyectos Destacados
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Explora el detalle de nuestros últimos trabajos en diseño y fabricación de muebles a medida. Haz clic en cada proyecto para ver más información.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={handleOpenModal} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedProject(null)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-sm backdrop-blur-sm transition-colors"
              aria-label="Cerrar detalles del proyecto"
            >
              <X size={20} />
            </button>

            <div className="w-full md:w-1/2 h-64 md:h-auto relative group">
              <img
                src={selectedProject.project.images[modalImgIndex]}
                alt={selectedProject.project.title}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Modal Navigation Arrows */}
              {selectedProject.project.images.length > 1 && (
                <>
                  <button
                    onClick={prevModalImg}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-secondary)] p-2 rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextModalImg}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[var(--color-secondary)] p-2 rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Modal Image Indicators */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {selectedProject.project.images.map((_, idx) => (
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

            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary)] font-serif mb-6">
                {selectedProject.project.title}
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-[var(--color-primary)] mb-2">
                    <Tag size={18} />
                    <h4 className="font-semibold text-sm uppercase tracking-wider">Tipo de Construcción</h4>
                  </div>
                  <p className="text-gray-700">{selectedProject.project.constructionType}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[var(--color-primary)] mb-2">
                    <Layers size={18} />
                    <h4 className="font-semibold text-sm uppercase tracking-wider">Materiales</h4>
                  </div>
                  <p className="text-gray-700">{selectedProject.project.material}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[var(--color-primary)] mb-2">
                    <Info size={18} />
                    <h4 className="font-semibold text-sm uppercase tracking-wider">Descripción del Trabajo</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {selectedProject.project.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
