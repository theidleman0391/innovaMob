import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct WhatsApp message
    let text = `¡Hola! Me gustaría cotizar un proyecto.\n\n`;
    text += `*Mi nombre es:* ${formData.name}\n`;
    text += `*Soy de:* ${formData.city}\n`;

    if (formData.email) {
      text += `*Mi correo es:* ${formData.email}\n`;
    }

    text += `\n*Mi idea / proyecto:* \n${formData.message}\n`;

    const whatsappUrl = `https://wa.me/56995936847?text=${encodeURIComponent(text)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Optional: reset form
    setFormData({ name: '', email: '', phone: '', city: '', message: '' });
  };

  return (
    <section id="contacto" className="py-10 md:py-14 xl:py-20 bg-[var(--color-bg-light)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--color-primary)]/5 rounded-l-full -z-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-[var(--color-accent)]/5 rounded-r-full -z-10 blur-3xl"></div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Contact Info */}
          <div>
            <span className="text-[var(--color-primary)] font-semibold tracking-wider uppercase text-xs mb-2 block">
              Contacto
            </span>
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-[var(--color-accent)] mb-3">
              ¿Listo para transformar tu espacio?
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              La forma más rápida de cotizar tu proyecto es escribiéndonos por WhatsApp. Nuestro equipo de diseñadores te responderá en poco tiempo para agendar una visita técnica.
            </p>

            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>

              <h3 className="text-lg font-bold text-[var(--color-secondary)] font-serif mb-3 flex items-center gap-2">
                <MessageCircle className="text-[var(--color-accent)] w-5 h-5" />
                Atención Inmediata
              </h3>

              <p className="text-gray-600 mb-4 text-sm">
                Escríbenos directamente a nuestro WhatsApp para una atención personalizada y rápida.
              </p>

              <a
                href="https://wa.me/56995936847"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-1 text-sm"
              >
                <MessageCircle size={28} />
                <span>Contáctanos</span>
              </a>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center text-[var(--color-primary)] shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-secondary)] text-sm">Teléfono</h4>
                  <p className="text-gray-600">+56 9 9593 6847</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center text-[var(--color-primary)] shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-secondary)] text-sm">Área de Servicio</h4>
                  <p className="text-gray-600">Atención en Puerto Montt y Regiones, Chile</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full">
            <h3 className="text-xl font-bold text-[var(--color-accent)] font-serif mb-2">
              ¿Tienes los planos? Compártenos tu proyecto
            </h3>
            <p className="text-[var(--color-accent)]/80 text-sm mb-5">
              Completa los datos y te redirigiremos para enviar toda la información directamente.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-gray-700">Nombre completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="city" className="text-xs font-medium text-gray-700">Comuna / Ciudad</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Ej. Puerto Montt"
                  />
                </div>
              </div>

              <div className="space-y-1.5 flex-grow">
                <label htmlFor="message" className="text-xs font-medium text-gray-700">Detalles del proyecto</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full h-full min-h-[100px] px-3 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                  placeholder="Cuéntanos qué tienes en mente, medidas aproximadas, etc..."
                ></textarea>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 items-start my-4">
                <MessageCircle className="w-5 h-5 flex-shrink-0 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-800 font-medium">
                    Fotos y Planos
                  </p>
                  <p className="text-[11px] text-blue-600/80 mt-0.5 leading-snug">
                    Una vez que se abra WhatsApp, podrás adjuntar directamente desde ahí las fotos de tu espacio o los planos de tu proyecto para una cotización más exacta.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-secondary)] hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg mt-auto"
              >
                <span>Enviar datos a WhatsApp</span>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
