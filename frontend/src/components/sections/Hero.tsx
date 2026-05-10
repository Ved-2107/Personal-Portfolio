'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PERSONAL_DETAILS, SOCIAL_LINKS } from '@/config/personal';

const ROLES        = ['AI/ML Engineer', 'Full Stack Developer', 'Quant Finance Enthusiast', 'Systems Programmer'];
const FLOAT_ICONS  = ['Python', 'React', 'C++', 'RAG', 'ML', 'WebSocket', 'FAISS', 'Next.js'];
const SKILL_CHIPS  = ['Python', 'React', 'C++', 'Node.js', 'RAG', 'FAISS', 'Whisper', 'MongoDB', 'TypeScript', 'WebSockets'];
const STATS        = [
  { value: '99.2%', label: 'JEE Mains',   href: '/about'    },
  { value: '4+',    label: 'Projects',     href: '/projects'  },
  { value: '15+',   label: 'Technologies', href: '/skills'    },
  { value: 'COEP',  label: 'University',  href: '/about'     },
];
const SOCIALS = [
  {
    id: 'github',
    label: SOCIAL_LINKS.github.label,
    url: SOCIAL_LINKS.github.url,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: SOCIAL_LINKS.linkedin.label,
    url: SOCIAL_LINKS.linkedin.url,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    url: `mailto:${PERSONAL_DETAILS.email}`,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
];

export default function Hero() {
  const [displayRole, setDisplayRole] = useState('');
  const [roleIdx, setRoleIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied]     = useState(false);
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
  const item = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(PERSONAL_DETAILS.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '5rem', paddingBottom: '4rem', position: 'relative' }}>
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">

        {/* ── LEFT COPY ── */}
        <motion.div variants={wrap} initial="hidden" animate="visible">

          {/* Status badge */}
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 font-mono text-xs text-accent border border-accent/25 px-4 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(0,212,255,0.06)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
              Available for opportunities
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1 variants={item} className="font-heading font-extrabold leading-none mb-3"
            style={{ fontSize: 'clamp(3.2rem,6.5vw,5.5rem)' }}>
            Ved<br /><span className="gradient-text">Bajaj</span>
          </motion.h1>

          {/* Typed role */}
          <motion.div variants={item} className="font-mono text-accent text-base mb-5 flex items-center gap-1"
            style={{ minHeight: '1.6rem' }}>
            {displayRole}<span className="animate-pulse">|</span>
          </motion.div>

          {/* Description */}
          <motion.p variants={item} className="text-text2 leading-relaxed mb-6 max-w-lg" style={{ fontSize: '0.97rem' }}>
            Building intelligent systems at the intersection of AI/ML, real-time architectures, and
            quantitative finance. BTech CS @ <span className="text-accent">COEP Technological University</span>, Pune.
          </motion.p>

          {/* Skill chips */}
          <motion.div variants={item} className="flex flex-wrap gap-2 mb-8">
            {SKILL_CHIPS.map(s => (
              <Link key={s} href="/skills" style={{ textDecoration: 'none' }}>
                <motion.span whileHover={{ scale: 1.07, borderColor: '#00d4ff', color: '#00d4ff' }}
                  className="font-mono text-xs px-2.5 py-1 rounded-md border border-border2 text-text3 transition-all cursor-pointer"
                  style={{ display: 'inline-block' }}>
                  {s}
                </motion.span>
              </Link>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div variants={item} className="flex flex-wrap gap-3 mb-8">
            <Link href="/projects" className="btn-primary" style={{ textDecoration: 'none' }}>View Projects ↗</Link>
            <Link href="/contact"  className="btn-outline" style={{ textDecoration: 'none' }}>Get In Touch</Link>
            <a href={PERSONAL_DETAILS.resumeUrl} download target="_blank" rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2" style={{ textDecoration: 'none' }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Resume
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div variants={item} className="flex items-center gap-3 mb-10">
            <span className="font-mono text-xs text-text3 uppercase tracking-wider">Find me on</span>
            <div className="flex gap-2">
              {SOCIALS.map(s => (
                <div key={s.label} className="relative group/social">
                  <motion.a href={s.url} target={s.id === 'email' ? undefined : "_blank"} rel="noopener noreferrer"
                    whileHover={{ y: -3, color: '#00d4ff' }}
                    onClick={s.id === 'email' ? handleCopyEmail : undefined}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-text2 hover:border-accent/50 hover:text-accent transition-all"
                    style={{ background: 'var(--surface)', textDecoration: 'none' }}
                    title={s.id === 'email' ? 'Click to copy email' : s.label}>
                    {s.icon}
                  </motion.a>
                  {s.id === 'email' && copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent text-bg font-mono text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover/social:opacity-100 transition-opacity">
                      Copied!
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="flex flex-wrap gap-8 pt-4 border-t border-border">
            {STATS.map(s => (
              <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }} className="group">
                <div className="font-heading font-extrabold text-2xl gradient-text group-hover:opacity-80 transition-opacity">{s.value}</div>
                <div className="font-mono text-xs text-text3 uppercase tracking-widest mt-0.5">{s.label}</div>
              </Link>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT ORBITAL ── */}
        <div className="hidden lg:flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="relative w-96 h-96"
          >
            {/* Rings */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(0,212,255,0.1)' }} />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-10 rounded-full" style={{ border: '1px dashed rgba(0,212,255,0.12)' }} />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-20 rounded-full" style={{ border: '1px solid rgba(157,78,255,0.15)' }} />

            {/* Core */}
            <div className="absolute inset-28 rounded-full flex items-center justify-center"
              style={{ background: 'radial-gradient(circle,rgba(0,212,255,0.12),rgba(0,136,255,0.06))', border: '1px solid rgba(0,212,255,0.25)', boxShadow: '0 0 40px rgba(0,212,255,0.1)' }}>
              <span className="font-heading font-extrabold text-3xl gradient-text">VB</span>
            </div>

            {/* Floating skill icons */}
            {FLOAT_ICONS.map((icon, i) => {
              const angle = (i / FLOAT_ICONS.length) * 2 * Math.PI;
              const r = 162;
              return (
                <motion.div key={icon}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: [0, -8, 0] }}
                  transition={{ opacity: { delay: 0.6 + i * 0.08 }, y: { duration: 3 + (i % 3) * 0.5, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' } }}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${Math.cos(angle) * r}px)`,
                    top:  `calc(50% + ${Math.sin(angle) * r}px)`,
                    transform: 'translate(-50%,-50%)',
                  }}
                  className="font-mono text-xs px-2 py-1 rounded-md text-accent whitespace-nowrap"
                  style2={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.7rem', padding: '0.25rem 0.6rem', background: 'rgba(13,26,42,0.95)', border: '1px solid rgba(26,45,69,0.8)', borderRadius: '6px', color: '#00d4ff', display: 'inline-block' }}>
                    {icon}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
