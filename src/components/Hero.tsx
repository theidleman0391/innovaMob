import { MessageCircle, ArrowRight } from 'lucide-react';

const smoothScrollTo = (element: HTMLElement) => {
  const targetY = element.getBoundingClientRect().top + window.scrollY - 80;
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = 800;
  let startTime: number | null = null;

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"
          alt="Cocina moderna a medida"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)]/90 to-[var(--color-secondary)]/60"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <div className="max-w-3xl">
          <span className="inline-block py-1 px-3 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-medium text-sm mb-6 border border-[var(--color-primary)]/30 backdrop-blur-sm">
            Diseño y Fabricación Personalizada
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6">
            Muebles de cocina y closets a medida en Santiago
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl">
            Diseño moderno, funcional y personalizado. Te acompañamos desde la idea hasta la instalación con asesoría técnica y más de 35 años de experiencia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/56995936847"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg"
            >
              <MessageCircle size={24} />
              <span>Cotiza tu proyecto gratis</span>
            </a>

            <button
              onClick={() => {
                const el = document.getElementById('servicios');
                if (el) smoothScrollTo(el);
              }}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-medium transition-all backdrop-blur-sm text-lg"
            >
              <span>Ver servicios</span>
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-white/20 pt-8">
            <div>
              <p className="text-3xl font-bold text-[var(--color-primary)] mb-1">+35</p>
              <p className="text-sm text-gray-300">Años de experiencia</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--color-primary)] mb-1">100%</p>
              <p className="text-sm text-gray-300">Diseño personalizado</p>
            </div>
            <div className="hidden md:block">
              <p className="text-3xl font-bold text-[var(--color-primary)] mb-1">3D</p>
              <p className="text-sm text-gray-300">Visualización previa</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
