import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/#inicio' },
    { name: 'Servicios', href: '/#servicios' },
    { name: 'Proyectos', href: '/proyectos' },
    { name: 'Nosotros', href: '/#nosotros' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contacto', href: '/#contacto' },
  ];

  const smoothScrollTo = (targetY: number) => {
    const startY = window.scrollY;
    // Account for header offset (-80px)
    const distance = (targetY - 80) - startY;
    const duration = 800; // 800ms duration for a premium feel
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

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    // Close mobile menu immediately so it doesn't stay open during scroll
    setIsMobileMenuOpen(false);

    const [path, hash] = href.split('#');
    const targetPath = path || '/';

    // If we are already on the target page, prevent default and smooth scroll
    if (location.pathname === targetPath) {
      if (hash) {
        // Scroll to specific section on the same page
        const element = document.getElementById(hash);
        if (element) {
          e.preventDefault();
          const targetY = element.getBoundingClientRect().top + window.scrollY;
          smoothScrollTo(targetY);
          window.history.pushState(null, '', href);
        }
      } else {
        // Scroll to top of the page if no hash
        e.preventDefault();
        smoothScrollTo(80); // scroll to top (80px is compensated in smoothScrollTo)
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${isScrolled ? 'bg-accent-dark shadow-md py-2' : 'bg-accent shadow-sm py-3 md:py-4'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center max-w-7xl">
        <Link to="/" className="flex items-center gap-2" onClick={(e) => handleNavClick(e, '/#inicio')}>
          <img src="/logo.png" alt="InnovaMob Logo" className="h-8 md:h-10 w-auto object-contain transition-all duration-300" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-white/90 hover:text-white font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div id="mobile-nav-menu" className={`md:hidden absolute top-full left-0 right-0 shadow-lg border-t border-white/10 ${isScrolled ? 'bg-accent-dark' : 'bg-accent'}`}>
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-white/90 font-medium p-3 hover:bg-black/10 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
