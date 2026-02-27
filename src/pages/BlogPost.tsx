import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { getPostBySlug } from '../services/blogStore';
import type { BlogPost as BlogPostType } from '../types/post';

export default function BlogPost() {
  const { id: slug } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "InnovaMob"
    },
    "publisher": {
      "@type": "Organization",
      "name": "InnovaMob",
      "logo": {
        "@type": "ImageObject",
        "url": "https://innovamob.cl/logo.png"
      }
    },
    "description": post.summary
  };

  return (
    <div className="pt-24 min-h-screen bg-white">
      <Helmet>
        <title>{post.title} | Blog InnovaMob</title>
        <meta name="description" content={post.summary} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <article className="container mx-auto px-4 md:px-6 max-w-4xl py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Inicio</Link>
          <ChevronRight size={14} />
          <Link to="/blog" className="hover:text-[var(--color-primary)] transition-colors">Blog</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider mb-6">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-[var(--color-secondary)] mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Calendar size={16} />
            <time dateTime={post.date}>{post.date}</time>
            <span className="mx-2">•</span>
            <span>Por Equipo InnovaMob</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-[21/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-lg mb-16">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-slate mx-auto max-w-3xl prose-headings:font-serif prose-headings:text-[var(--color-secondary)] prose-a:text-[var(--color-primary)] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
        </div>

        {/* Footer / CTA */}
        <footer className="max-w-3xl mx-auto mt-16 pt-12 border-t border-gray-100">
          <div className="bg-[var(--color-bg-light)] rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-serif font-bold text-[var(--color-secondary)] mb-4">
              ¿Inspirado para tu próximo proyecto?
            </h3>
            <p className="text-gray-600 mb-8">
              Si estás pensando en renovar tu cocina, diseñar un closet a medida o crear mobiliario especializado, nuestro equipo de expertos está listo para asesorarte.
            </p>
            <a
              href="https://wa.me/56995936847"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-8 py-4 rounded-full font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Cotizar mi proyecto por WhatsApp</span>
            </a>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors font-medium"
            >
              <ArrowLeft size={18} />
              <span>Volver a todos los artículos</span>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
