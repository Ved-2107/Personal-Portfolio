'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import PageShell from '@/components/ui/PageShell';
import { contactApi } from '@/services/api';
import toast from 'react-hot-toast';
import { SOCIAL_LINKS, PERSONAL_DETAILS } from '@/config/personal';

const SOCIALS = [
  { id: 'github', icon: 'GH', label: SOCIAL_LINKS.github.label,   url: SOCIAL_LINKS.github.url,             sub: SOCIAL_LINKS.github.username,              bg: 'rgba(255,255,255,0.05)', color: '#e8f4ff' },
  { id: 'linkedin', icon: 'in', label: SOCIAL_LINKS.linkedin.label, url: SOCIAL_LINKS.linkedin.url,         sub: SOCIAL_LINKS.linkedin.username,         bg: 'rgba(0,119,181,0.12)',   color: '#0a66c2' },
  { id: 'email', icon: '@',  label: 'Email',    url: `mailto:${PERSONAL_DETAILS.email}`,           sub: PERSONAL_DETAILS.email,          bg: 'rgba(0,212,255,0.08)',   color: '#00d4ff' },
  { id: 'phone', icon: '📞', label: 'Phone',    url: `tel:${PERSONAL_DETAILS.phone.replace(/\s+/g, '')}`,           sub: PERSONAL_DETAILS.phone,          bg: 'rgba(0,255,157,0.08)', color: '#00ff9d' },
  { id: 'location', icon: '📍', label: 'Location', url: '',                                          sub: PERSONAL_DETAILS.location,         bg: 'rgba(157,78,255,0.08)', color: '#9d4eff' },
];

interface Form { name: string; email: string; subject: string; message: string; }

export default function ContactPage() {
  const [form, setForm]       = useState<Form>({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [copied, setCopied]   = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(PERSONAL_DETAILS.email);
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await contactApi.send(form);
      setSent(true);
      toast.success('Message sent! I\'ll get back to you soon.');
    } catch {
      toast.error('Failed to send. Please try again or email directly.');
    } finally { setLoading(false); }
  };

  return (
    <PageShell
      tag="06 / Contact"
      title="Let's"
      accent="Connect"
      breadcrumb="Contact"
      desc="Open to internships, collaborations, and full-time roles in AI/ML and full-stack engineering."
    >
      <div className="grid lg:grid-cols-2 gap-16 items-start">

        {/* Left — info */}
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-heading font-extrabold text-2xl mb-4">Open to Opportunities</h2>
          <p className="text-text2 leading-relaxed mb-8">
            Whether you're looking for an AI/ML engineer, a full-stack developer, or want to collaborate on
            something ambitious — I'd love to hear from you. I'm available for internships, project collaborations,
            and full-time roles.
          </p>

          <div className="flex flex-col gap-3 mb-10">
            {SOCIALS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
                {s.url ? (
                  <a href={s.url} target={s.id === 'email' || s.id === 'phone' ? undefined : "_blank"} rel="noopener noreferrer"
                    onClick={s.id === 'email' ? handleCopyEmail : undefined}
                    className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl hover:border-accent/30 transition-all group relative"
                    style={{ textDecoration: 'none', color: 'var(--text)' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm flex-shrink-0"
                      style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm group-hover:text-accent transition-colors">{s.label}</div>
                      <div className="font-mono text-xs text-text3">{s.id === 'email' && copied ? 'Copied!' : s.sub}</div>
                    </div>
                    <span className="text-text3 text-sm group-hover:text-accent transition-colors">
                      {s.id === 'email' ? '⧉' : '↗'}
                    </span>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm flex-shrink-0"
                      style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                    <div>
                      <div className="font-semibold text-sm">{s.label}</div>
                      <div className="font-mono text-xs text-text3">{s.sub}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Response time card */}
          <div className="p-5 bg-surface border border-brand-green/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
              <span className="font-mono text-xs" style={{ color: 'var(--green)' }}>Typically responds within 24 hours</span>
            </div>
            <p className="font-mono text-xs text-text3">Especially excited about AI/ML, quantitative finance, and systems engineering opportunities.</p>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface border rounded-2xl p-14 text-center"
              style={{ borderColor: 'rgba(0,255,157,0.3)' }}
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                className="text-5xl mb-5">✓</motion.div>
              <h3 className="font-heading font-extrabold text-xl mb-2" style={{ color: 'var(--green)' }}>Message Sent!</h3>
              <p className="text-text2 text-sm mb-6">Thanks {form.name}! I'll get back to you at <span className="text-accent">{form.email}</span> soon.</p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="font-mono text-xs text-text3 hover:text-accent transition-colors"
              >
                Send another message →
              </button>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="bg-surface border border-border rounded-2xl p-8 flex flex-col gap-5">
              <h3 className="font-heading font-bold text-lg mb-1">Send a Message</h3>

              {/* Name + Email row */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { id: 'name' as const,  label: 'Your Name *',      type: 'text',  placeholder: 'Jane Doe' },
                  { id: 'email' as const, label: 'Email Address *',   type: 'email', placeholder: 'jane@company.com' },
                ].map(f => (
                  <div key={f.id}>
                    <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">{f.label}</label>
                    <input
                      type={f.type} placeholder={f.placeholder} required
                      value={form[f.id]} onChange={set(f.id)}
                      className="w-full rounded-xl px-4 py-3 text-text text-sm outline-none transition-colors placeholder:text-text3"
                      style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}
                      onFocus={e => (e.target.style.borderColor = '#00d4ff')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                    />
                  </div>
                ))}
              </div>

              {/* Subject */}
              <div>
                <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Subject</label>
                <input
                  type="text" placeholder="Let's collaborate on something amazing!"
                  value={form.subject} onChange={set('subject')}
                  className="w-full rounded-xl px-4 py-3 text-text text-sm outline-none transition-colors placeholder:text-text3"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}
                  onFocus={e => (e.target.style.borderColor = '#00d4ff')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>

              {/* Message */}
              <div>
                <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Message *</label>
                <textarea
                  placeholder="Tell me about your project, opportunity, or what you'd like to collaborate on..."
                  rows={6} required
                  value={form.message} onChange={set('message')}
                  className="w-full rounded-xl px-4 py-3 text-text text-sm outline-none transition-colors placeholder:text-text3 resize-none"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}
                  onFocus={e => (e.target.style.borderColor = '#00d4ff')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading
                  ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>⟳</motion.span> Sending...</>
                  : 'Send Message ↗'
                }
              </button>

              <p className="font-mono text-xs text-text3 text-center">
                Or email directly at <a href={`mailto:${PERSONAL_DETAILS.email}`} className="text-accent hover:underline">{PERSONAL_DETAILS.email}</a>
              </p>
            </form>
          )}
        </motion.div>

      </div>
    </PageShell>
  );
}
