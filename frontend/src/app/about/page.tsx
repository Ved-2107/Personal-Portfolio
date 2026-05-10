'use client';
import type { Metadata } from 'next';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PageShell from '@/components/ui/PageShell';
import LeetCodeStats from '@/components/sections/LeetCodeStats';


const ACHIEVEMENTS = [
  { icon: '🎯', label: 'JEE Mains 2023',  value: '99.2 Percentile' },
  { icon: '⚡', label: 'MHTCET 2023',     value: '98.6 Percentile' },
  { icon: '🏛️', label: 'University',       value: 'COEP Technological University' },
  { icon: '📍', label: 'Location',         value: 'Pune, Maharashtra, India' },
];

const TIMELINE = [
  { date: '2023 — Present', title: 'BTech CS @ COEP', desc: 'Computer Science with focus on AI/ML, systems programming, and software engineering.', color: 'var(--accent)' },
  { date: '2024', title: 'VocaBridge — AI Banking Assistant', desc: 'Multilingual AI banking assistant: Whisper + RAG + FAISS + WebSockets.', color: 'var(--purple)', link: '/projects' },
  { date: '2024', title: 'Exchange Simulator in C++', desc: 'Real-time order matching engine with price-time priority and WebSocket streaming.', color: 'var(--accent3)', link: '/projects' },
  { date: '2023', title: 'Joined COEP Quant Finance Club', desc: 'Exploring algorithmic trading, ML-driven strategies, and quantitative finance.', color: 'var(--green)', link: '/experience' },
];

const TECH_STACK = [
  { cat: 'Languages',  items: ['Python', 'C++', 'C', 'JavaScript', 'TypeScript'],                               color: 'rgba(0,212,255,0.10)' },
  { cat: 'Frontend',   items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Shadcn UI'],               color: 'rgba(0,136,255,0.10)' },
  { cat: 'Backend',    items: ['Node.js', 'Express.js', 'REST APIs', 'WebSockets'],                             color: 'rgba(157,78,255,0.10)' },
  { cat: 'AI / ML',    items: ['Machine Learning', 'NLP', 'RAG', 'FAISS', 'Whisper', 'Ollama', 'AI Agents'],   color: 'rgba(0,255,157,0.08)'  },
  { cat: 'Databases',  items: ['MongoDB', 'PostgreSQL'],                                                         color: 'rgba(255,107,53,0.10)' },
  { cat: 'Domains',    items: ['Quantitative Finance', 'Real-Time Systems', 'LLM Pipelines', 'System Design'],  color: 'rgba(255,200,0,0.08)'  },
];

const CLUBS = [
  { period: '2023 — Present', role: 'Member & Analyst', org: 'COEP Quantitative Finance Club', color: 'var(--accent)'  },
  { period: '2023 — Present', role: 'Core Member',      org: 'COEP DSAI Club',                  color: 'var(--purple)' },
  { period: '2024',           role: 'Coordinator',      org: 'Student Alumni Cell',             color: 'var(--accent3)'},
  { period: '2023 — Present', role: 'Member',           org: 'COEP Impressions',               color: 'var(--green)'  },
];

export default function AboutPage() {
  return (
    <PageShell tag="01 / About" title="The Engineer" accent="Behind the Code" breadcrumb="About"
      desc="BTech CS student at COEP Technological University building AI systems, trading engines, and full-stack products.">

      {/* ── BIO + TIMELINE ── */}
      <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
        {/* Left — bio */}
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-heading font-bold text-xl mb-4">Who I Am</h2>
          <p className="text-text2 leading-relaxed mb-4">
            I'm a Computer Science student at COEP Technological University — one of India's premier engineering
            institutions. My work spans AI/ML, real-time systems, and quantitative finance.
          </p>
          <p className="text-text2 leading-relaxed mb-4">
            From multilingual AI banking assistants with voice-to-voice pipelines to low-latency exchange matching
            engines in C++, I thrive on complex, high-impact engineering challenges.
          </p>
          <p className="text-text2 leading-relaxed mb-8">
            Beyond code, I'm deeply fascinated by quant finance — exploring how algorithmic thinking and ML
            can model financial markets with precision and elegance.
          </p>

          <div className="flex flex-col gap-3 mb-8">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div key={a.label}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl hover:border-accent/30 transition-all">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'rgba(0,212,255,0.08)' }}>{a.icon}</div>
                <div>
                  <div className="font-mono text-xs text-text3 uppercase tracking-wider">{a.label}</div>
                  <div className="font-heading font-bold text-sm gradient-text">{a.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link href="/skills"   className="btn-outline text-sm" style={{ textDecoration: 'none' }}>View All Skills →</Link>
            <Link href="/projects" className="btn-primary text-sm" style={{ textDecoration: 'none' }}>See Projects →</Link>
          </div>
        </motion.div>

        {/* Right — timeline */}
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="font-heading font-bold text-lg mb-8">Journey Timeline</h2>
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(180deg,var(--accent),rgba(0,212,255,0.1),transparent)' }} />
            {TIMELINE.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                className="relative pb-10 pl-6">
                <div className="absolute rounded-full"
                  style={{ left: -5, top: 5, width: 10, height: 10, background: t.color, boxShadow: `0 0 10px ${t.color}` }} />
                <div className="font-mono text-xs mb-1.5" style={{ color: t.color }}>{t.date}</div>
                <div className="font-heading font-semibold text-sm mb-2">{t.title}</div>
                <div className="text-text2 text-sm leading-relaxed mb-2">{t.desc}</div>
                {t.link && (
                  <Link href={t.link} className="font-mono text-xs text-accent hover:underline" style={{ textDecoration: 'none' }}>
                    Learn more →
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── TECH STACK ── */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading font-bold text-2xl mb-1">Tech <span className="gradient-text">Stack</span></h2>
            <p className="text-text2 text-sm">Technologies I work with every day</p>
          </div>
          <Link href="/skills" className="font-mono text-xs text-accent hover:underline" style={{ textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECH_STACK.map((stack, i) => (
            <motion.div key={stack.cat}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.07 }}
              whileHover={{ y: -3 }}
              className="bg-surface border border-border rounded-2xl p-5 transition-all duration-300 hover:border-accent/25">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                <span className="font-heading font-bold text-sm">{stack.cat}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {stack.items.map(item => (
                  <span key={item}
                    className="font-mono text-xs px-2 py-0.5 rounded-md border border-border2 text-text2"
                    style={{ background: stack.color }}>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── CLUBS ── */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="bg-surface border border-border rounded-2xl p-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl">Clubs & <span className="gradient-text">Involvement</span></h2>
          <Link href="/experience" className="font-mono text-xs text-accent hover:underline" style={{ textDecoration: 'none' }}>
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {CLUBS.map((e, i) => (
            <motion.div key={i} whileHover={{ x: 4 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-accent/25 transition-all"
              style={{ background: 'var(--bg3)' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: e.color, boxShadow: `0 0 6px ${e.color}` }} />
              <div>
                <div className="font-mono text-xs mb-0.5" style={{ color: e.color }}>{e.period}</div>
                <div className="font-heading font-semibold text-sm">{e.role}</div>
                <div className="font-mono text-xs text-text3">{e.org}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── LEETCODE ── */}
      <LeetCodeStats />
    </PageShell>
  );
}
