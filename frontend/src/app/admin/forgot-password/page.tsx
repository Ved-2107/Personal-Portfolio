'use client';
import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch { toast.error('Request failed. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div className="font-heading font-extrabold text-3xl gradient-text mb-2">Reset Password</div>
          <p className="font-mono text-sm text-text2">Enter your admin email to receive a reset link.</p>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-3">✉</div>
              <p className="font-heading font-bold text-base mb-2" style={{ color:'var(--green)' }}>Link Sent!</p>
              <p className="text-text2 text-sm mb-6">Check your inbox at <span className="text-accent">{email}</span>.</p>
              <Link href="/admin/login" className="btn-primary inline-block" style={{ textDecoration:'none' }}>Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-5">
              <div>
                <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com"
                  className="w-full rounded-xl px-4 py-3 text-text text-sm outline-none transition-colors placeholder:text-text3"
                  style={{ background:'var(--bg3)', border:'1px solid var(--border)' }}
                  onFocus={e=>(e.target.style.borderColor='#00d4ff')} onBlur={e=>(e.target.style.borderColor='var(--border)')} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? '⟳ Sending...' : 'Send Reset Link →'}
              </button>
              <div className="text-center">
                <Link href="/admin/login" className="font-mono text-xs text-text3 hover:text-accent transition-colors" style={{ textDecoration:'none' }}>
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
