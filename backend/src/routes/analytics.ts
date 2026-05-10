import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { Analytics } from '../models';
import { authenticate, requireAdmin } from '../middleware/auth';

// ============================================================
// ANALYTICS ROUTER
// ============================================================
export const analyticsRouter = Router();

analyticsRouter.post('/track', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Analytics.create({
      event: req.body.event,
      data: req.body.data || {},
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    res.json({ success: true });
  } catch (err) { next(err); }
});

analyticsRouter.get('/dashboard', authenticate, requireAdmin, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [pageViews, projectClicks, totalEvents] = await Promise.all([
      Analytics.countDocuments({ event: 'page_view' }),
      Analytics.countDocuments({ event: 'project_click' }),
      Analytics.countDocuments(),
    ]);

    const topProjects = await Analytics.aggregate([
      { $match: { event: 'project_click' } },
      { $group: { _id: '$data.projectId', title: { $first: '$data.title' }, clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 5 },
    ]);

    const recentViews = await Analytics.find({ event: 'page_view' })
      .sort({ createdAt: -1 })
      .limit(100)
      .select('createdAt');

    res.json({ success: true, data: { pageViews, projectClicks, totalEvents, topProjects, recentViews } });
  } catch (err) { next(err); }
});

analyticsRouter.get('/pageviews', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = req.query.range === '7d' ? 7 : req.query.range === '90d' ? 90 : 30;
    const since = new Date(Date.now() - days * 24 * 3600 * 1000);
    const data = await Analytics.aggregate([
      { $match: { event: 'page_view', createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ============================================================
// GITHUB ROUTER
// ============================================================
export const githubRouter = Router();
const GH_USER = process.env.GITHUB_USERNAME || 'vedbajaj';
const GH_TOKEN = process.env.GITHUB_TOKEN;
const ghHeaders = GH_TOKEN ? { Authorization: `token ${GH_TOKEN}` } : {};

githubRouter.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${GH_USER}`, { headers: ghHeaders }),
      axios.get(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`, { headers: ghHeaders }),
    ]);
    const repos = reposRes.data;
    const stars = repos.reduce((acc: number, r: { stargazers_count: number }) => acc + r.stargazers_count, 0);
    const langs: Record<string, number> = {};
    repos.forEach((r: { language: string }) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });

    res.json({
      success: true,
      data: {
        followers: userRes.data.followers,
        following: userRes.data.following,
        publicRepos: userRes.data.public_repos,
        totalStars: stars,
        topLanguages: Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 6),
      },
    });
  } catch (err) { next(err); }
});

githubRouter.get('/repos', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = await axios.get(`https://api.github.com/users/${GH_USER}/repos?per_page=20&sort=updated`, { headers: ghHeaders });
    const repos = data.map((r: Record<string, unknown>) => ({
      id: r.id, name: r.name, description: r.description, url: r.html_url,
      language: r.language, stars: r.stargazers_count, forks: r.forks_count,
      updatedAt: r.updated_at, topics: r.topics,
    }));
    res.json({ success: true, data: repos });
  } catch (err) { next(err); }
});

// ============================================================
// CHAT ROUTER (backend proxy — optional, use frontend direct call too)
// ============================================================
export const chatRouter = Router();

chatRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Messages array required' });
    }

    const VED_CONTEXT = `You are "Ved AI", an assistant for Ved Bajaj's portfolio. Answer only about Ved.
Ved Bajaj: BTech CS @ COEP Technological University, Pune. AI/ML Engineer, Full Stack Developer, Quant Finance Enthusiast.
JEE Mains 99.2%, MHTCET 98.6%.
Skills: Python, C++, JS/TS, React, Next.js, Node.js, RAG, FAISS, Whisper, ML/NLP, MongoDB, PostgreSQL.
Projects: VocaBridge (Multilingual AI Banking, Whisper+RAG+FAISS+WebSocket), Expense Management System (React+Node+MongoDB), Exchange Simulator (C++, matching engine), Personality Prediction (ML, XGBoost).
Clubs: COEP Quant Finance Club, COEP DSAI Club, Student Alumni Cell, COEP Impressions.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      { 
        model: 'llama3-70b-8192', 
        max_tokens: 800, 
        messages: [
          { role: 'system', content: VED_CONTEXT },
          ...messages.slice(-10)
        ]
      },
      { 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${process.env.GROQ_API_KEY || ''}`
        } 
      }
    );
    const reply = response.data.choices?.[0]?.message?.content ?? "I'm unavailable right now.";
    res.json({ success: true, data: { reply } });
  } catch (err) { next(err); }
});

export default analyticsRouter;
