'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SOCIAL_LINKS } from '@/config/personal';

interface LCStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  acceptanceRate: number;
}

const LEETCODE_USERNAME = SOCIAL_LINKS.leetcode.username;

export default function LeetCodeStats() {
  const [stats, setStats]   = useState<LCStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LeetCode public GraphQL API
    fetch('https://leetcode-stats-api.herokuapp.com/' + LEETCODE_USERNAME)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success') {
          setStats({
            totalSolved:    d.totalSolved,
            easySolved:     d.easySolved,
            mediumSolved:   d.mediumSolved,
            hardSolved:     d.hardSolved,
            ranking:        d.ranking,
            acceptanceRate: d.acceptanceRate,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !stats) return null;

  const DIFFICULTY = [
    { label: 'Easy',   key: 'easySolved',   color: 'var(--green)',   total: 800  },
    { label: 'Medium', key: 'mediumSolved',  color: '#fbbf24',        total: 1700 },
    { label: 'Hard',   key: 'hardSolved',    color: 'var(--accent3)', total: 700  },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-surface border border-border rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="font-heading font-bold text-xl mb-1">LeetCode Stats</h2>
              <a
                href={`https://leetcode.com/${LEETCODE_USERNAME}`}
                target="_blank" rel="noopener noreferrer"
                className="font-mono text-xs text-accent hover:underline"
                style={{ textDecoration: 'none' }}
              >
                leetcode.com/{LEETCODE_USERNAME} ↗
              </a>
            </div>
            {stats && (
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="font-heading font-extrabold text-2xl gradient-text">{stats.totalSolved}</div>
                  <div className="font-mono text-xs text-text3">Solved</div>
                </div>
                <div className="text-center">
                  <div className="font-heading font-extrabold text-2xl gradient-text">
                    #{stats.ranking.toLocaleString()}
                  </div>
                  <div className="font-mono text-xs text-text3">Ranking</div>
                </div>
                <div className="text-center">
                  <div className="font-heading font-extrabold text-2xl gradient-text">
                    {stats.acceptanceRate}%
                  </div>
                  <div className="font-mono text-xs text-text3">Acceptance</div>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-10 rounded-xl" style={{ background: 'var(--border)' }} />)}
            </div>
          ) : stats ? (
            <div className="flex flex-col gap-4">
              {DIFFICULTY.map(d => {
                const solved = stats[d.key as keyof LCStats] as number;
                const pct = Math.min((solved / d.total) * 100, 100);
                return (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold" style={{ color: d.color }}>{d.label}</span>
                      <span className="font-mono text-xs text-text2">{solved} / {d.total}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: d.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
