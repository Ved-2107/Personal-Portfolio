'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/sections/Navbar';

export default function NotFound() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono text-8xl font-bold gradient-text mb-4">404</div>
          <h1 className="font-heading font-extrabold text-3xl mb-4">Page not found</h1>
          <p className="text-text2 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/"        className="btn-primary"  style={{ textDecoration: 'none' }}>← Go Home</Link>
            <Link href="/projects" className="btn-outline" style={{ textDecoration: 'none' }}>View Projects</Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
