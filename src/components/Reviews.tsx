import { Star, Quote } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: 'Carolina M.',
        location: 'Puerto Varas',
        text: 'Increíble trabajo con nuestra cocina. Entendieron perfectamente lo que queríamos, aprovecharon cada centímetro y los acabados son de primera. Totalmente recomendados.',
        rating: 5,
    },
    {
        id: 2,
        name: 'Roberto S.',
        location: 'Puerto Montt',
        text: 'Mandamos a hacer los closets de toda la casa. La puntualidad y la limpieza durante la instalación fueron excepcionales. Materiales de muy buena calidad.',
        rating: 5,
    },
    {
        id: 3,
        name: 'Familia González',
        location: 'Llanquihue',
        text: 'Transformaron nuestro baño por completo. El mueble suspendido quedó hermoso y es súper funcional. La asesoría en diseño fue clave para tomar buenas decisiones.',
        rating: 5,
    },
];

export default function Reviews() {
    return (
        <section id="resenas" className="py-10 md:py-14 xl:py-20 bg-white relative">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <span className="text-[var(--color-primary)] font-semibold tracking-wider uppercase text-xs mb-2 block">
                        Testimonios
                    </span>
                    <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-[var(--color-accent)] mb-2">
                        Lo que dicen nuestros clientes
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        La satisfacción de quienes confían en nosotros es nuestra mejor carta de presentación y garantía de calidad.
                    </p>
                </div>

                <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 md:mx-0 md:px-0 scrollbar-hide items-stretch">
                    {reviews.map((review) => (
                        <div key={review.id} className="w-[85vw] flex-shrink-0 snap-center md:w-auto md:flex-shrink bg-[var(--color-bg-light)] p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full relative group hover:-translate-y-1 hover:shadow-md transition-all duration-300 mr-4 md:mr-0">
                            <Quote className="absolute top-4 right-4 text-[var(--color-primary)]/20 w-10 h-10 group-hover:text-[var(--color-primary)]/40 transition-colors" />

                            <div className="flex gap-1 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-[var(--color-primary)] text-[var(--color-primary)]" />
                                ))}
                            </div>

                            <p className="text-[var(--color-accent)] text-sm mb-6 flex-grow italic relative z-10 leading-relaxed">
                                "{review.text}"
                            </p>

                            <div className="mt-auto">
                                <hr className="border-[var(--color-accent)]/10 mb-4" />
                                <h4 className="font-bold text-[var(--color-accent)] font-serif text-base">{review.name}</h4>
                                <p className="text-xs text-[var(--color-accent)]/70">{review.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
