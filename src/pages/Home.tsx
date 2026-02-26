import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Process from '../components/Process';
import Projects from '../components/Projects';
import About from '../components/About';
import Contact from '../components/Contact';

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "InnovaMob",
    "image": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop",
    "description": "Diseño y fabricación de muebles a medida en Santiago. Cocinas, closets y mobiliario especializado con más de 35 años de experiencia.",
    "telephone": "+56995936847",
    "email": "contacto@innovamob.cl",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Santiago",
      "addressRegion": "Región Metropolitana",
      "addressCountry": "CL"
    },
    "url": "https://innovamob.cl",
    "priceRange": "$$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>InnovaMob | Muebles de cocina y closets a medida en Santiago</title>
        <meta name="description" content="Diseño y fabricación de muebles a medida: cocinas, closets y mobiliario especializado. InnovaMob ofrece soluciones personalizadas con más de 35 años de experiencia." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <main>
        <Hero />
        <Services />
        <Process />
        <Projects />
        <About />
        <Contact />
      </main>
    </>
  );
}
