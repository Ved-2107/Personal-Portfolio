import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Projects | Ved Bajaj',
  description: 'VocaBridge AI Banking, Exchange Simulator C++, Expense Management, Personality AI.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
