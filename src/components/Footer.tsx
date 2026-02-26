import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-secondary)] text-white py-8">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl text-center">
        <p className="text-gray-400 text-sm">
          &copy; 2026 InnovaMob. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
