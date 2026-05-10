import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Skills | Ved Bajaj',
  description: 'Tech stack: Python, C++, React, Next.js, RAG, FAISS, Machine Learning, WebSockets.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
