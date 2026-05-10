import { Router, Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { Blog } from '../models';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/blog
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, tag, search, category } = req.query;
    const filter: Record<string, unknown> = { published: true };
    if (tag) filter.tags = tag;
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search as string };

    const total = await Blog.countDocuments(filter);
    const posts = await Blog.find(filter)
      .select('-content')
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json({
      success: true,
      data: posts,
      pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / +limit) },
    });
  } catch (err) { next(err); }
});

// GET /api/blog/:slug
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Blog.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
});

// POST /api/blog — admin
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const words = req.body.content?.split(' ').length || 0;
    const readTime = Math.ceil(words / 200);
    const post = await Blog.create({ ...req.body, slug, readTime });
    res.status(201).json({ success: true, data: post });
  } catch (err) { next(err); }
});

// PUT /api/blog/:id — admin
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const update = { ...req.body };
    if (req.body.title) update.slug = slugify(req.body.title, { lower: true, strict: true });
    if (req.body.content) update.readTime = Math.ceil(req.body.content.split(' ').length / 200);
    const post = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, data: post });
  } catch (err) { next(err); }
});

// DELETE /api/blog/:id — admin
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) { next(err); }
});

export default router;

// Stub for missing slugify dep — replace with actual package
function slugify(str: string, opts: { lower?: boolean; strict?: boolean }): string {
  let s = str;
  if (opts.lower) s = s.toLowerCase();
  if (opts.strict) s = s.replace(/[^a-z0-9\s-]/g, '');
  return s.trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}
