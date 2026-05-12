'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { href: '/about',      label: 'About'      },
  { href: '/skills',     label: 'Skills'     },
  { href: '/projects',   label: 'Projects'   },
  { href: '/experience', label: 'Experience' },
  { href: '/blog',       label: 'Blog'       },
  { href: '/chat',       label: 'AI Chat'    },
  { href: '/contact',    label: 'Contact'    },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg-primary/90 backdrop-blur-2xl border-b border-border py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-heading font-extrabold text-xl gradient-text no-underline">
            VB.
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1 list-none">
            {NAV_LINKS.map(link => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`font-mono text-xs uppercase tracking-widest px-3 py-2 rounded-lg no-underline transition-all duration-200 block ${
                      active
                        ? 'text-accent bg-accent/8 border border-accent/20'
                        : 'text-text2 border border-transparent hover:text-accent hover:bg-accent/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden sm:inline-block btn-primary text-sm px-5 py-2 no-underline">
              Hire Me
            </Link>
            {isAuthenticated && (
              <button onClick={handleLogout} className="hidden sm:inline-block font-mono text-xs text-text3 hover:text-accent transition-colors ml-2 bg-transparent border-0 cursor-pointer">
                Logout
              </button>
            )}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden flex flex-col gap-1.5 p-2 bg-transparent border-0 cursor-pointer"
              aria-label="Toggle menu"
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="block w-5 bg-text transition-all duration-200"
                  style={{
                    height: '1.5px',
                    transform: mobileOpen
                      ? i === 0 ? 'rotate(45deg) translateY(6.5px)'
                        : i === 2 ? 'rotate(-45deg) translateY(-6.5px)'
                        : 'scaleX(0)'
                      : 'none',
                    opacity: mobileOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 lg:hidden"
            style={{ background: 'rgba(2,4,8,0.97)', backdropFilter: 'blur(24px)' }}
          >
            {[{ href: '/', label: 'Home' }, ...NAV_LINKS].map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={link.href}
                  className={`font-heading font-extrabold no-underline transition-colors ${
                    pathname === link.href ? 'text-accent' : 'text-text hover:text-accent'
                  }`}
                  style={{ fontSize: '2rem' }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Link href="/contact" className="btn-primary mt-4 no-underline inline-block">
                Hire Me
              </Link>
            </motion.div>
            {isAuthenticated && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <button onClick={handleLogout} className="font-mono text-sm text-text3 hover:text-accent mt-4 bg-transparent border-0 cursor-pointer">
                  Logout
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
