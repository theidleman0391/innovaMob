import { MessageCircle, Ruler, MonitorPlay, Hammer, Wrench } from 'lucide-react';

const steps = [
  {
    title: 'Contacto',
    description: 'Escríbeme por WhatsApp o formulario para contarme tu idea.',
    icon: MessageCircle,
  },
  {
    title: 'Diagnóstico y medidas',
    description: 'Visito tu espacio para tomar medidas precisas y asesorarte.',
    icon: Ruler,
  },
  {
    title: 'Diseño 3D',
    description: 'Te presento una propuesta visual con renders fotorrealistas.',
    icon: MonitorPlay,
  },
  {
    title: 'Fabricación',
    description: 'Fabrico tus muebles con materiales de primera calidad.',
    icon: Hammer,
  },
  {
    title: 'Instalación',
    description: 'Realizo el montaje y los ajustes finales en tu espacio.',
    icon: Wrench,
  },
];

export default function Process() {
  return (
    <section id="proceso" className="py-10 md:py-14 xl:py-16 bg-bg-light">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-primary font-semibold tracking-wider uppercase text-xs mb-2 block">
            Cómo Trabajo
          </span>
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-3xl font-serif font-bold text-secondary mb-2">
            Mi Proceso de Trabajo
          </h2>
          <p className="text-gray-600 text-sm">
            Un método probado para garantizar resultados perfectos y tu total satisfacción en cada etapa del proyecto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-primary mb-4 border-4 border-bg-light group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon size={24} />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full h-full">
                  <span className="text-xs font-bold text-accent mb-2 block uppercase tracking-wider">
                    Paso 0{index + 1}
                  </span>
                  <h4 className="text-sm font-bold text-accent mb-2 font-serif">
                    {step.title}
                  </h4>
                  <p className="text-secondary text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
