import type { Metadata } from 'next';

const BASE = 'Ved Bajaj — AI/ML Engineer';

export const PAGE_META: Record<string, Metadata> = {
  about: {
    title: `About | ${BASE}`,
    description: 'Learn about Ved Bajaj — AI/ML Engineer, BTech CS at COEP Technological University Pune. JEE Mains 99.2 Percentile, MHTCET 98.6 Percentile.',
  },
  skills: {
    title: `Skills | ${BASE}`,
    description: 'Tech stack of Ved Bajaj: Python, C++, React, Next.js, Node.js, RAG, FAISS, Whisper, Machine Learning, MongoDB, PostgreSQL.',
  },
  projects: {
    title: `Projects | ${BASE}`,
    description: 'Projects by Ved Bajaj: VocaBridge (Multilingual AI Banking), Exchange Simulator (C++ matching engine), Expense Management System, Personality Prediction AI.',
  },
  experience: {
    title: `Experience | ${BASE}`,
    description: 'Club involvement and experience of Ved Bajaj at COEP — Quantitative Finance Club, DSAI Club, Student Alumni Cell.',
  },
  chat: {
    title: `Chat with Ved AI | ${BASE}`,
    description: 'AI-powered chatbot that answers questions about Ved Bajaj\'s projects, skills, background, and experience. Powered by Claude.',
  },
  contact: {
    title: `Contact | ${BASE}`,
    description: 'Get in touch with Ved Bajaj — open to AI/ML, full-stack, and quant finance opportunities. Based in Pune, India.',
  },
  blog: {
    title: `Blog | ${BASE}`,
    description: 'Articles by Ved Bajaj on AI/ML, systems engineering, quantitative finance, and software craftsmanship.',
  },
};
