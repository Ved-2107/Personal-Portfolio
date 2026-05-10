'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SiteFooter from '@/components/sections/SiteFooter';
import Navbar from '@/components/sections/Navbar';

const ROLES = ['AI/ML Engineer', 'Full Stack Developer', 'Quant Finance Enthusiast', 'Systems Programmer'];
const FLOAT_ICONS = ['Python', 'React', 'C++', 'RAG', 'ML', 'WebSocket', 'FAISS', 'Next.js'];
const STATS = [
  { value: '99.2%', label: 'JEE Mains', href: '/about'    },
  { value: '4+',    label: 'Projects',  href: '/projects'  },
  { value: '15+',   label: 'Skills',    href: '/skills'    },
  { value: 'COEP',  label: 'University',href: '/about'     },
];
const QUICK_LINKS = [
  { href: '/projects',   label: 'View Projects', desc: 'VocaBridge, Exchange Simulator & more', icon: '◈' },
  { href: '/skills',     label: 'Tech Stack',    desc: 'Python, React, C++, AI/ML & more',     icon: '⬡' },
  { href: '/chat',       label: 'Chat with AI',  desc: 'Ask anything about Ved',               icon: '◇' },
  { href: '/contact',    label: 'Get In Touch',  desc: 'Open to opportunities',                icon: '✉' },
];

export default function Home() {
  const [displayRole, setDisplayRole] = useState('');
  const [roleIdx, setRoleIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const role = ROLES[roleIdx];
    if (!deleting) {
      if (charIdx < role.length) {
        timer.current = setTimeout(() => { setDisplayRole(role.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, 80);
      } else {
        timer.current = setTimeout(() => setDeleting(true), 2200);
      }
    } else {
      if (charIdx > 0) {
        timer.current = setTimeout(() => { setDisplayRole(role.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, 45);
      } else {
        setDeleting(false);
        setRoleIdx(r => (r + 1) % ROLES.length);
      }
    }
    return () => clearTimeout(timer.current);
  }, [charIdx, deleting, roleIdx]);

  const wrap = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const item  = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(26,45,69,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(26,45,69,0.4) 1px,transparent 1px)',
          backgroundSize: '60px 60px', opacity: 0.3,
        }} />
        <div className="absolute rounded-full" style={{ width: 700, height: 700, top: '-10%', left: '-10%', background: 'radial-gradient(circle,rgba(0,212,255,0.04),transparent 65%)' }} />
        <div className="absolute rounded-full" style={{ width: 500, height: 500, bottom: '0', right: '5%', background: 'radial-gradient(circle,rgba(157,78,255,0.05),transparent 65%)' }} />
      </div>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex items-center pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <motion.div variants={wrap} initial="hidden" animate="visible">
            <motion.div variants={item}>
              <span className="inline-block font-mono text-xs text-accent border border-accent/25 px-4 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(0,212,255,0.06)' }}>
                // Available for opportunities
              </span>
            </motion.div>

            <motion.h1 variants={item} className="font-heading font-extrabold leading-none mb-3"
              style={{ fontSize: 'clamp(3.5rem,7vw,6rem)' }}>
              Ved<br /><span className="gradient-text">Bajaj</span>
            </motion.h1>

            <motion.div variants={item} className="font-mono text-accent text-base mb-6 flex items-center gap-1" style={{ minHeight: '1.6rem' }}>
              {displayRole}<span className="animate-pulse text-accent">|</span>
            </motion.div>

            <motion.p variants={item} className="text-text2 leading-relaxed mb-8 max-w-lg" style={{ fontSize: '1rem' }}>
              Building intelligent systems at the intersection of AI/ML, real-time architectures, and
              quantitative finance. BTech CS @ COEP Technological University, Pune.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4 mb-12">
              <Link href="/projects" className="btn-primary" style={{ textDecoration: 'none' }}>View Projects ↗</Link>
              <Link href="/contact"  className="btn-outline"  style={{ textDecoration: 'none' }}>Get In Touch</Link>
              <a href="/resume.pdf" download target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textDecoration: 'none' }}>↓ Resume</a>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-8">
              {STATS.map(s => (
                <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }} className="group">
                  <div className="font-heading font-extrabold text-2xl gradient-text group-hover:opacity-80 transition-opacity">{s.value}</div>
                  <div className="font-mono text-xs text-text3 uppercase tracking-widest mt-0.5">{s.label}</div>
                </Link>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — orbital visual */}
          <div className="hidden lg:flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="relative w-96 h-96"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(0,212,255,0.1)' }} />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-12 rounded-full" style={{ border: '1px dashed rgba(0,212,255,0.15)' }} />
              <div className="absolute inset-24 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <span className="font-heading font-extrabold text-3xl gradient-text">VB</span>
              </div>
              {FLOAT_ICONS.map((icon, i) => {
                const angle = (i / FLOAT_ICONS.length) * 2 * Math.PI;
                const r = 168;
                return (
                  <motion.div key={icon}
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.45, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${Math.cos(angle) * r}px)`,
                      top:  `calc(50% + ${Math.sin(angle) * r}px)`,
                      transform: 'translate(-50%,-50%)',
                    }}
                    className="font-mono text-xs px-2 py-1 bg-surface border border-border rounded-md text-accent whitespace-nowrap"
                  >
                    {icon}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick-nav cards */}
      <section className="relative z-10 pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="font-mono text-xs text-text3 uppercase tracking-widest text-center mb-6"
          >
            Explore
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_LINKS.map((ql, i) => (
              <motion.div key={ql.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.1 }}>
                <Link href={ql.href} style={{ textDecoration: 'none', display: 'block' }}
                  className="p-5 bg-surface border border-border rounded-2xl hover:border-accent/30 transition-all duration-300 group block">
                  <div className="font-mono text-2xl text-accent mb-3 group-hover:scale-110 inline-block transition-transform">{ql.icon}</div>
                  <div className="font-heading font-bold text-sm mb-1 text-text group-hover:text-accent transition-colors">{ql.label}</div>
                  <div className="font-mono text-xs text-text3 leading-relaxed">{ql.desc}</div>
                  <div className="mt-3 font-mono text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">Open →</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
          <SiteFooter />
    </main>
  );
}
