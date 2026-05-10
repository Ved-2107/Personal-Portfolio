'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminSignup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', adminSecret: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await authApi.login(form.email, form.password).catch(() => null); // pre-check
      // Use register endpoint
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, adminSecret: form.adminSecret }),
      }).then(async r => {
        const data = await r.json();
        if (!data.success) throw new Error(data.message || 'Registration failed');
        toast.success('Admin account created! Please log in.');
        router.push('/admin/login');
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally { setLoading(false); }
  };

  const fieldCls = "w-full rounded-xl px-4 py-3 text-text text-sm outline-none transition-colors placeholder:text-text3";
  const fieldStyle = { background: 'var(--bg3)', border: '1px solid var(--border)' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="font-heading font-extrabold text-3xl gradient-text mb-2">VB. Admin</div>
          <p className="font-mono text-sm text-text2">Create your admin account</p>
        </div>

        <form onSubmit={submit} className="bg-surface border border-border rounded-2xl p-8 flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Full Name</label>
            <input type="text" value={form.name} onChange={set('name')} required placeholder="Ved Bajaj"
              className={fieldCls} style={fieldStyle}
              onFocus={e => (e.target.style.borderColor = '#00d4ff')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {/* Email */}
          <div>
            <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Email Address</label>
            <input type="email" value={form.email} onChange={set('email')} required placeholder="ved@admin.com"
              className={fieldCls} style={fieldStyle}
              onFocus={e => (e.target.style.borderColor = '#00d4ff')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {/* Password */}
          <div>
            <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} required
                placeholder="Min 8 characters" className={fieldCls} style={{ ...fieldStyle, paddingRight: '3rem' }}
                onFocus={e => (e.target.style.borderColor = '#00d4ff')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
              <button type="button" onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: '0.75rem', fontFamily: "'JetBrains Mono',monospace" }}>
                {showPass ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required
              placeholder="Repeat password" className={fieldCls} style={fieldStyle}
              onFocus={e => (e.target.style.borderColor = '#00d4ff')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {/* Admin Secret */}
          <div>
            <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Admin Secret Key</label>
            <input type="password" value={form.adminSecret} onChange={set('adminSecret')} required
              placeholder="Secret key from .env" className={fieldCls} style={fieldStyle}
              onFocus={e => (e.target.style.borderColor = '#00d4ff')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
            <p className="font-mono text-xs text-text3 mt-1">Set <code className="text-accent">ADMIN_SECRET</code> in your backend .env</p>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
            {loading ? '⟳ Creating account...' : 'Create Admin Account →'}
          </button>

          <div className="text-center">
            <span className="font-mono text-xs text-text3">Already have an account? </span>
            <Link href="/admin/login" className="font-mono text-xs text-accent hover:underline" style={{ textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
