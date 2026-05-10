import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import skillRoutes from './routes/skills';
import experienceRoutes from './routes/experience';
import blogRoutes from './routes/blog';
import contactRoutes from './routes/contact';
import analyticsRoutes from './routes/analytics';
import githubRoutes from './routes/github';
import chatRoutes from './routes/chat';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// ============================================================
// SOCKET.IO
// ============================================================
const io = new SocketServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let liveVisitors = 0;
io.on('connection', (socket) => {
  liveVisitors++;
  io.emit('visitor_count', liveVisitors);
  logger.info(`Socket connected: ${socket.id} | Total: ${liveVisitors}`);

  socket.on('disconnect', () => {
    liveVisitors = Math.max(0, liveVisitors - 1);
    io.emit('visitor_count', liveVisitors);
  });
});

app.set('io', io);

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://vedbajaj.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use('/uploads', express.static('uploads'));

// ============================================================
// ROUTES
// ============================================================
app.use('/api/auth', rateLimiter(20, 15), authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', rateLimiter(5, 60), contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/chat', rateLimiter(30, 10), chatRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// ============================================================
// START
// ============================================================
async function start() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export { io };
