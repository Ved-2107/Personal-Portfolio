import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'About | Ved Bajaj',
  description: 'AI/ML Engineer, BTech CS at COEP Technological University Pune. JEE Mains 99.2 Percentile.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
