'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/sections/Navbar';
import SiteFooter from '@/components/sections/SiteFooter';

interface Props {
  tag: string;
  title: string;
  accent: string;
  desc?: string;
  children: ReactNode;
  breadcrumb?: string;
}

export default function PageShell({ tag, title, accent, desc, children, breadcrumb }: Props) {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Subtle bg grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(26,45,69,0.35) 1px,transparent 1px),linear-gradient(90deg,rgba(26,45,69,0.35) 1px,transparent 1px)',
          backgroundSize: '60px 60px', opacity: 0.28,
        }} />
        <div className="absolute rounded-full" style={{ width: 600, height: 600, top: '-5%', right: '-10%', background: 'radial-gradient(circle,rgba(0,212,255,0.04),transparent 65%)' }} />
      </div>

      <div className="relative z-10 pt-28 pb-16 flex-1">
        <div className="max-w-7xl mx-auto px-6">

          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-2 font-mono text-xs text-text3">
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}
                className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--accent)' }}>{breadcrumb || accent}</span>
            </div>
          </motion.div>

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-16"
          >
            <span className="section-tag">{tag}</span>
            <h1 className="section-title">
              {title} <span className="gradient-text">{accent}</span>
            </h1>
            <div className="w-16 h-0.5 mt-3" style={{ background: 'linear-gradient(135deg,#00d4ff,#0088ff)' }} />
            {desc && <p className="text-text2 mt-4 max-w-xl" style={{ fontSize: '1rem' }}>{desc}</p>}
          </motion.div>

          {children}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
