import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Chat with Ved AI',
  description: "AI chatbot. Ask anything about Ved Bajaj's projects and skills.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
