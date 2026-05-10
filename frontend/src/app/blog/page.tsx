'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PageShell from '@/components/ui/PageShell';
import { blogApi } from '@/services/api';
import { BlogPost } from '@/types';

export default function BlogPage() {
  const [posts, setPosts]     = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [tag, setTag]         = useState('');

  useEffect(() => {
    setLoading(true);
    blogApi.getAll({ page: 1, limit: 20, tag: tag || undefined, search: search || undefined })
      .then(r => setPosts(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tag, search]);

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));

  return (
    <PageShell
      tag="07 / Blog"
      title="Thoughts &"
      accent="Writing"
      breadcrumb="Blog"
      desc="Articles on AI/ML, systems engineering, quantitative finance, and software craftsmanship."
    >
      {/* Search + tag filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <input
          type="text" placeholder="Search articles..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 rounded-xl px-4 py-3 text-sm text-text outline-none placeholder:text-text3 transition-colors"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          onFocus={e => (e.target.style.borderColor = '#00d4ff')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setTag('')}
            className={`font-mono text-xs px-3 py-2 rounded-full border transition-all ${!tag ? 'border-accent text-accent bg-accent/8' : 'border-border2 text-text2 hover:border-accent/50'}`}>
            All
          </button>
          {allTags.slice(0, 6).map(t => (
            <button key={t} onClick={() => setTag(t === tag ? '' : t)}
              className={`font-mono text-xs px-3 py-2 rounded-full border transition-all ${tag === t ? 'border-accent text-accent bg-accent/8' : 'border-border2 text-text2 hover:border-accent/50'}`}>
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-6 animate-pulse">
              <div className="h-3 bg-border rounded mb-4 w-1/3" />
              <div className="h-5 bg-border rounded mb-2" />
              <div className="h-4 bg-border rounded mb-1 w-4/5" />
              <div className="h-4 bg-border rounded w-3/5" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-24 bg-surface border border-border rounded-2xl">
          <div className="text-4xl mb-4">✎</div>
          <h3 className="font-heading font-bold text-lg mb-2">No posts yet</h3>
          <p className="text-text2 text-sm">Articles will appear here once published.</p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="bg-surface border border-border rounded-2xl p-6 transition-all duration-300 hover:border-accent/30 group flex flex-col"
            >
              {post.coverImage && (
                <div className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-bg-tertiary">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs px-2 py-0.5 rounded border border-accent/20 text-accent"
                  style={{ background: 'rgba(0,212,255,0.06)' }}>
                  {post.category}
                </span>
                <span className="font-mono text-xs text-text3">{post.readTime} min read</span>
                <span className="font-mono text-xs text-text3 ml-auto">👁 {post.views}</span>
              </div>

              <h3 className="font-heading font-bold text-base mb-2 group-hover:text-accent transition-colors line-clamp-2 flex-1">
                {post.title}
              </h3>
              <p className="text-text2 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.slice(0, 3).map(t => (
                    <span key={t} className="font-mono text-xs text-text3">#{t}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                <span className="font-mono text-xs text-text3">
                  {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <Link href={`/blog/${post.slug}`}
                  className="font-mono text-xs text-accent hover:underline"
                  style={{ textDecoration: 'none' }}>
                  Read →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
