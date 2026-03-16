import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPosts } from '../services/blogStore';
import type { BlogPost } from '../types/post';

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="pt-24 min-h-[100dvh] bg-bg-light">
      <Helmet>
        <title>Blog | InnovaMob - Consejos sobre muebles a medida</title>
        <meta name="description" content="Descubre consejos, tendencias y guías sobre diseño y fabricación de muebles de cocina, closets y mobiliario a medida." />
      </Helmet>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">
            Nuestro Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-6">
            Inspiración y consejos para tu hogar
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Explora nuestros artículos sobre tendencias de diseño, optimización de espacios y guías para elegir los mejores materiales para tus muebles a medida.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Aún no hay artículos publicados en el blog.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col h-full">
                <Link to={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                    {post.category}
                  </div>
                </Link>

                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <Calendar size={16} />
                    <time dateTime={post.date}>{post.date}</time>
                  </div>

                  <h2 className="text-xl font-bold text-secondary mb-3 font-serif line-clamp-2 group-hover:text-primary transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                    {post.summary}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-hover transition-colors mt-auto group/link"
                  >
                    <span>Leer artículo completo</span>
                    <ArrowRight size={18} className="transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
