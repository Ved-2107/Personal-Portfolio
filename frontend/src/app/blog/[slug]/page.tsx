'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/sections/Navbar';
import { blogApi } from '@/services/api';
import { BlogPost } from '@/types';

export default function BlogPostPage() {
  const { slug }          = useParams<{ slug: string }>();
  const [post, setPost]   = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    blogApi.getBySlug(slug)
      .then(r => setPost(r.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <div className="relative z-10 pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-xs text-text3 mb-8">
            <Link href="/"    className="hover:text-accent transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-accent transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>Blog</Link>
            <span>/</span>
            <span className="text-accent truncate">{post?.title || slug}</span>
          </div>

          {loading ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-4 bg-surface rounded w-24" />
              <div className="h-10 bg-surface rounded" />
              <div className="h-4 bg-surface rounded w-1/2" />
              <div className="h-64 bg-surface rounded mt-4" />
            </div>
          ) : notFound ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">✎</div>
              <h2 className="font-heading font-bold text-2xl mb-3">Post not found</h2>
              <p className="text-text2 mb-6">This article doesn't exist or hasn't been published yet.</p>
              <Link href="/blog" className="btn-primary" style={{ textDecoration: 'none' }}>← Back to Blog</Link>
            </div>
          ) : post ? (
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Meta */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="font-mono text-xs px-2 py-0.5 rounded border border-accent/20 text-accent"
                  style={{ background: 'rgba(0,212,255,0.06)' }}>
                  {post.category}
                </span>
                <span className="font-mono text-xs text-text3">{post.readTime} min read</span>
                <span className="font-mono text-xs text-text3">
                  {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="font-mono text-xs text-text3">👁 {post.views} views</span>
              </div>

              {/* Title */}
              <h1 className="font-heading font-extrabold leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-text2 text-lg leading-relaxed mb-8 border-l-2 border-accent pl-4">
                {post.excerpt}
              </p>

              {/* Cover image */}
              {post.coverImage && (
                <div className="w-full h-72 rounded-2xl overflow-hidden mb-10 bg-surface">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map(t => (
                    <Link key={t} href={`/blog?tag=${t}`}
                      className="font-mono text-xs px-2 py-1 rounded border border-border2 text-text2 hover:text-accent hover:border-accent transition-all"
                      style={{ textDecoration: 'none' }}>
                      #{t}
                    </Link>
                  ))}
                </div>
              )}

              {/* Content */}
              <div
                className="prose-ved"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Footer */}
              <div className="mt-16 pt-8 border-t border-border flex items-center justify-between flex-wrap gap-4">
                <Link href="/blog" className="btn-outline text-sm" style={{ textDecoration: 'none' }}>← All Posts</Link>
                <Link href="/contact" className="btn-primary text-sm" style={{ textDecoration: 'none' }}>Let's Connect ↗</Link>
              </div>
            </motion.article>
          ) : null}
        </div>
      </div>

      <style>{`
        .prose-ved { color: var(--text2); line-height: 1.9; font-size: 1rem; }
        .prose-ved h1,.prose-ved h2,.prose-ved h3,.prose-ved h4 { font-family:'Syne',sans-serif; font-weight:700; color:var(--text); margin:2rem 0 1rem; line-height:1.2; }
        .prose-ved h2 { font-size:1.5rem; }
        .prose-ved h3 { font-size:1.2rem; }
        .prose-ved p  { margin-bottom:1.2rem; }
        .prose-ved a  { color:var(--accent); text-decoration:underline; }
        .prose-ved code { font-family:'JetBrains Mono',monospace; font-size:0.82rem; background:var(--surface); padding:0.15rem 0.4rem; border-radius:4px; border:1px solid var(--border); color:var(--accent); }
        .prose-ved pre { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:1.5rem; overflow-x:auto; margin:1.5rem 0; }
        .prose-ved pre code { background:none; border:none; padding:0; color:var(--text); }
        .prose-ved blockquote { border-left:2px solid var(--accent); padding-left:1.2rem; margin:1.5rem 0; color:var(--text3); font-style:italic; }
        .prose-ved ul,.prose-ved ol { padding-left:1.5rem; margin-bottom:1.2rem; }
        .prose-ved li { margin-bottom:0.4rem; }
        .prose-ved img { border-radius:12px; max-width:100%; margin:1.5rem auto; display:block; }
        .prose-ved hr { border:none; border-top:1px solid var(--border); margin:2rem 0; }
      `}</style>
    </main>
  );
}
