import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { Message } from '../models';
import { authenticate, requireAdmin } from '../middleware/auth';
import { sendEmail } from '../services/email';

const router = Router();

// POST /api/contact — public
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message too short'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, subject, message } = req.body;
      const saved = await Message.create({ name, email, subject, message, ip: req.ip });

      // Notify Ved
      await sendEmail({
        to: process.env.OWNER_EMAIL!,
        subject: `📨 New message: ${subject}`,
        html: `
          <h2>New Portfolio Message</h2>
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr/>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
      });

      // Auto-reply to sender
      await sendEmail({
        to: email,
        subject: 'Thanks for reaching out — Ved Bajaj',
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for your message! I've received it and will get back to you soon.</p>
          <p>Best,<br/>Ved Bajaj<br/>AI/ML Engineer | COEP Technological University</p>
        `,
      }).catch(() => {}); // Non-blocking

      res.status(201).json({ success: true, message: 'Message sent successfully', data: { id: saved._id } });
    } catch (err) { next(err); }
  }
);

// GET /api/contact — admin
router.get('/', authenticate, requireAdmin, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) { next(err); }
});

// PUT /api/contact/:id/read — admin
router.put('/:id/read', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) { next(err); }
});

// DELETE /api/contact/:id — admin
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) { next(err); }
});

export default router;
