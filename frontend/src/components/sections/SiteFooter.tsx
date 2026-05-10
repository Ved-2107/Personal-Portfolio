import Link from 'next/link';
import { SOCIAL_LINKS, PERSONAL_DETAILS } from '@/config/personal';

const LINKS = [
  { href: '/about',      label: 'About'      },
  { href: '/projects',   label: 'Projects'   },
  { href: '/skills',     label: 'Skills'     },
  { href: '/experience', label: 'Experience' },
  { href: '/blog',       label: 'Blog'       },
  { href: '/chat',       label: 'AI Chat'    },
  { href: '/contact',    label: 'Contact'    },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Nav links */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}
              style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.72rem', color: 'var(--text3)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'color 0.2s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--accent)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text3)')}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Social links */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          {[
            SOCIAL_LINKS.github,
            SOCIAL_LINKS.linkedin,
            SOCIAL_LINKS.leetcode,
            SOCIAL_LINKS.codeforces,
            { label: 'Email', url: `mailto:${PERSONAL_DETAILS.email}` }
          ].map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.75rem', color: 'var(--text2)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--accent)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text2)')}
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--border),transparent)', marginBottom: '1.2rem' }} />

        {/* Copyright */}
        <p>
          Designed & built by{' '}
          <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>Ved Bajaj</Link>
          {' '}· COEP Technological University, Pune · 2025
        </p>
        <p style={{ marginTop: '0.4rem', opacity: 0.6, fontSize: '0.65rem' }}>
          AI/ML Engineer · Full Stack Developer · Quant Finance Enthusiast
        </p>
      </div>
    </footer>
  );
}
