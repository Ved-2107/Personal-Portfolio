import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { Project, Skill, Experience } from '../models';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

// ============================================================
// MULTER SETUP
// ============================================================
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

// ============================================================
// PROJECTS ROUTER
// ============================================================
export const projectRouter = Router();

// GET /api/projects
projectRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
    const projects = await Project.find(filter).sort({ featured: -1, order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
});

// GET /api/projects/:id
projectRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
});

// POST /api/projects — admin only
projectRouter.post(
  '/',
  authenticate, requireAdmin,
  upload.single('image'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = { ...req.body, tech: JSON.parse(req.body.tech || '[]'), features: JSON.parse(req.body.features || '[]') };
      if (req.file) data.image = `/uploads/${req.file.filename}`;
      const project = await Project.create(data);
      res.status(201).json({ success: true, data: project });
    } catch (err) { next(err); }
  }
);

// PUT /api/projects/:id — admin only
projectRouter.put(
  '/:id',
  authenticate, requireAdmin,
  upload.single('image'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = { ...req.body };
      if (req.body.tech) data.tech = JSON.parse(req.body.tech);
      if (req.body.features) data.features = JSON.parse(req.body.features);
      if (req.file) data.image = `/uploads/${req.file.filename}`;
      const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
      res.json({ success: true, data: project });
    } catch (err) { next(err); }
  }
);

// DELETE /api/projects/:id — admin only
projectRouter.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
});

// ============================================================
// SKILLS ROUTER
// ============================================================
export const skillRouter = Router();

skillRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    res.json({ success: true, data: skills });
  } catch (err) { next(err); }
});

skillRouter.post('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (err) { next(err); }
});

skillRouter.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: skill });
  } catch (err) { next(err); }
});

skillRouter.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Skill deleted' });
  } catch (err) { next(err); }
});

// ============================================================
// EXPERIENCE ROUTER
// ============================================================
export const experienceRouter = Router();

experienceRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const experience = await Experience.find().sort({ order: 1 });
    res.json({ success: true, data: experience });
  } catch (err) { next(err); }
});

experienceRouter.post('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exp = await Experience.create(req.body);
    res.status(201).json({ success: true, data: exp });
  } catch (err) { next(err); }
});

experienceRouter.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: exp });
  } catch (err) { next(err); }
});

experienceRouter.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Experience deleted' });
  } catch (err) { next(err); }
});

export default projectRouter;
