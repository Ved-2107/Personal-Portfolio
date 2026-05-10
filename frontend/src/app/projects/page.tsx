'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import PageShell from '@/components/ui/PageShell';
import { projectsApi, analyticsApi } from '@/services/api';
import { Project } from '@/types';
import { PROJECT_LINKS } from '@/config/personal';

const FILTERS = ['All', 'AI/ML', 'Full Stack', 'Systems'];

const FALLBACK: Project[] = [
  {
    _id: '1', title: 'VocaBridge', subtitle: 'Multilingual AI Banking Assistant',
    description: 'Production-grade real-time multilingual AI banking assistant with end-to-end voice pipeline. Users speak in any language and receive intelligent banking assistance with voice synthesis and RAG-based retrieval.',
    category: 'AI/ML', featured: true, order: 1,
    tech: ['Python', 'Whisper', 'NLP', 'RAG', 'FAISS', 'React', 'WebSockets', 'FastAPI'],
    features: [
      'Real-time speech-to-text using OpenAI Whisper',
      'Multilingual support with automatic language detection',
      'RAG-based document retrieval with FAISS vector store',
      'Streaming AI responses with WebSocket architecture',
      'Voice synthesis for natural conversation flow',
      'Custom NLP pipeline for banking domain',
    ],
    github: PROJECT_LINKS.find(p => p.id === 'vocabridge')?.github || '#',
    live: PROJECT_LINKS.find(p => p.id === 'vocabridge')?.live || '#',
    createdAt: '', updatedAt: '',
  },
  {
    _id: '2', title: 'Expense Management System', subtitle: 'Enterprise Finance Tracker',
    description: 'Scalable full-stack expense management platform with role-based access control, multi-level approval workflows, and real-time reporting dashboards.',
    category: 'Full Stack', featured: false, order: 2,
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    features: [
      'Role-based access control (Admin / Manager / Employee)',
      'Multi-level expense approval workflows',
      'Real-time expense tracking & categorisation',
      'Secure JWT authentication with refresh tokens',
      'RESTful APIs with full input validation',
    ],
    github: PROJECT_LINKS.find(p => p.id === 'expense-management')?.github || '#',
    live: PROJECT_LINKS.find(p => p.id === 'expense-management')?.live || '#',
    createdAt: '', updatedAt: '',
  },
  {
    _id: '3', title: 'Exchange Simulator', subtitle: 'Low-Latency Matching Engine',
    description: 'High-performance exchange simulator built in C++ with a real-time matching engine, WebSocket order streaming, and price-time priority execution designed for sub-millisecond latency.',
    category: 'Systems', featured: false, order: 3,
    tech: ['C++', 'WebSockets', 'STL', 'Order Book'],
    features: [
      'Price-time priority order matching algorithm',
      'Real-time order book management',
      'WebSocket-based market data streaming',
      'Support for market, limit, and stop orders',
      'Trade execution & history logging',
    ],
    github: PROJECT_LINKS.find(p => p.id === 'exchange-simulator')?.github || '#',
    live: PROJECT_LINKS.find(p => p.id === 'exchange-simulator')?.live || '#',
    createdAt: '', updatedAt: '',
  },
  {
    _id: '4', title: 'Personality Prediction AI', subtitle: 'ML Behavioural Analysis',
    description: 'Supervised ML model predicting Big Five personality traits from behavioural and survey data using feature engineering and ensemble methods.',
    category: 'AI/ML', featured: false, order: 4,
    tech: ['Python', 'Scikit-learn', 'XGBoost', 'Pandas', 'NumPy'],
    features: [
      'Big Five personality trait prediction',
      'Advanced feature engineering pipeline',
      'XGBoost + Random Forest ensemble',
      'Cross-validation & hyperparameter tuning',
      'Personality distribution visualisations',
    ],
    github: PROJECT_LINKS.find(p => p.id === 'personality-prediction')?.github || '#',
    live: PROJECT_LINKS.find(p => p.id === 'personality-prediction')?.live || '#',
    createdAt: '', updatedAt: '',
  },
];

