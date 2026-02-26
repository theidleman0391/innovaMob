/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import ProjectsPage from './pages/ProjectsPage';
import AdminPage from './pages/AdminPage';

/** Wraps children with a fade-in animation on every route change */
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<'idle' | 'fadeOut' | 'fadeIn'>('idle');
  const prevKey = useRef(location.key);

  useEffect(() => {
    if (location.key === prevKey.current) return;
    prevKey.current = location.key;

    setPhase('fadeOut');

    const out = setTimeout(() => {
      setDisplayChildren(children);
      setPhase('fadeIn');

      const inn = setTimeout(() => setPhase('idle'), 350);
      return () => clearTimeout(inn);
    }, 250);

    return () => clearTimeout(out);
  }, [location.key, children]);

  const style: React.CSSProperties =
    phase === 'fadeOut'
      ? { opacity: 0, transition: 'opacity 250ms ease' }
      : phase === 'fadeIn'
        ? { opacity: 1, transition: 'opacity 350ms ease' }
        : { opacity: 1 };

  return <div style={style}>{displayChildren}</div>;
}

export default function App() {
  const location = useLocation();

  const isAdmin = location.pathname === '/admin';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Header />}
      <div className="flex-grow">
        <PageTransition>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/proyectos" element={<ProjectsPage />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </PageTransition>
      </div>
      {!isAdmin && <Footer />}
    </div>
  );
}
