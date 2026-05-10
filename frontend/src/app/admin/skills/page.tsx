'use client';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminComponents';
import { skillsApi } from '@/services/api';
import toast from 'react-hot-toast';

interface Skill { _id: string; category: string; icon: string; color: string; items: string[]; order: number; }
const EMPTY: Omit<Skill, '_id'> = { category: '', icon: '◈', color: 'rgba(0,212,255,0.1)', items: [], order: 0 };

export default function AdminSkills() {
  const [skills, setSkills]   = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm]       = useState<Omit<Skill,'_id'> & { itemsRaw: string }>(
    { ...EMPTY, itemsRaw: '' }
  );
  const [saving, setSaving]   = useState(false);

  const load = () => {
    skillsApi.getAll().then(r => setSkills(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setEditing(null); setForm({ ...EMPTY, itemsRaw: '' }); };
  const openEdit = (s: Skill) => {
    setEditing(s);
    setForm({ category: s.category, icon: s.icon, color: s.color, order: s.order, items: s.items, itemsRaw: s.items.join(', ') });
  };
  const closeForm = () => setEditing(undefined as unknown as Skill);

  const save = async () => {
    setSaving(true);
    const data = { ...form, items: form.itemsRaw.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editing) await skillsApi.update(editing._id, data);
      else         await skillsApi.create(data);
      toast.success(editing ? 'Skill updated!' : 'Skill created!');
      load(); setEditing(undefined as unknown as Skill);
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const del = async (id: string, cat: string) => {
    if (!confirm(`Delete "${cat}"?`)) return;
    await skillsApi.delete(id).then(() => { toast.success('Deleted'); load(); }).catch(() => toast.error('Failed'));
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  const fieldCls = "w-full rounded-xl px-4 py-2.5 text-text text-sm outline-none bg-bg-tertiary border border-border focus:border-accent transition-colors";

  const showForm = editing !== undefined;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-extrabold text-2xl">Skills</h1>
        <button onClick={openNew} className="btn-primary text-sm px-4 py-2">+ Add Category</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="flex flex-col gap-3">
          {loading ? [1,2,3].map(i => <div key={i} className="h-20 bg-surface border border-border rounded-xl animate-pulse" />) :
            skills.map(s => (
              <div key={s._id} className="bg-surface border border-border rounded-xl p-4 flex items-start gap-4 hover:border-accent/30 transition-all">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base flex-shrink-0 font-mono" style={{ background: s.color }}>{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold text-sm mb-1">{s.category}</div>
                  <div className="flex flex-wrap gap-1">
                    {s.items.slice(0,5).map(i => <span key={i} className="font-mono text-xs text-text3">{i}</span>)}
                    {s.items.length > 5 && <span className="font-mono text-xs text-text3">+{s.items.length-5}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(s)} className="font-mono text-xs px-3 py-1 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">Edit</button>
                  <button onClick={() => del(s._id, s.category)} className="font-mono text-xs px-3 py-1 border border-border2 rounded-lg text-text3 hover:text-accent3 hover:border-accent3/50 transition-all">Del</button>
                </div>
              </div>
            ))
          }
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4">
            <h2 className="font-heading font-bold text-base">{editing ? 'Edit Skill Category' : 'New Skill Category'}</h2>
            <div>
              <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Category Name</label>
              <input className={fieldCls} value={form.category} onChange={f('category')} placeholder="AI / ML" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Icon</label>
                <input className={fieldCls} value={form.icon} onChange={f('icon')} placeholder="◈" />
              </div>
              <div>
                <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Order</label>
                <input type="number" className={fieldCls} value={form.order} onChange={f('order')} />
              </div>
            </div>
            <div>
              <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Color (CSS rgba)</label>
              <input className={fieldCls} value={form.color} onChange={f('color')} placeholder="rgba(0,212,255,0.1)" />
            </div>
            <div>
              <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Items (comma-separated)</label>
              <input className={fieldCls} value={form.itemsRaw} onChange={f('itemsRaw')} placeholder="Machine Learning, NLP, RAG, FAISS" />
            </div>
            <div className="flex gap-3">
              <button onClick={save} disabled={saving} className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50">
                {saving ? '⟳ Saving...' : '✓ Save'}
              </button>
              <button onClick={closeForm} className="btn-outline text-sm">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
