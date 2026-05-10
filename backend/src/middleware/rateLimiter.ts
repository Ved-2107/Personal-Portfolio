import rateLimit from 'express-rate-limit';

export function rateLimiter(maxRequests: number, windowMinutes: number) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
    skip: (req) => req.ip === '127.0.0.1' && process.env.NODE_ENV === 'development',
  });
}

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
