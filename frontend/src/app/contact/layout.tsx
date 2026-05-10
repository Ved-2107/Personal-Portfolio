import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Contact | Ved Bajaj',
  description: 'Get in touch with Ved Bajaj. Open to AI/ML and full-stack opportunities in Pune.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
