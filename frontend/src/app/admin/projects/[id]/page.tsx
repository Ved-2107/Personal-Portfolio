'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminComponents';
import { projectsApi } from '@/services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['AI/ML', 'Full Stack', 'Systems', 'Finance'];
const EMPTY = { title: '', subtitle: '', description: '', category: 'AI/ML', featured: false, tech: '', features: '', github: '', live: '', order: 0 };

export default function ProjectForm() {
  const { id }    = useParams<{ id: string }>();
  const router    = useRouter();
  const isNew     = id === 'new';
  const [form, setForm]     = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (isNew) return;
    projectsApi.getById(id)
      .then(r => {
        const p = r.data.data;
        setForm({ ...p, tech: p.tech.join(', '), features: p.features.join('\n') });
      })
      .catch(() => toast.error('Failed to load project'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title',       form.title);
      fd.append('subtitle',    form.subtitle);
      fd.append('description', form.description);
      fd.append('category',    form.category);
      fd.append('featured',    String(form.featured));
      fd.append('github',      form.github);
      fd.append('live',        form.live);
      fd.append('order',       String(form.order));
      fd.append('tech',     JSON.stringify(form.tech.split(',').map(s => s.trim()).filter(Boolean)));
      fd.append('features', JSON.stringify(form.features.split('\n').map(s => s.trim()).filter(Boolean)));

      if (isNew) await projectsApi.create(fd);
      else       await projectsApi.update(id, fd);

      toast.success(isNew ? 'Project created!' : 'Project updated!');
      router.push('/admin/projects');
    } catch { toast.error('Save failed'); }
    finally  { setSaving(false); }
  };

  const fieldCls = "w-full rounded-xl px-4 py-3 text-text text-sm outline-none transition-colors placeholder:text-text3 bg-bg-tertiary border border-border focus:border-accent";
  const label    = (t: string) => <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">{t}</label>;

  return (
    <AdminLayout>
      <div className="flex items-center gap-4 mb-8">
        <a href="/admin/projects" className="font-mono text-xs text-text3 hover:text-accent transition-colors">← Back</a>
        <h1 className="font-heading font-extrabold text-2xl">{isNew ? 'New Project' : 'Edit Project'}</h1>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-14 bg-surface border border-border rounded-xl" />)}
        </div>
      ) : (
        <form onSubmit={save} className="max-w-3xl flex flex-col gap-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              {label('Title *')}
              <input className={fieldCls} value={form.title} onChange={set('title')} placeholder="VocaBridge" required />
            </div>
            <div>
              {label('Subtitle *')}
              <input className={fieldCls} value={form.subtitle} onChange={set('subtitle')} placeholder="Multilingual AI Banking Assistant" required />
            </div>
          </div>

          <div>
            {label('Description *')}
            <textarea className={fieldCls} rows={4} value={form.description} onChange={set('description')} placeholder="Full project description..." required />
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              {label('Category *')}
              <select className={fieldCls} value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              {label('Order')}
              <input type="number" className={fieldCls} value={form.order} onChange={set('order')} />
            </div>
            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 accent-accent" />
                <span className="font-mono text-xs text-text2">Featured Project</span>
              </label>
            </div>
          </div>

          <div>
            {label('Tech Stack (comma-separated)')}
            <input className={fieldCls} value={form.tech} onChange={set('tech')} placeholder="Python, React, WebSockets, FAISS" />
          </div>

          <div>
            {label('Features (one per line)')}
            <textarea className={fieldCls} rows={5} value={form.features} onChange={set('features')}
              placeholder={"Real-time speech-to-text using Whisper\nRAG retrieval with FAISS\nWebSocket streaming"} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              {label('GitHub URL')}
              <input className={fieldCls} value={form.github} onChange={set('github')} placeholder="https://github.com/..." />
            </div>
            <div>
              {label('Live Demo URL')}
              <input className={fieldCls} value={form.live} onChange={set('live')} placeholder="https://..." />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50">
              {saving ? '⟳ Saving...' : isNew ? '+ Create Project' : '✓ Save Changes'}
            </button>
            <a href="/admin/projects" className="btn-outline">Cancel</a>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
