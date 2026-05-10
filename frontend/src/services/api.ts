import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ============================================================
// AXIOS INSTANCE
// ============================================================
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================
// AUTH
// ============================================================
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  me: () => api.get('/auth/me'),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};

// ============================================================
// PROJECTS
// ============================================================
export const projectsApi = {
  getAll: (category?: string) =>
    api.get('/projects', { params: { category } }),

  getById: (id: string) => api.get(`/projects/${id}`),

  create: (data: FormData) =>
    api.post('/projects', data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  update: (id: string, data: FormData) =>
    api.put(`/projects/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  delete: (id: string) => api.delete(`/projects/${id}`),

  reorder: (ids: string[]) => api.put('/projects/reorder', { ids }),
};

// ============================================================
// SKILLS
// ============================================================
export const skillsApi = {
  getAll: () => api.get('/skills'),
  create: (data: object) => api.post('/skills', data),
  update: (id: string, data: object) => api.put(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
};

// ============================================================
// EXPERIENCE
// ============================================================
export const experienceApi = {
  getAll: () => api.get('/experience'),
  create: (data: object) => api.post('/experience', data),
  update: (id: string, data: object) => api.put(`/experience/${id}`, data),
  delete: (id: string) => api.delete(`/experience/${id}`),
};

// ============================================================
// BLOG
// ============================================================
export const blogApi = {
  getAll: (params?: { page?: number; limit?: number; tag?: string; search?: string }) =>
    api.get('/blog', { params }),

  getBySlug: (slug: string) => api.get(`/blog/${slug}`),

  create: (data: object) => api.post('/blog', data),

  update: (id: string, data: object) => api.put(`/blog/${id}`, data),

  delete: (id: string) => api.delete(`/blog/${id}`),
};

// ============================================================
// CONTACT
// ============================================================
export const contactApi = {
  send: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post('/contact', data),

  getAll: () => api.get('/contact'),

  markRead: (id: string) => api.put(`/contact/${id}/read`),

  delete: (id: string) => api.delete(`/contact/${id}`),
};

// ============================================================
// ANALYTICS
// ============================================================
export const analyticsApi = {
  track: (event: string, data?: object) =>
    api.post('/analytics/track', { event, data }),

  getDashboard: () => api.get('/analytics/dashboard'),

  getPageViews: (range: '7d' | '30d' | '90d') =>
    api.get('/analytics/pageviews', { params: { range } }),
};

// ============================================================
// GITHUB
// ============================================================
export const githubApi = {
  getStats: () => api.get('/github/stats'),
  getRepos: () => api.get('/github/repos'),
  getContributions: () => api.get('/github/contributions'),
};

// ============================================================
// CHAT (AI)
// ============================================================
export const chatApi = {
  send: (messages: { role: string; content: string }[]) =>
    api.post('/chat', { messages }),
};

export default api;