const BANNERS: Record<string, string> = {
  '1': 'linear-gradient(135deg,rgba(0,212,255,0.15),rgba(157,78,255,0.10))',
  '2': 'linear-gradient(135deg,rgba(0,136,255,0.15),rgba(0,212,255,0.08))',
  '3': 'linear-gradient(135deg,rgba(255,107,53,0.15),rgba(157,78,255,0.08))',
  '4': 'linear-gradient(135deg,rgba(0,255,157,0.12),rgba(0,136,255,0.08))',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK);
  const [filter, setFilter]     = useState('All');
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    projectsApi.getAll()
      .then(r => { if (r.data.data?.length) setProjects(r.data.data); })
      .catch(() => {});
  }, []);

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  const open = (p: Project) => {
    setSelected(p);
    analyticsApi.track('project_click', { projectId: p._id, title: p.title }).catch(() => {});
  };

  return (
    <PageShell
      tag="03 / Projects"
      title="What I've"
      accent="Built"
      breadcrumb="Projects"
      desc="A collection of AI systems, full-stack platforms, and low-latency engines."
    >
      {/* Filter pills */}
      <div className="flex gap-3 flex-wrap mb-10">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-xs px-4 py-2 rounded-full border transition-all duration-200 uppercase tracking-wider ${
              filter === f
                ? 'border-accent text-accent bg-accent/8'
                : 'border-border2 text-text2 hover:border-accent/50 hover:text-accent/80'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="font-mono text-xs text-text3 self-center ml-2">
          {filtered.length} project{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      <motion.div layout className="grid md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map(p => (
            <motion.div
              key={p._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              whileHover={{ y: -5 }}
              className={`bg-surface border border-border rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:border-accent/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${
                p.featured ? 'md:col-span-2' : ''
              }`}
              onClick={() => open(p)}
            >
              {/* Banner */}
              <div
                className={`relative flex items-center justify-center overflow-hidden ${p.featured ? 'h-52' : 'h-40'}`}
                style={{ background: BANNERS[p._id] || BANNERS['1'] }}
              >
                {p.featured && (
                  <span className="absolute top-4 right-4 font-mono text-xs font-bold px-3 py-1 rounded-full text-black"
                    style={{ background: 'linear-gradient(135deg,#00d4ff,#0088ff)' }}>
                    ★ Featured
                  </span>
                )}
                <span className="font-mono text-xs text-text3 px-4 text-center">
                  {p.tech.slice(0, 4).join(' · ')}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className={`font-heading font-bold mb-1 ${p.featured ? 'text-2xl' : 'text-lg'}`}>{p.title}</h3>
                <p className="font-mono text-xs text-accent2 mb-3">{p.subtitle}</p>
                <p className="text-text2 text-sm leading-relaxed mb-4 line-clamp-3">{p.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.tech.map(t => (
                    <span key={t} className="font-mono text-xs px-2 py-0.5 rounded border border-accent2/20 text-accent2"
                      style={{ background: 'rgba(0,136,255,0.08)' }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a href={p.github} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="font-mono text-xs px-3 py-1.5 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">
                    ⌥ GitHub
                  </a>
                  <a href={p.live} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="font-mono text-xs px-3 py-1.5 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">
                    ↗ Live
                  </a>
                  <span className="font-mono text-xs px-3 py-1.5 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">
                    ⊕ Details
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(12px)' }}
            onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="bg-surface border border-border2 rounded-2xl p-8 max-w-2xl w-full max-h-[88vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-bg-tertiary border border-border rounded-lg text-text2 hover:text-text transition-colors text-sm"
              >
                ✕
              </button>

              <span className="font-mono text-xs text-accent mb-2 block">{selected.category}</span>
              <h2 className="font-heading font-extrabold text-3xl mb-2">{selected.title}</h2>
              <p className="font-mono text-sm text-accent2 mb-5">{selected.subtitle}</p>
              <p className="text-text2 leading-relaxed mb-6">{selected.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {selected.tech.map(t => (
                  <span key={t} className="font-mono text-xs px-2 py-0.5 rounded border border-accent2/20 text-accent2"
                    style={{ background: 'rgba(0,136,255,0.08)' }}>
                    {t}
                  </span>
                ))}
              </div>

              <h4 className="font-mono text-xs text-text3 uppercase tracking-widest mb-3">Key Features</h4>
              <ul className="flex flex-col gap-2.5 mb-7">
                {selected.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-text2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: 'var(--green)' }} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                <a href={selected.github} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-sm px-4 py-2 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">
                  ⌥ View on GitHub
                </a>
                <a href={selected.live} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-sm px-4 py-2 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">
                  ↗ Live Demo
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
