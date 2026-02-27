import { CheckCircle2, MessageCircle, Home, LayoutGrid, RefreshCw, Building2 } from 'lucide-react';

const services = [
  {
    id: 'cocina-americana',
    title: 'Cocina americana en espacio abierto',
    description: 'Diseño e implementación de cocinas integradas al área social, con torre de hornos, cubierta postformada y encimera de inducción, optimizadas al centímetro e incorporando una isla funcional acorde al tránsito y uso del espacio.',
    icon: Home,
    bullets: [
      'Integración al área social',
      'Torre de hornos y encimera de inducción',
      'Isla funcional a medida',
    ],
  },
  {
    id: 'cocina-compacta',
    title: 'Cocina compacta en melamina acacia',
    description: 'Solución de cocina para espacios reducidos, con mobiliario en melamina color acacia y encimera en postformado de alta resistencia, priorizando durabilidad, ergonomía y máximo aprovechamiento del área disponible.',
    icon: LayoutGrid,
    bullets: [
      'Ideal para espacios reducidos',
      'Melamina acacia y postformado',
      'Máximo aprovechamiento del área',
    ],
  },
  {
    id: 'renovacion-cocina',
    title: 'Renovación completa de cocina',
    description: 'Proyecto integral de actualización de cocina que incluye fabricación de nuevo mobiliario, incorporación de península para cubrir elementos estructurales, y habilitación de encimera de gas y campana al aire, logrando un espacio moderno, funcional y coherente con la arquitectura existente.',
    icon: RefreshCw,
    bullets: [
      'Actualización integral de mobiliario',
      'Incorporación de península',
      'Diseño coherente con la arquitectura',
    ],
  },
  {
    id: 'remodelacion-oficina',
    title: 'Remodelación completa de oficina',
    description: 'Desarrollo de mobiliario corporativo a medida con cubiertas postformadas y estructura en melamina color grafito y peral, orientado a mejorar la operatividad, la estética y la organización del entorno de trabajo.',
    icon: Building2,
    bullets: [
      'Mobiliario corporativo a medida',
      'Estructuras en melamina grafito y peral',
      'Mejora de operatividad y estética',
    ],
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-10 md:py-14 xl:py-20 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-[var(--color-primary)] font-semibold tracking-wider uppercase text-xs mb-2 block">
            Mis Servicios
          </span>
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-[var(--color-accent)] mb-2">
            Soluciones a medida para cada espacio
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Transformo tus ideas en realidad con muebles diseñados específicamente para tus necesidades, combinando estética, funcionalidad y durabilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-[var(--color-bg-light)] rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center text-[var(--color-primary)] shrink-0 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--color-secondary)] font-serif leading-tight">
                    {service.title}
                  </h3>
                </div>

                <p className="text-[var(--color-secondary)] text-sm mb-5 flex-grow">
                  {service.description}
                </p>

                <ul className="space-y-2 mt-auto">
                  {service.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
                      <span className="text-[var(--color-secondary)] text-xs">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://wa.me/56995936847"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
          >
            <MessageCircle size={24} />
            <span>Consultar</span>
          </a>
        </div>
      </div>
    </section>
  );
}
