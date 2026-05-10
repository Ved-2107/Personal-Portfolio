'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

// ─── ADMIN LOGIN ──────────────────────────────────────────────
export function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => { if (isAuthenticated) router.replace('/admin'); }, [isAuthenticated]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/admin');
    } catch { toast.error('Invalid credentials'); }
    finally  { setLoading(false); }
  };

  const fc = "w-full rounded-xl px-4 py-3 text-text text-sm outline-none transition-colors placeholder:text-text3";

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div className="font-heading font-extrabold text-3xl gradient-text mb-2">VB. Admin</div>
          <p className="font-mono text-sm text-text2">Portfolio Management Dashboard</p>
        </div>
        <form onSubmit={handle} className="bg-surface border border-border rounded-2xl p-8 flex flex-col gap-5">
          <div>
            <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com" autoComplete="email"
              className={fc} style={{ background:'var(--bg3)', border:'1px solid var(--border)' }}
              onFocus={e=>(e.target.style.borderColor='#00d4ff')} onBlur={e=>(e.target.style.borderColor='var(--border)')} />
          </div>
          <div>
            <label className="font-mono text-xs text-text3 uppercase tracking-widest block mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" autoComplete="current-password"
              className={fc} style={{ background:'var(--bg3)', border:'1px solid var(--border)' }}
              onFocus={e=>(e.target.style.borderColor='#00d4ff')} onBlur={e=>(e.target.style.borderColor='var(--border)')} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? '⟳ Signing in...' : 'Sign In →'}
          </button>
          <div className="text-center">
            <Link href="/admin/forgot-password" className="font-mono text-xs text-text3 hover:text-accent transition-colors" style={{ textDecoration:'none' }}>
              Forgot password?
            </Link>
          </div>
          <div className="text-center">
            <span className="font-mono text-xs text-text3">New admin? </span>
            <Link href="/admin/signup" className="font-mono text-xs text-accent hover:underline" style={{ textDecoration:'none' }}>
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── ADMIN LAYOUT ─────────────────────────────────────────────
const NAV = [
  { href:'/admin',            label:'Dashboard',  icon:'⊡' },
  { href:'/admin/projects',   label:'Projects',   icon:'◈' },
  { href:'/admin/skills',     label:'Skills',     icon:'⬡' },
  { href:'/admin/experience', label:'Experience', icon:'⊞' },
  { href:'/admin/blog',       label:'Blog',       icon:'✎' },
  { href:'/admin/messages',   label:'Messages',   icon:'✉' },
  { href:'/admin/analytics',  label:'Analytics',  icon:'◎' },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileSide, setMobileSide] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/admin/login');
  }, [loading, isAuthenticated]);

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span className="font-mono text-accent animate-pulse">Loading...</span>
    </div>
  );
  if (!isAuthenticated) return null;

  const NavLinks = ({ mobile = false }) => (
    <>
      {NAV.map(item => {
        const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href}
            onClick={() => mobile && setMobileSide(false)}
            style={{ textDecoration:'none', fontFamily:"'JetBrains Mono',monospace" }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
              active
                ? 'text-accent border border-accent/20'
                : 'text-text2 hover:text-text hover:bg-surface border border-transparent'
            }`}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <span className="text-base flex-shrink-0" style={active ? { color:'var(--accent)' } : {}}>{item.icon}</span>
            {(!collapsed || mobile) && item.label}
          </Link>
        );
      })}
    </>
  );

  const SidebarInner = ({ mobile = false }) => (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ padding:'1rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {(!collapsed || mobile) && (
          <Link href="/admin" style={{ textDecoration:'none' }} className="font-heading font-extrabold gradient-text">VB. Admin</Link>
        )}
        {!mobile && (
          <button onClick={() => setCollapsed(c=>!c)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text2)', padding:'4px' }}>
            {collapsed ? '▶' : '◀'}
          </button>
        )}
      </div>
      <nav style={{ flex:1, padding:'0.75rem', display:'flex', flexDirection:'column', gap:'4px', overflowY:'auto' }}>
        <NavLinks mobile={mobile} />
      </nav>
      <div style={{ padding:'0.75rem', borderTop:'1px solid var(--border)' }}>
        <Link href="/" target="_blank" style={{ textDecoration:'none' }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-text3 hover:text-accent transition-colors font-mono text-xs border border-transparent hover:border-border">
          <span>↗</span>{(!collapsed || mobile) && 'View Site'}
        </Link>
        {(!collapsed || mobile) && (
          <div className="font-mono text-xs text-text3 px-3 py-1 truncate mt-1">{user?.email}</div>
        )}
        <button onClick={() => logout()} className="flex items-center gap-3 px-3 py-2 w-full text-text3 hover:text-accent transition-colors font-mono text-xs rounded-lg"
          style={{ background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>
          <span>⎋</span>{(!collapsed || mobile) && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex' }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block flex-shrink-0 transition-all duration-300"
        style={{ width: collapsed ? 64 : 240, background:'var(--bg2)', borderRight:'1px solid var(--border)' }}>
        <SidebarInner />
      </aside>

      {/* Mobile sidebar */}
      {mobileSide && (
        <div className="fixed inset-0 z-50 flex lg:hidden" onClick={() => setMobileSide(false)}>
          <div style={{ width:256, background:'var(--bg2)', borderRight:'1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <SidebarInner mobile />
          </div>
          <div style={{ flex:1, background:'rgba(0,0,0,0.5)' }} />
        </div>
      )}

      {/* Main content */}
      <main style={{ flex:1, overflowX:'auto', overflowY:'auto' }}>
        {/* Mobile top bar */}
        <div className="flex lg:hidden items-center justify-between px-5 py-3 sticky top-0 z-10"
          style={{ background:'var(--bg2)', borderBottom:'1px solid var(--border)' }}>
          <button onClick={() => setMobileSide(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text2)', fontSize:'1.1rem' }}>☰</button>
          <span className="font-heading font-bold gradient-text">VB. Admin</span>
          <Link href="/" className="font-mono text-xs text-text3 hover:text-accent transition-colors" style={{ textDecoration:'none' }}>↗</Link>
        </div>
        <div style={{ padding:'1.5rem 2rem' }}>{children}</div>
      </main>
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────
export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<{
    pageViews: number; projectClicks: number; totalEvents: number;
    topProjects: { _id: string; title: string; clicks: number }[];
  } | null>(null);
  const [messages, setMessages] = useState<{
    _id: string; name: string; email: string; subject: string; read: boolean; createdAt: string;
  }[]>([]);

  useEffect(() => {
    import('@/services/api').then(({ analyticsApi, contactApi }) => {
      analyticsApi.getDashboard().then(r => setAnalytics(r.data.data)).catch(() => {});
      contactApi.getAll().then(r => setMessages(r.data.data?.slice(0, 5) || [])).catch(() => {});
    });
  }, []);

  const stats = [
    { label:'Page Views',     value: analytics?.pageViews     ?? '—', icon:'◎', href:'/admin/analytics' },
    { label:'Project Clicks', value: analytics?.projectClicks ?? '—', icon:'◈', href:'/admin/analytics' },
    { label:'Total Events',   value: analytics?.totalEvents   ?? '—', icon:'⊡', href:'/admin/analytics' },
    { label:'Unread Messages',value: messages.filter(m => !m.read).length,     icon:'✉', href:'/admin/messages'  },
  ];

  const quickLinks = [
    { href:'/admin/projects/new', label:'+ New Project', icon:'◈' },
    { href:'/admin/blog',         label:'+ New Blog Post', icon:'✎' },
    { href:'/admin/messages',     label:'View Messages', icon:'✉' },
    { href:'/admin/analytics',    label:'View Analytics', icon:'◎' },
  ];

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl mb-2">Dashboard</h1>
      <p className="text-text2 text-sm mb-8">Welcome back! Here's an overview of your portfolio.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration:'none' }}>
            <div className="bg-surface border border-border rounded-xl p-5 hover:border-accent/30 transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-text3 uppercase tracking-wider">{s.label}</span>
                <span className="text-accent group-hover:scale-110 transition-transform inline-block">{s.icon}</span>
              </div>
              <div className="font-heading font-extrabold text-3xl gradient-text">{s.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {quickLinks.map(l => (
          <Link key={l.href} href={l.href} style={{ textDecoration:'none' }}
            className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-accent/30 transition-all text-text2 hover:text-accent group">
            <span className="text-accent">{l.icon}</span>
            <span className="font-mono text-xs">{l.label}</span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs">→</span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top projects */}
        {analytics?.topProjects && analytics.topProjects.length > 0 && (
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-base">Top Projects</h2>
              <Link href="/admin/analytics" className="font-mono text-xs text-accent hover:underline" style={{ textDecoration:'none' }}>Details →</Link>
            </div>
            <div className="flex flex-col gap-2">
              {analytics.topProjects.map((p, i) => (
                <div key={p._id} className="flex items-center justify-between text-sm py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-text3 w-4">{i+1}</span>
                    <span className="font-mono text-xs text-text2 truncate">{p.title || p._id}</span>
                  </div>
                  <span className="font-heading font-bold text-sm gradient-text ml-3">{p.clicks}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent messages */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-base">Recent Messages</h2>
            <Link href="/admin/messages" className="font-mono text-xs text-accent hover:underline" style={{ textDecoration:'none' }}>View all →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="font-mono text-xs text-text3">No messages yet.</div>
            ) : messages.map(m => (
              <div key={m._id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${m.read ? 'bg-text3' : 'bg-accent'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs truncate">{m.name}</div>
                  <div className="text-text3 text-xs truncate">{m.subject}</div>
                </div>
                <div className="font-mono text-xs text-text3 flex-shrink-0">{new Date(m.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
