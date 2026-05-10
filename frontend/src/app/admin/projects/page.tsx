'use client';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminComponents';
import { projectsApi } from '@/services/api';
import { Project } from '@/types';
import toast from 'react-hot-toast';

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    projectsApi.getAll()
      .then((r) => setProjects(r.data.data || []))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      await projectsApi.delete(id);
      toast.success('Project deleted');
      load();
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-extrabold text-2xl">Projects</h1>
        <a href="/admin/projects/new" className="btn-primary text-sm px-4 py-2">+ New Project</a>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-surface border border-border rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-mono text-xs text-text3 uppercase tracking-wider px-5 py-3">Title</th>
                <th className="text-left font-mono text-xs text-text3 uppercase tracking-wider px-5 py-3">Category</th>
                <th className="text-left font-mono text-xs text-text3 uppercase tracking-wider px-5 py-3">Featured</th>
                <th className="text-left font-mono text-xs text-text3 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="border-b border-border last:border-0 hover:bg-bg-tertiary transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-sm">{p.title}</div>
                    <div className="font-mono text-xs text-text3">{p.subtitle}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-accent2/10 text-accent2 border border-accent2/20">{p.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-mono text-xs ${p.featured ? 'text-brand-green' : 'text-text3'}`}>{p.featured ? '★ Featured' : '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <a href={`/admin/projects/${p._id}`} className="font-mono text-xs px-3 py-1 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">Edit</a>
                      <button
                        onClick={() => handleDelete(p._id, p.title)}
                        disabled={deleting === p._id}
                        className="font-mono text-xs px-3 py-1 border border-border2 rounded-lg text-text3 hover:text-accent3 hover:border-accent3/50 transition-all disabled:opacity-40"
                      >
                        {deleting === p._id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
