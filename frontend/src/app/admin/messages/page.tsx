'use client';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminComponents';
import { contactApi } from '@/services/api';
import { Message } from '@/types';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = () => {
    setLoading(true);
    contactApi.getAll()
      .then((r) => setMessages(r.data.data || []))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markRead = async (id: string) => {
    await contactApi.markRead(id).catch(() => {});
    setMessages((m) => m.map((msg) => msg._id === id ? { ...msg, read: true } : msg));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await contactApi.delete(id).then(() => { toast.success('Deleted'); load(); }).catch(() => toast.error('Failed'));
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <AdminLayout>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="font-heading font-extrabold text-2xl">Messages</h1>
        {unread > 0 && <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">{unread} unread</span>}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="flex flex-col gap-2">
          {loading ? [1,2,3].map(i => <div key={i} className="h-20 bg-surface border border-border rounded-xl animate-pulse" />) :
            messages.map((m) => (
              <button key={m._id} onClick={() => { setSelected(m); if (!m.read) markRead(m._id); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selected?._id === m._id ? 'border-accent bg-accent/5' : m.read ? 'border-border bg-surface hover:border-border2' : 'border-accent/30 bg-surface'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${m.read ? 'bg-text3' : 'bg-accent'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-sm truncate">{m.name}</span>
                      <span className="font-mono text-xs text-text3">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="font-mono text-xs text-text2 truncate">{m.subject}</div>
                    <div className="text-text3 text-xs truncate mt-0.5">{m.message}</div>
                  </div>
                </div>
              </button>
            ))
          }
        </div>

        {/* Detail */}
        <div>
          {selected ? (
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-heading font-bold text-lg">{selected.subject}</h2>
                  <div className="font-mono text-xs text-text3 mt-1">{selected.name} · {selected.email}</div>
                  <div className="font-mono text-xs text-text3">{new Date(selected.createdAt).toLocaleString()}</div>
                </div>
                <button onClick={() => handleDelete(selected._id)} className="font-mono text-xs px-3 py-1.5 border border-accent3/30 text-accent3 rounded-lg hover:bg-accent3/10 transition-colors">Delete</button>
              </div>
              <div className="text-text2 text-sm leading-relaxed whitespace-pre-wrap bg-bg-tertiary rounded-lg p-4 mb-4">{selected.message}</div>
              <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="btn-primary inline-block text-sm px-4 py-2">Reply via Email ↗</a>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-xl p-8 flex items-center justify-center h-full min-h-40">
              <p className="font-mono text-sm text-text3">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
