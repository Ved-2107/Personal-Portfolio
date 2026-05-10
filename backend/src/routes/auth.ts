import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import { User } from '../models';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { sendEmail } from '../services/email';

const router = Router();

function signToken(id: string, role: string, email: string): string {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('adminSecret').notEmpty().withMessage('Admin secret required'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      if (req.body.adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ success: false, message: 'Invalid admin secret' });
      }
      const existing = await User.findOne({ email: req.body.email });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: 'admin',
      });
      const token = signToken(user.id, user.role, user.email);
      res.status(201).json({
        success: true,
        data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      });
    } catch (err) { next(err); }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
      const user = await User.findOne({ email: req.body.email }).select('+password');
      if (!user || !(await user.comparePassword(req.body.password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      const token = signToken(user.id, user.role, user.email);
      res.json({
        success: true,
        data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      });
    } catch (err) { next(err); }
  }
);

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

// POST /api/auth/logout
router.post('/logout', authenticate, (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        // Don't reveal if email exists
        return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
      }
      const token = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();
      const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password?token=${token}`;
      await sendEmail({
        to: user.email,
        subject: 'Password Reset — Ved Portfolio',
        html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>Expires in 1 hour.</p>`,
      });
      res.json({ success: true, message: 'Reset email sent.' });
    } catch (err) { next(err); }
  }
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  [body('token').notEmpty(), body('password').isLength({ min: 8 })],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
      }
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.json({ success: true, message: 'Password reset successfully' });
    } catch (err) { next(err); }
  }
);

export default router;
