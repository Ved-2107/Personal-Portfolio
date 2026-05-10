import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Project, Skill, Experience, User } from '../models';
import { logger } from '../config/logger';

const PROJECTS = [
  {
    title: 'VocaBridge',
    subtitle: 'Multilingual AI Banking Assistant',
    description: 'Production-grade real-time multilingual AI banking assistant with end-to-end voice pipeline. Users speak in any language and receive intelligent banking assistance with voice synthesis and RAG-based retrieval.',
    category: 'AI/ML',
    featured: true,
    order: 1,
    tech: ['Python', 'Whisper', 'NLP', 'RAG', 'FAISS', 'React', 'WebSockets', 'FastAPI'],
    features: [
      'Real-time speech-to-text using OpenAI Whisper',
      'Multilingual support with automatic language detection',
      'RAG-based document retrieval with FAISS vector store',
      'Streaming AI responses with WebSocket architecture',
      'Voice synthesis for natural conversation flow',
      'Custom fine-tuned NLP pipeline for banking domain',
    ],
    github: 'https://github.com/Ved-2107/Voice-model.git',
    live: '#',
  },
  {
    title: 'Expense Management System',
    subtitle: 'Enterprise-grade Finance Tracker',
    description: 'Scalable full-stack expense management platform with role-based access control, multi-level approval workflows, and comprehensive reporting dashboards.',
    category: 'Full Stack',
    featured: false,
    order: 2,
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'REST APIs'],
    features: [
      'Role-based access control (Admin/Manager/Employee)',
      'Multi-level expense approval workflows',
      'Real-time expense tracking & categorization',
      'Secure JWT authentication with refresh tokens',
      'RESTful API with validation middleware',
      'Responsive dashboard with analytics',
    ],
    github: 'https://github.com/BhaveshGadling77/Oddo_hackathon_Project',
    live: '#',
  },
  {
    title: 'Exchange Simulator',
    subtitle: 'Low-Latency Order Matching Engine',
    description: 'High-performance exchange simulator built in C++ with a real-time matching engine, WebSocket order streaming, and price-time priority execution.',
    category: 'Systems',
    featured: false,
    order: 3,
    tech: ['C++', 'WebSockets', 'STL', 'Order Book', 'Matching Engine'],
    features: [
      'Price-time priority order matching algorithm',
      'Real-time order book management',
      'WebSocket-based market data streaming',
      'Sub-millisecond order execution',
      'Support for market, limit, and stop orders',
      'Trade execution & history logging',
    ],
    github: 'https://github.com/COEP-Quant-Finance-Club/exchange_simulator',
    live: '#',
  },
  {
    title: 'Personality Prediction AI',
    subtitle: 'ML-Based Behavioral Analysis',
    description: 'Supervised machine learning model that predicts personality types (Big Five) from behavioral and survey data with feature engineering and ensemble methods.',
    category: 'AI/ML',
    featured: false,
    order: 4,
    tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'XGBoost', 'Matplotlib'],
    features: [
      'Big Five personality trait prediction',
      'Advanced feature engineering pipeline',
      'Ensemble model with XGBoost + Random Forest',
      'Cross-validation and hyperparameter tuning',
      'Data preprocessing & normalization',
      'Visualization of personality distributions',
    ],
    github: 'https://github.com/Ved-2107/Nature-of-person-AI--ML-',
    live: '#',
  },
  {
    title: 'Hybrid Heston-Black-Scholes Option Pricing Model',
    subtitle: 'Quantitative Finance | Stochastic Processes',
    description: 'Proposed a hybrid pricing approach combining computational efficiency of Black-Scholes with realism of Heston, expected to reduce pricing error by 40-60%.',
    category: 'Finance',
    featured: false,
    order: 5,
    tech: ['Quantitative Finance', 'Stochastic Processes', 'Option Pricing'],
    features: [
      'Comprehensive literature review of Black-Scholes and Heston models',
      'Analyzed limitations of constant volatility and stochastic modeling',
      'Explored volatility smile, mean reversion, and leverage effect',
      'Designed methodology for numerical validation',
    ],
    github: 'https://drive.google.com/drive/folders/1HClFpL_hP1-k886ArRSHSxPRvVrzkro9',
    live: '#',
  },
  {
    title: 'Text File Compressor in C',
    subtitle: 'C Programming | File Handling | Optimization',
    description: 'Developed a text file compression program using C with efficient file handling and character frequency analysis to reduce file size.',
    category: 'Systems',
    featured: false,
    order: 6,
    tech: ['C Programming', 'File Handling', 'Optimization'],
    features: [
      'Developed text file compression program',
      'Implemented character frequency analysis',
      'Optimized memory usage and execution efficiency',
    ],
    github: 'https://github.com/Ved-2107/DSA-PROJECT-',
    live: '#',
  },
];

