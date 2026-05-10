// ============================================================
// GLOBAL TYPES
// ============================================================

export interface Project {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'AI/ML' | 'Full Stack' | 'Systems' | 'Finance';
  featured: boolean;
  tech: string[];
  features: string[];
  github?: string;
  live?: string;
  image?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  category: string;
  icon: string;
  items: string[];
  color: string;
  order: number;
}

export interface Experience {
  _id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
  type: 'club' | 'internship' | 'work';
  order: number;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  published: boolean;
  coverImage?: string;
  readTime: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

export interface Analytics {
  pageViews: number;
  uniqueVisitors: number;
  topProjects: { projectId: string; title: string; clicks: number }[];
  devices: { mobile: number; desktop: number; tablet: number };
  countries: { country: string; count: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
