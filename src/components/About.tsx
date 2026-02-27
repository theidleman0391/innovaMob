import { CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <section id="nosotros" className="py-10 md:py-14 xl:py-20 bg-[var(--color-bg-light)]">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/nosotros.svg"
                alt="Taller de fabricación de muebles a medida"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl hidden md:block max-w-xs">
              <p className="text-2xl font-bold text-[var(--color-primary)] mb-1">+35</p>
              <p className="text-sm text-[var(--color-secondary)] font-medium">Años transformando espacios con muebles a medida.</p>
            </div>
          </div>

          <div>
            <span className="text-[var(--color-primary)] font-semibold tracking-wider uppercase text-xs mb-2 block">
              Sobre InnovaMob
            </span>
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-[var(--color-accent)] mb-3">
              Pasión por el diseño y la excelencia en cada detalle
            </h2>

            <div className="space-y-3 text-gray-600 text-sm leading-relaxed mb-4">
              <p>
                En InnovaMob soy especialista en el diseño y fabricación de muebles a medida. Con más de 35 años de experiencia en el mercado, he perfeccionado el arte de crear espacios únicos que combinan funcionalidad, estética y durabilidad.
              </p>
              <p>
                Mi enfoque se centra en el <strong>diseño personalizado</strong>. Entiendo que cada hogar es diferente, por lo que trabajo de la mano contigo para materializar tus ideas utilizando materiales de última generación y herrajes de la más alta calidad.
              </p>
            </div>

            <ul className="space-y-2 mb-6">
              {[
                'Atención personalizada de principio a fin',
                'Materiales y herrajes de última generación',
                'Garantía de calidad en fabricación e instalación',
                'Cumplimiento estricto de plazos de entrega'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                  <span className="text-[var(--color-secondary)] text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