const SKILLS = [
  { category: 'Languages', icon: '{ }', color: 'rgba(0,212,255,0.1)', items: ['C', 'C++', 'Python', 'JavaScript', 'TypeScript'], order: 1 },
  { category: 'Frontend', icon: '⬡', color: 'rgba(0,136,255,0.1)', items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Shadcn UI'], order: 2 },
  { category: 'Backend', icon: '⚙', color: 'rgba(157,78,255,0.1)', items: ['Node.js', 'Express.js', 'REST APIs', 'WebSockets'], order: 3 },
  { category: 'AI / ML', icon: '◈', color: 'rgba(0,255,157,0.1)', items: ['Machine Learning', 'NLP', 'RAG', 'FAISS', 'Whisper', 'Ollama', 'AI Agents'], order: 4 },
  { category: 'Databases', icon: '⊞', color: 'rgba(255,107,53,0.1)', items: ['MongoDB', 'PostgreSQL'], order: 5 },
  { category: 'Domains', icon: '◎', color: 'rgba(255,200,0,0.1)', items: ['Quantitative Finance', 'Real-Time Systems', 'LLM Pipelines', 'System Design'], order: 6 },
];

const EXPERIENCE = [
  { role: 'Member & Analyst', organization: 'COEP Quantitative Finance Club', period: '2023 — Present', description: 'Exploring quantitative trading strategies, algorithmic finance, and ML applications in financial markets. Working on backtesting frameworks and data-driven investment models.', type: 'club', order: 1 },
  { role: 'Core Member', organization: 'COEP DSAI Club', period: '2023 — Present', description: 'Active member of the Data Science & AI club. Conducting workshops, exploring cutting-edge research, and collaborating on AI/ML projects with interdisciplinary teams.', type: 'club', order: 2 },
  { role: 'Coordinator', organization: 'Student Alumni Coordination Cell', period: '2024', description: 'Bridging the gap between alumni network and current students. Organizing mentorship programs, industry talks, and placement preparation initiatives.', type: 'club', order: 3 },
  { role: 'Member', organization: 'COEP Impressions (Annual Fest)', period: '2023 — Present', description: "Part of the organizing committee for COEP's annual cultural and technical festival, managing technical events and coordination.", type: 'club', order: 4 },
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');

    await mongoose.connect(uri);
    logger.info('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Experience.deleteMany({}),
    ]);
    logger.info('Cleared existing data');

    // Insert seed data
    await Promise.all([
      Project.insertMany(PROJECTS),
      Skill.insertMany(SKILLS),
      Experience.insertMany(EXPERIENCE),
    ]);
    logger.info('✅ Seed data inserted');

    // Create admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'ved@admin.com';
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      await User.create({
        name: 'Ved Bajaj',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@1234',
        role: 'admin',
      });
      logger.info(`✅ Admin user created: ${adminEmail}`);
    }

    logger.info('🌱 Seeding complete!');
    process.exit(0);
  } catch (err) {
    logger.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
