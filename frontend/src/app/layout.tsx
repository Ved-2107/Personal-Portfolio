import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';
import LiveVisitorBadge from '@/components/ui/LiveVisitorBadge';

const syne      = Syne({ subsets: ['latin'], variable: '--font-syne',  weight: ['400','500','600','700','800'] });
const dmSans    = DM_Sans({ subsets: ['latin'], variable: '--font-dm',   weight: ['300','400','500'] });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['300','400','500'] });

export const metadata: Metadata = {
  title: {
    default: 'Ved Bajaj — AI/ML Engineer & Full Stack Developer',
    template: '%s | Ved Bajaj',
  },
  description: 'Portfolio of Ved Bajaj — AI/ML Engineer, Full Stack Developer, and Quant Finance Enthusiast at COEP Technological University, Pune.',
  keywords: ['Ved Bajaj', 'AI Engineer', 'ML Engineer', 'Full Stack Developer', 'COEP', 'React', 'Python', 'Machine Learning', 'RAG', 'VocaBridge'],
  authors: [{ name: 'Ved Bajaj' }],
  openGraph: {
    title: 'Ved Bajaj — AI/ML Engineer',
    description: 'Building intelligent systems at the intersection of AI/ML, real-time architectures, and quantitative finance.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body>
        <AuthProvider>
          <AuthGuard>
            {children}
            <LiveVisitorBadge />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#0d1a2a', color: '#e8f4ff',
                  border: '1px solid #1a2d45',
                  fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem',
                },
                success: { iconTheme: { primary: '#00ff9d', secondary: '#000' } },
                error:   { iconTheme: { primary: '#ff6b35', secondary: '#000' } },
              }}
            />
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
