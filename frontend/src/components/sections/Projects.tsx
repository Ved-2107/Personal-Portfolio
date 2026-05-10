'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsApi, analyticsApi } from '@/services/api';
import { Project } from '@/types';

const FILTERS = ['All', 'AI/ML', 'Full Stack', 'Systems'];

const FALLBACK_PROJECTS: Project[] = [
  {
    _id: '1', title: 'VocaBridge', subtitle: 'Multilingual AI Banking Assistant',
    description: 'Production-grade real-time multilingual AI banking assistant with end-to-end voice pipeline. Users speak in any language and receive intelligent banking assistance with voice synthesis and RAG-based retrieval.',
    category: 'AI/ML', featured: true, order: 1,
    tech: ['Python', 'Whisper', 'NLP', 'RAG', 'FAISS', 'React', 'WebSockets', 'FastAPI'],
    features: ['Real-time speech-to-text using OpenAI Whisper', 'Multilingual support with auto language detection', 'RAG retrieval with FAISS vector store', 'Streaming AI responses via WebSocket', 'Voice synthesis for natural conversation', 'Custom NLP pipeline for banking domain'],
    github: '#', live: '#', createdAt: '', updatedAt: '',
  },
  {
    _id: '2', title: 'Expense Management System', subtitle: 'Enterprise Finance Tracker',
    description: 'Scalable full-stack expense management platform with role-based access control, multi-level approval workflows, and real-time reporting dashboards.',
    category: 'Full Stack', featured: false, order: 2,
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    features: ['Role-based access control', 'Multi-level approval workflows', 'Real-time expense tracking', 'Secure JWT authentication', 'RESTful APIs with validation'],
    github: '#', live: '#', createdAt: '', updatedAt: '',
  },
  {
    _id: '3', title: 'Exchange Simulator', subtitle: 'Low-Latency Matching Engine',
    description: 'High-performance exchange simulator in C++ with real-time order matching, WebSocket streaming, and price-time priority execution designed for low-latency trading systems.',
    category: 'Systems', featured: false, order: 3,
    tech: ['C++', 'WebSockets', 'STL', 'Order Book'],
    features: ['Price-time priority matching', 'Real-time order book management', 'WebSocket market data streaming', 'Market, limit, and stop orders', 'Trade history logging'],
    github: '#', live: '#', createdAt: '', updatedAt: '',
  },
  {
    _id: '4', title: 'Personality Prediction AI', subtitle: 'ML Behavioral Analysis',
    description: 'Supervised ML model predicting Big Five personality traits from behavioral data using ensemble methods, feature engineering, and cross-validation.',
    category: 'AI/ML', featured: false, order: 4,
    tech: ['Python', 'Scikit-learn', 'XGBoost', 'Pandas', 'NumPy'],
    features: ['Big Five personality prediction', 'Advanced feature engineering', 'XGBoost + Random Forest ensemble', 'Cross-validation & hyperparameter tuning', 'Personality distribution visualizations'],
    github: '#', live: '#', createdAt: '', updatedAt: '',
  },
];

const BANNER_COLORS: Record<string, string> = {
  '1': 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(157,78,255,0.1))',
  '2': 'linear-gradient(135deg, rgba(0,136,255,0.15), rgba(0,212,255,0.08))',
  '3': 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(157,78,255,0.08))',
  '4': 'linear-gradient(135deg, rgba(0,255,157,0.12), rgba(0,136,255,0.08))',
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    projectsApi.getAll().then((r) => { if (r.data.data?.length) setProjects(r.data.data); }).catch(() => {});
  }, []);

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  const openProject = (p: Project) => {
    setSelected(p);
    analyticsApi.track('project_click', { projectId: p._id, title: p.title }).catch(() => {});
  };

  return (
    <section id="projects" className="py-32" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-tag">03 / Projects</span>
          <h2 className="section-title">What I've <span className="gradient-text">Built</span></h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-accent2 mx-auto mt-3" />
        </motion.div>

        {/* Filters */}
        <div className="flex gap-3 justify-center flex-wrap mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono text-xs px-4 py-2 rounded-full border transition-all duration-200 uppercase tracking-wider ${
                filter === f
                  ? 'border-accent text-accent bg-accent/5'
                  : 'border-border2 text-text2 hover:border-accent/50 hover:text-accent/70'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filtered.map((p) => (
              <motion.div
                key={p._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                className={`card cursor-pointer overflow-hidden group ${p.featured ? 'md:col-span-2' : ''}`}
                onClick={() => openProject(p)}
              >
                {/* Banner */}
                <div
                  className={`relative overflow-hidden flex items-center justify-center ${p.featured ? 'h-52' : 'h-40'}`}
                  style={{ background: BANNER_COLORS[p._id] || BANNER_COLORS['1'] }}
                >
                  {p.featured && (
                    <span className="absolute top-4 right-4 font-mono text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-accent to-accent2 text-black">
                      ★ Featured
                    </span>
                  )}
                  <div className="font-mono text-xs text-text3 text-center px-4">
                    {p.tech.slice(0, 4).join(' · ')}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <h3 className={`font-heading font-bold mb-1 ${p.featured ? 'text-2xl' : 'text-lg'}`}>{p.title}</h3>
                  <p className="font-mono text-xs text-accent2 mb-3">{p.subtitle}</p>
                  <p className="text-text2 text-sm leading-relaxed mb-4">{p.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.tech.map((t) => (
                      <span key={t} className="font-mono text-xs px-2 py-0.5 rounded bg-accent2/10 text-accent2 border border-accent2/20">{t}</span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <a href={p.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-mono text-xs px-3 py-1.5 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">⌥ GitHub</a>
                    <a href={p.live} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-mono text-xs px-3 py-1.5 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">↗ Live</a>
                    <span className="font-mono text-xs px-3 py-1.5 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">⊕ Details</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface border border-border2 rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-bg-tertiary border border-border rounded-lg text-text2 hover:text-text transition-colors"
              >
                ✕
              </button>
              <span className="font-mono text-xs text-accent mb-2 block">{selected.category}</span>
              <h2 className="font-heading font-extrabold text-3xl mb-2">{selected.title}</h2>
              <p className="font-mono text-sm text-accent2 mb-4">{selected.subtitle}</p>
              <p className="text-text2 leading-relaxed mb-6">{selected.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {selected.tech.map((t) => <span key={t} className="font-mono text-xs px-2 py-0.5 rounded bg-accent2/10 text-accent2 border border-accent2/20">{t}</span>)}
              </div>
              <h4 className="font-mono text-xs text-text3 uppercase tracking-widest mb-3">Key Features</h4>
              <ul className="flex flex-col gap-2 mb-6">
                {selected.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0 mt-1.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <a href={selected.github} target="_blank" rel="noopener noreferrer" className="font-mono text-sm px-4 py-2 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">⌥ View on GitHub</a>
                <a href={selected.live} target="_blank" rel="noopener noreferrer" className="font-mono text-sm px-4 py-2 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">↗ Live Demo</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
