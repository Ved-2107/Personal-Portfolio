'use client';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminComponents';
import { blogApi } from '@/services/api';
import { BlogPost } from '@/types';
import toast from 'react-hot-toast';

export default function AdminBlog() {
  const [posts, setPosts]   = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView]     = useState<'list'|'edit'>('list');
  const [editing, setEditing] = useState<BlogPost|null>(null);
  const [form, setForm]     = useState({ title:'', excerpt:'', content:'', category:'', tags:'', published:false, coverImage:'' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    blogApi.getAll({ limit:50 }).then(r=>setPosts(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(load,[]);

  const openNew = () => { setEditing(null); setForm({ title:'',excerpt:'',content:'',category:'AI/ML',tags:'',published:false,coverImage:'' }); setView('edit'); };
  const openEdit = (p: BlogPost) => {
    setEditing(p); setForm({ title:p.title, excerpt:p.excerpt, content:p.content, category:p.category, tags:p.tags.join(', '), published:p.published, coverImage:p.coverImage||'' });
    setView('edit');
  };

  const save = async () => {
    if (!form.title||!form.content) { toast.error('Title and content required'); return; }
    setSaving(true);
    const data = { ...form, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) };
    try {
      if (editing) await blogApi.update(editing._id, data);
      else         await blogApi.create(data);
      toast.success(editing?'Post updated!':'Post created!');
      load(); setView('list');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const del = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await blogApi.delete(id).then(()=>{toast.success('Deleted');load();}).catch(()=>toast.error('Failed'));
  };

  const toggle = async (p: BlogPost) => {
    await blogApi.update(p._id, { published: !p.published })
      .then(()=>{toast.success(p.published?'Unpublished':'Published');load();})
      .catch(()=>toast.error('Failed'));
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setForm(p=>({...p,[k]:e.target.value}));
  const fc = "w-full rounded-xl px-4 py-2.5 text-text text-sm outline-none bg-bg-tertiary border border-border focus:border-accent transition-colors";

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {view==='edit' && <button onClick={()=>setView('list')} className="font-mono text-xs text-text3 hover:text-accent transition-colors">← Back</button>}
          <h1 className="font-heading font-extrabold text-2xl">{view==='list'?'Blog Posts': editing?'Edit Post':'New Post'}</h1>
        </div>
        {view==='list' && <button onClick={openNew} className="btn-primary text-sm px-4 py-2">+ New Post</button>}
      </div>

      {view==='list' ? (
        loading ? (
          <div className="flex flex-col gap-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-surface border border-border rounded-xl animate-pulse"/>)}</div>
        ) : posts.length===0 ? (
          <div className="text-center py-20 bg-surface border border-border rounded-2xl">
            <div className="text-4xl mb-3">✎</div>
            <p className="font-heading font-bold mb-1">No posts yet</p>
            <p className="text-text3 text-sm mb-4">Create your first blog post</p>
            <button onClick={openNew} className="btn-primary text-sm">+ New Post</button>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Title','Category','Status','Views','Actions'].map(h=>(
                    <th key={h} className="text-left font-mono text-xs text-text3 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(p=>(
                  <tr key={p._id} className="border-b border-border last:border-0 hover:bg-bg-tertiary transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-sm">{p.title}</div>
                      <div className="font-mono text-xs text-text3">{p.readTime} min · {new Date(p.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-5 py-4"><span className="font-mono text-xs text-accent2">{p.category}</span></td>
                    <td className="px-5 py-4">
                      <button onClick={()=>toggle(p)} className={`font-mono text-xs px-2.5 py-0.5 rounded-full border transition-all ${p.published?'text-brand-green border-brand-green/30 bg-brand-green/10':'text-text3 border-border2'}`}>
                        {p.published?'● Live':'○ Draft'}
                      </button>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-text3">{p.views}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={()=>openEdit(p)} className="font-mono text-xs px-3 py-1 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">Edit</button>
                        <button onClick={()=>del(p._id,p.title)} className="font-mono text-xs px-3 py-1 border border-border2 rounded-lg text-text3 hover:text-accent3 hover:border-accent3/50 transition-all">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="max-w-4xl flex flex-col gap-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Title *</label>
              <input className={fc} value={form.title} onChange={f('title')} placeholder="Building RAG Systems with FAISS" />
            </div>
            <div>
              <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Category</label>
              <select className={fc} value={form.category} onChange={f('category')}>
                {['AI/ML','Systems','Full Stack','Quant Finance','General'].map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Excerpt / Summary</label>
            <textarea className={fc} rows={2} value={form.excerpt} onChange={f('excerpt')} placeholder="A short summary shown on the blog listing page..." />
          </div>

          <div>
            <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Tags (comma-separated)</label>
            <input className={fc} value={form.tags} onChange={f('tags')} placeholder="rag, faiss, langchain, python" />
          </div>

          <div>
            <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Cover Image URL</label>
            <input className={fc} value={form.coverImage} onChange={f('coverImage')} placeholder="https://..." />
          </div>

          {/* Rich-text content area — supports HTML */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-mono text-xs text-text3 uppercase tracking-widest">Content * (HTML supported)</label>
              <span className="font-mono text-xs text-text3">{form.content.split(' ').filter(Boolean).length} words</span>
            </div>

            {/* Toolbar */}
            <div className="flex gap-1.5 flex-wrap p-2 bg-bg-tertiary border border-border border-b-0 rounded-t-xl">
              {[
                ['B', '<strong>selected</strong>'],
                ['I', '<em>selected</em>'],
                ['H2','<h2>Heading</h2>'],
                ['H3','<h3>Subheading</h3>'],
                ['`', '<code>code</code>'],
                ['</>','<pre><code>block</code></pre>'],
                ['""','<blockquote>quote</blockquote>'],
                ['—', '<hr/>'],
              ].map(([lbl, snippet]) => (
                <button key={lbl} type="button"
                  onClick={() => setForm(p=>({ ...p, content: p.content + '\n' + snippet + '\n' }))}
                  className="font-mono text-xs px-2.5 py-1 bg-surface border border-border rounded text-text2 hover:text-accent hover:border-accent transition-all">
                  {lbl}
                </button>
              ))}
            </div>
            <textarea
              className="w-full rounded-b-xl px-4 py-3 text-text text-sm outline-none bg-bg-tertiary border border-border focus:border-accent transition-colors font-mono leading-relaxed resize-none"
              rows={18}
              value={form.content}
              onChange={f('content')}
              placeholder={'<p>Start writing your post here...</p>\n\n<h2>Section Title</h2>\n<p>Content goes here...</p>'}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={e=>setForm(p=>({...p,published:e.target.checked}))}
                className="w-4 h-4 accent-accent" />
              <span className="font-mono text-xs text-text2">Publish immediately</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              {saving?'⟳ Saving...': editing?'✓ Update Post':'+ Publish Post'}
            </button>
            <button onClick={()=>setView('list')} className="btn-outline">Cancel</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
