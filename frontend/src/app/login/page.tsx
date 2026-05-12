'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function VisitorLogin() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fc = "w-full rounded-xl px-4 py-3 text-text text-sm outline-none transition-colors placeholder:text-text3";
  const fieldStyle = { background: 'var(--bg3)', border: '1px solid var(--border)' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="font-heading font-extrabold text-3xl gradient-text mb-2">Ved Bajaj</div>
          <p className="font-mono text-sm text-text2">Please log in to view the portfolio.</p>
        </div>
        <form onSubmit={handle} className="bg-surface border border-border rounded-2xl p-8 flex flex-col gap-5">
          <div>
            <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="visitor@example.com" autoComplete="email"
              className={fc} style={fieldStyle}
              onFocus={e => (e.target.style.borderColor = '#00d4ff')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div>
            <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" autoComplete="current-password"
              className={fc} style={fieldStyle}
              onFocus={e => (e.target.style.borderColor = '#00d4ff')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? '⟳ Signing in...' : 'Sign In →'}
          </button>
          
          <div className="text-center">
            <span className="font-mono text-xs text-text3">Don't have an account? </span>
            <Link href="/signup" className="font-mono text-xs text-accent hover:underline" style={{ textDecoration: 'none' }}>
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
