'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { blogApi } from '@/services/api';
import { BlogPost } from '@/types';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogApi.getAll({ limit: 3 })
      .then((r) => setPosts(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section id="blog" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="section-tag">07 / Blog</span>
          <h2 className="section-title">Latest <span className="gradient-text">Writing</span></h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-accent2 mx-auto mt-3" />
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-border rounded mb-3 w-1/3" />
                <div className="h-6 bg-border rounded mb-2" />
                <div className="h-4 bg-border rounded mb-1 w-4/5" />
                <div className="h-4 bg-border rounded w-3/5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-surface border border-border rounded-2xl p-6 transition-all duration-300 hover:border-accent/30 group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">{post.category}</span>
                  <span className="font-mono text-xs text-text3">{post.readTime} min read</span>
                </div>
                <h3 className="font-heading font-bold text-base mb-2 group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-text2 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text3">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                  <Link href={`/blog/${post.slug}`} className="font-mono text-xs text-accent hover:underline">
                    Read →
                  </Link>
                </div>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="font-mono text-xs text-text3">#{tag}</span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <div className="text-center mt-10">
            <Link href="/blog" className="btn-outline inline-block">View All Posts →</Link>
          </div>
        )}
      </div>
    </section>
  );
}
