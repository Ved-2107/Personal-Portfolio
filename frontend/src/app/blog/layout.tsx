import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Blog | Ved Bajaj',
  description: 'Articles on AI/ML, systems engineering, quantitative finance, and software.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
