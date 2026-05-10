import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Experience | Ved Bajaj',
  description: 'Clubs at COEP — Quantitative Finance Club, DSAI Club, Student Alumni Cell.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
