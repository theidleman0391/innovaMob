import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/#inicio' },
    { name: 'Servicios', href: '/#servicios' },
    { name: 'Proyectos', href: '/#proyectos' },
    { name: 'Nosotros', href: '/#nosotros' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contacto', href: '/#contacto' },
  ];

  const smoothScrollTo = (element: HTMLElement) => {
    const targetY = element.getBoundingClientRect().top + window.scrollY - 80; // offset for fixed header
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 800; // ms
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

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#') && location.pathname === '/') {
      const id = href.substring(2);
      const element = document.getElementById(id);
      if (element) {
        smoothScrollTo(element);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[var(--color-secondary)] shadow-md py-2' : 'bg-[var(--color-secondary)]/90 backdrop-blur-sm py-2'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center max-w-7xl">
        <Link to="/" className="flex items-center gap-2" onClick={() => handleNavClick('/#inicio')}>
          <img src="/logo.png" alt="InnovaMob Logo" className="h-8 md:h-9 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-gray-200 hover:text-white font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--color-secondary)] shadow-lg border-t border-gray-700">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-gray-200 font-medium p-2 hover:bg-gray-800 rounded-lg"
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
