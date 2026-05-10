'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { githubApi } from '@/services/api';
import { SOCIAL_LINKS } from '@/config/personal';

interface GitHubStats {
  followers: number;
  publicRepos: number;
  totalStars: number;
  topLanguages: [string, number][];
}

export default function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [repos, setRepos] = useState<{ id: number; name: string; description: string; url: string; language: string; stars: number }[]>([]);

  useEffect(() => {
    githubApi.getStats().then((r) => setStats(r.data.data)).catch(() => {});
    githubApi.getRepos().then((r) => setRepos(r.data.data?.slice(0, 6) || [])).catch(() => {});
  }, []);

  if (!stats && repos.length === 0) return null;

  const statCards = stats ? [
    { label: 'Public Repos', value: stats.publicRepos },
    { label: 'Followers', value: stats.followers },
    { label: 'Total Stars', value: stats.totalStars },
    { label: 'Languages', value: stats.topLanguages?.length || 0 },
  ] : [];

  return (
    <section className="py-32" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 50%, var(--bg) 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="section-tag">08 / GitHub</span>
          <h2 className="section-title">Open <span className="gradient-text">Source</span></h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-accent2 mx-auto mt-3 mb-4" />
          <a href={SOCIAL_LINKS.github.url} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-accent hover:underline">
            github.com/{SOCIAL_LINKS.github.username} ↗
          </a>
        </motion.div>

        {/* Stats */}
        {statCards.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {statCards.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-surface border border-border rounded-2xl p-5 text-center">
                <div className="font-heading font-extrabold text-2xl gradient-text mb-1">{s.value}</div>
                <div className="font-mono text-xs text-text3 uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Top Languages */}
        {stats?.topLanguages && stats.topLanguages.length > 0 && (
          <div className="mb-10 bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-heading font-bold text-sm text-text3 uppercase tracking-wider mb-4">Top Languages</h3>
            <div className="flex flex-wrap gap-3">
              {stats.topLanguages.map(([lang, count]) => (
                <div key={lang} className="flex items-center gap-2 font-mono text-sm text-text2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  {lang} <span className="text-text3">({count})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Repos */}
        {repos.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo, i) => (
              <motion.a key={repo.id} href={repo.url} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                whileHover={{ y: -3 }}
                className="bg-surface border border-border rounded-xl p-5 hover:border-accent/30 transition-all duration-300 no-underline text-text block">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-heading font-bold text-sm">{repo.name}</span>
                  <span className="font-mono text-xs text-text3">⭐ {repo.stars}</span>
                </div>
                <p className="text-text2 text-xs leading-relaxed line-clamp-2 mb-3">{repo.description || 'No description'}</p>
                {repo.language && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-accent2/10 text-accent2 border border-accent2/20">{repo.language}</span>
                )}
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
