'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageShell from '@/components/ui/PageShell';
import { skillsApi } from '@/services/api';

const FALLBACK_SKILLS = [
  { _id: '1', category: 'Languages',  icon: '{ }', color: 'rgba(0,212,255,0.1)',  items: ['C', 'C++', 'Python', 'JavaScript', 'TypeScript'],                             order: 1 },
  { _id: '2', category: 'Frontend',   icon: '⬡',   color: 'rgba(0,136,255,0.1)',  items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Shadcn UI'],             order: 2 },
  { _id: '3', category: 'Backend',    icon: '⚙',   color: 'rgba(157,78,255,0.1)', items: ['Node.js', 'Express.js', 'REST APIs', 'WebSockets'],                           order: 3 },
  { _id: '4', category: 'AI / ML',    icon: '◈',   color: 'rgba(0,255,157,0.1)',  items: ['Machine Learning', 'NLP', 'RAG', 'FAISS', 'Whisper', 'Ollama', 'AI Agents'], order: 4 },
  { _id: '5', category: 'Databases',  icon: '⊞',   color: 'rgba(255,107,53,0.1)', items: ['MongoDB', 'PostgreSQL'],                                                      order: 5 },
  { _id: '6', category: 'Domains',    icon: '◎',   color: 'rgba(255,200,0,0.1)',  items: ['Quantitative Finance', 'Real-Time Systems', 'LLM Pipelines', 'System Design'],order: 6 },
];

export default function SkillsPage() {
  const [skills, setSkills]   = useState(FALLBACK_SKILLS);
  const [active, setActive]   = useState<string | null>(null);

  useEffect(() => {
    skillsApi.getAll()
      .then(r => { if (r.data.data?.length) setSkills(r.data.data); })
      .catch(() => {});
  }, []);

  return (
    <PageShell
      tag="02 / Skills"
      title="Tech"
      accent="Arsenal"
      breadcrumb="Skills"
      desc="A curated toolkit spanning AI/ML, systems programming, and modern full-stack development."
    >
      {/* Category cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {skills.map((s, i) => (
          <motion.div
            key={s._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, boxShadow: '0 0 30px rgba(0,212,255,0.07)' }}
            onClick={() => setActive(active === s._id ? null : s._id)}
            className="bg-surface border border-border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-accent/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-mono flex-shrink-0"
                style={{ background: s.color }}>
                {s.icon}
              </div>
              <span className="font-heading font-bold text-sm">{s.category}</span>
              <span className="ml-auto font-mono text-xs text-text3">{s.items.length}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {s.items.map(item => (
                <motion.span
                  key={item}
                  whileHover={{ scale: 1.06 }}
                  className="font-mono text-xs px-2.5 py-1 rounded-md border border-border2 text-text2 hover:border-accent hover:text-accent transition-all cursor-default"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* All-skills flat list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-surface border border-border rounded-2xl p-8"
      >
        <h2 className="font-heading font-bold text-base mb-6 text-text3 uppercase tracking-wider text-xs font-mono">
          All Technologies
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.flatMap(s => s.items).map((item, i) => (
            <motion.span
              key={`${item}-${i}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + i * 0.025 }}
              whileHover={{ scale: 1.08, color: '#00d4ff', borderColor: '#00d4ff' }}
              className="font-mono text-xs px-3 py-1.5 rounded-lg border border-border2 text-text2 transition-all cursor-default"
            >
              {item}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </PageShell>
  );
}
