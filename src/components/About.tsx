import { CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <section id="nosotros" className="py-24 bg-[var(--color-bg-light)]">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/nosotros.svg"
                alt="Taller de fabricación de muebles a medida"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-2xl shadow-xl hidden md:block max-w-xs">
              <p className="text-4xl font-bold text-[var(--color-primary)] mb-2">+35</p>
              <p className="text-[var(--color-secondary)] font-medium">Años transformando espacios con muebles a medida.</p>
            </div>
          </div>

          <div>
            <span className="text-[var(--color-primary)] font-semibold tracking-wider uppercase text-sm mb-4 block">
              Sobre InnovaMob
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[var(--color-secondary)] mb-6">
              Pasión por el diseño y la excelencia en cada detalle
            </h2>

            <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-8">
              <p>
                En InnovaMob somos especialistas en el diseño y fabricación de muebles a medida. Con más de 35 años de experiencia en el mercado, hemos perfeccionado el arte de crear espacios únicos que combinan funcionalidad, estética y durabilidad.
              </p>
              <p>
                Nuestro enfoque se centra en el <strong>diseño personalizado</strong>. Entendemos que cada hogar es diferente, por lo que trabajamos de la mano contigo para materializar tus ideas utilizando materiales de última generación y herrajes de la más alta calidad.
              </p>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                'Atención personalizada de principio a fin',
                'Materiales y herrajes de última generación',
                'Garantía de calidad en fabricación e instalación',
                'Cumplimiento estricto de plazos de entrega'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[var(--color-accent)] shrink-0" />
                  <span className="text-[var(--color-secondary)] font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
