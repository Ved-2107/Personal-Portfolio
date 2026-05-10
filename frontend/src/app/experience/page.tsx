'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageShell from '@/components/ui/PageShell';
import { experienceApi } from '@/services/api';

const FALLBACK = [
  {
    _id: '1', period: '2023 — Present', role: 'Member & Analyst',
    organization: 'COEP Quantitative Finance Club',
    description: 'Exploring quantitative trading strategies, algorithmic finance, and ML applications in financial markets. Working on backtesting frameworks and data-driven investment models.',
    type: 'club', order: 1,
  },
  {
    _id: '2', period: '2023 — Present', role: 'Core Member',
    organization: 'COEP DSAI Club',
    description: 'Active member of the Data Science & AI club. Conducting workshops, exploring cutting-edge research, and collaborating on AI/ML projects with interdisciplinary teams.',
    type: 'club', order: 2,
  },
  {
    _id: '3', period: '2024', role: 'Coordinator',
    organization: 'Student Alumni Coordination Cell',
    description: 'Bridging the gap between alumni network and current students. Organising mentorship programmes, industry talks, and placement preparation initiatives.',
    type: 'club', order: 3,
  },
  {
    _id: '4', period: '2023 — Present', role: 'Member',
    organization: 'COEP Impressions (Annual Fest)',
    description: "Part of the organising committee for COEP's annual cultural and technical festival, managing technical events and coordination across multiple departments.",
    type: 'club', order: 4,
  },
];

const TYPE_COLORS: Record<string, string> = {
  club:       'rgba(0,212,255,0.1)',
  internship: 'rgba(157,78,255,0.1)',
  work:       'rgba(0,255,157,0.1)',
};
const TYPE_DOT: Record<string, string> = {
  club:       'var(--accent)',
  internship: 'var(--purple)',
  work:       'var(--green)',
};

export default function ExperiencePage() {
  const [exp, setExp] = useState(FALLBACK);

  useEffect(() => {
    experienceApi.getAll()
      .then(r => { if (r.data.data?.length) setExp(r.data.data); })
      .catch(() => {});
  }, []);

  return (
    <PageShell
      tag="04 / Experience"
      title="Clubs &"
      accent="Involvement"
      breadcrumb="Experience"
      desc="Active participation in technical clubs, leadership roles, and college organisations at COEP."
    >
      {/* Timeline view */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Vertical timeline strip */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-32">
            <h3 className="font-mono text-xs text-text3 uppercase tracking-widest mb-6">Timeline</h3>
            <div className="relative pl-5">
              <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg,var(--accent),rgba(0,212,255,0.05))' }} />
              {exp.map((e, i) => (
                <motion.div
                  key={e._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pb-8 pl-4"
                >
                  <div className="absolute rounded-full" style={{ left: -5, top: 6, width: 10, height: 10, background: TYPE_DOT[e.type] || 'var(--accent)', boxShadow: `0 0 8px ${TYPE_DOT[e.type] || 'var(--accent)'}` }} />
                  <div className="font-mono text-xs text-accent mb-0.5">{e.period}</div>
                  <div className="font-heading font-semibold text-xs text-text">{e.organization}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {exp.map((e, i) => (
            <motion.div
              key={e._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -3 }}
              className="bg-surface border border-border rounded-2xl p-7 transition-all duration-300 hover:border-accent/30 relative overflow-hidden group"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.03),transparent)' }} />

              <div className="flex items-start gap-4">
                {/* Icon blob */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-mono text-lg"
                  style={{ background: TYPE_COLORS[e.type] || TYPE_COLORS.club }}>
                  {e.type === 'club' ? '⬡' : e.type === 'internship' ? '◈' : '⊞'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                    <span className="font-mono text-xs text-accent">{e.period}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full border capitalize"
                      style={{ borderColor: TYPE_DOT[e.type], color: TYPE_DOT[e.type], background: TYPE_COLORS[e.type] }}>
                      {e.type}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-base mb-0.5">{e.role}</h3>
                  <div className="text-accent2 font-mono text-sm mb-3">{e.organization}</div>
                  <p className="text-text2 text-sm leading-relaxed">{e.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
