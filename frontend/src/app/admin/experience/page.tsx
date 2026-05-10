'use client';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminComponents';
import { experienceApi } from '@/services/api';
import toast from 'react-hot-toast';

interface Exp { _id: string; role: string; organization: string; period: string; description: string; type: string; order: number; }
const EMPTY: Omit<Exp,'_id'> = { role:'', organization:'', period:'', description:'', type:'club', order:0 };

export default function AdminExperience() {
  const [items, setItems]   = useState<Exp[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Exp | null | undefined>(undefined);
  const [form, setForm]     = useState<Omit<Exp,'_id'>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    experienceApi.getAll().then(r => setItems(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); };
  const openEdit = (e: Exp) => { setEditing(e); setForm({ role:e.role, organization:e.organization, period:e.period, description:e.description, type:e.type, order:e.order }); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await experienceApi.update(editing._id, form);
      else         await experienceApi.create(form);
      toast.success(editing ? 'Updated!' : 'Created!');
      load(); setEditing(undefined);
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    await experienceApi.delete(id).then(()=>{toast.success('Deleted');load();}).catch(()=>toast.error('Failed'));
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setForm(p=>({...p,[k]:e.target.value}));
  const fieldCls = "w-full rounded-xl px-4 py-2.5 text-text text-sm outline-none bg-bg-tertiary border border-border focus:border-accent transition-colors";
  const showForm = editing !== undefined;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-extrabold text-2xl">Experience</h1>
        <button onClick={openNew} className="btn-primary text-sm px-4 py-2">+ Add Entry</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          {loading ? [1,2,3].map(i=><div key={i} className="h-20 bg-surface border border-border rounded-xl animate-pulse"/>)
          : items.map(e=>(
            <div key={e._id} className="bg-surface border border-border rounded-xl p-4 hover:border-accent/30 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs text-accent mb-0.5">{e.period}</div>
                  <div className="font-heading font-bold text-sm">{e.role}</div>
                  <div className="font-mono text-xs text-accent2 mb-2">{e.organization}</div>
                  <div className="text-text3 text-xs line-clamp-2">{e.description}</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={()=>openEdit(e)} className="font-mono text-xs px-3 py-1 border border-border2 rounded-lg text-text2 hover:text-accent hover:border-accent transition-all">Edit</button>
                  <button onClick={()=>del(e._id)} className="font-mono text-xs px-3 py-1 border border-border2 rounded-lg text-text3 hover:text-accent3 hover:border-accent3/50 transition-all">Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4">
            <h2 className="font-heading font-bold text-base">{editing ? 'Edit Entry' : 'New Entry'}</h2>
            {[
              { k:'role',         label:'Role *',         ph:'Member & Analyst' },
              { k:'organization', label:'Organisation *', ph:'COEP Quantitative Finance Club' },
              { k:'period',       label:'Period *',       ph:'2023 — Present' },
            ].map(({k,label,ph})=>(
              <div key={k}>
                <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">{label}</label>
                <input className={fieldCls} value={(form as Record<string,string>)[k]} onChange={f(k)} placeholder={ph} />
              </div>
            ))}
            <div>
              <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Description</label>
              <textarea className={fieldCls} rows={3} value={form.description} onChange={f('description')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Type</label>
                <select className={fieldCls} value={form.type} onChange={f('type')}>
                  <option value="club">Club</option>
                  <option value="internship">Internship</option>
                  <option value="work">Work</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-1.5">Order</label>
                <input type="number" className={fieldCls} value={form.order} onChange={f('order')} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={save} disabled={saving} className="btn-primary text-sm disabled:opacity-50">
                {saving ? '⟳ Saving...' : '✓ Save'}
              </button>
              <button onClick={()=>setEditing(undefined)} className="btn-outline text-sm">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
