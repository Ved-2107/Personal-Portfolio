<<<<<<< HEAD
# Ved Bajaj — AI-Powered Developer Portfolio

<div align="center">

![Portfolio Preview](https://via.placeholder.com/1200x600/020408/00d4ff?text=Ved+Bajaj+Portfolio)

**A production-grade, AI-powered developer portfolio** built with Next.js 14, Node.js, MongoDB, and Claude AI.

[![Deploy Frontend](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vedbajaj/portfolio)
[![Deploy Backend](https://railway.app/button.svg)](https://railway.app/new)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Ved AI Chatbot** | Claude-powered AI assistant that answers questions about Ved's projects, skills, and background |
| 🎨 **Cinematic UI** | Dark futuristic design with glassmorphism, Framer Motion animations, and floating particles |
| 📊 **Admin Dashboard** | Full CRUD for projects, skills, experience, blog posts, and messages |
| 📝 **Blog System** | Markdown-powered blog with tags, categories, search, and view tracking |
| 📬 **Contact Form** | Working contact form with email notifications via Nodemailer |
| 🔐 **Auth System** | JWT authentication with bcrypt, refresh tokens, and password reset |
| 📈 **Analytics** | Custom page view, visitor, and project click analytics |
| 🐙 **GitHub Integration** | Live GitHub stats, repos, languages, and contribution data |
| 🔴 **Live Visitor Count** | Real-time visitor tracking via Socket.io |
| 🐳 **Docker Ready** | Full Docker Compose setup with Nginx reverse proxy |

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** — App Router, SSR/SSG, Image optimization
- **TypeScript** — End-to-end type safety
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Production-grade animations
- **Axios** — HTTP client with interceptors
- **Socket.io Client** — Real-time features
- **React Hook Form + Zod** — Form handling & validation

### Backend
- **Node.js + Express** — REST API server
- **TypeScript** — Strict typing throughout
- **MongoDB + Mongoose** — Database with schema validation
- **JWT + bcryptjs** — Authentication & password hashing
- **Socket.io** — WebSocket server for real-time features
- **Nodemailer** — Email sending
- **Winston** — Structured logging
- **Multer** — File uploads
- **Helmet + CORS** — Security middleware

### Infrastructure
- **Docker + Docker Compose** — Containerization
- **Nginx** — Reverse proxy with rate limiting
- **Vercel** — Frontend deployment
- **Railway** — Backend deployment
- **MongoDB Atlas** — Managed database

---

## 📁 Project Structure

```
ved-portfolio/
├── frontend/                   # Next.js 14 app
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── blog/           # Blog listing + detail
│   │   │   └── admin/          # Protected admin pages
│   │   ├── components/
│   │   │   ├── sections/       # Hero, About, Skills, Projects, etc.
│   │   │   ├── chat/           # AI chatbot component
│   │   │   └── admin/          # Admin dashboard components
│   │   ├── context/            # Auth context
│   │   ├── services/           # API service layer
│   │   ├── types/              # TypeScript types
│   │   └── styles/             # Global CSS
│   ├── public/                 # Static assets
│   ├── Dockerfile
│   └── vercel.json
│
├── backend/                    # Express API server
│   ├── src/
│   │   ├── server.ts           # Entry point + Socket.io
│   │   ├── config/             # DB + Logger config
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # Express route handlers
│   │   ├── middleware/         # Auth, error handler, rate limiter
│   │   ├── services/           # Email service
│   │   └── scripts/            # Database seeder
│   ├── Dockerfile
│   └── railway.toml
│
└── docker/
    ├── docker-compose.yml
    └── nginx.conf
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/vedbajaj/portfolio.git
cd ved-portfolio

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Configure Environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, email credentials

# Frontend
cd ../frontend
cp .env.example .env.local
# Edit .env.local with your API URL
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- All projects, skills, and experience data
- Admin user (`ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`)

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# → http://localhost:3000
```

---

## 🐳 Docker Deployment

```bash
# From project root
cp backend/.env.example backend/.env
# Edit backend/.env with production values

docker compose up --build -d

# View logs
docker compose logs -f

# Seed the database (first time)
docker compose exec backend npm run seed
```

Services:
- **Frontend** → http://localhost:3000
- **Backend** → http://localhost:5000
- **Nginx** → http://localhost:80
- **MongoDB** → localhost:27017

---

## ☁️ Production Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
   ```
4. Deploy

### Backend → Railway

1. Create new project at [railway.app](https://railway.app)
2. Connect GitHub repo, select `backend/` folder
3. Add MongoDB plugin or connect Atlas
4. Set all environment variables from `.env.example`
5. Deploy

### Database → MongoDB Atlas

1. Create cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create database user
3. Whitelist IPs (or allow all: `0.0.0.0/0`)
4. Copy connection string to `MONGODB_URI`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT signing (32+ chars) | ✅ |
| `JWT_EXPIRES_IN` | Token expiry (e.g., `7d`) | ✅ |
| `ADMIN_SECRET` | Secret to register admin accounts | ✅ |
| `OWNER_EMAIL` | Email to receive contact form notifications | ✅ |
| `SMTP_HOST` | SMTP server host | ✅ |
| `SMTP_USER` | SMTP username/email | ✅ |
| `SMTP_PASS` | SMTP password/app password | ✅ |
| `ANTHROPIC_API_KEY` | Claude API key (for backend chat proxy) | Optional |
| `GITHUB_TOKEN` | GitHub PAT (increases API rate limit) | Optional |
| `FRONTEND_URL` | Frontend URL for CORS | ✅ |

### Frontend (`frontend/.env.local`)

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL | ✅ |

---

## 📡 API Documentation

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Admin login | Public |
| POST | `/api/auth/register` | Register admin (requires admin secret) | Public |
| GET | `/api/auth/me` | Get current user | JWT |
| POST | `/api/auth/logout` | Logout | JWT |
| POST | `/api/auth/forgot-password` | Send reset email | Public |
| POST | `/api/auth/reset-password` | Reset password with token | Public |

### Projects
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/projects` | Get all projects (filter by `?category=`) | Public |
| GET | `/api/projects/:id` | Get single project | Public |
| POST | `/api/projects` | Create project | Admin |
| PUT | `/api/projects/:id` | Update project | Admin |
| DELETE | `/api/projects/:id` | Delete project | Admin |

### Blog
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/blog` | List published posts | Public |
| GET | `/api/blog/:slug` | Get post by slug + increment views | Public |
| POST | `/api/blog` | Create post | Admin |
| PUT | `/api/blog/:id` | Update post | Admin |
| DELETE | `/api/blog/:id` | Delete post | Admin |

### Contact
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/contact` | Send message (rate limited: 5/hour) | Public |
| GET | `/api/contact` | Get all messages | Admin |
| PUT | `/api/contact/:id/read` | Mark as read | Admin |
| DELETE | `/api/contact/:id` | Delete message | Admin |

### Analytics
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/analytics/track` | Track an event | Public |
| GET | `/api/analytics/dashboard` | Dashboard stats | Admin |
| GET | `/api/analytics/pageviews?range=7d` | Page view time series | Admin |

### GitHub
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/github/stats` | Follower, star, repo counts | Public |
| GET | `/api/github/repos` | Latest repositories | Public |

---

## 🎨 Customization

### Update Profile Data
1. Edit `backend/src/scripts/seed.ts` — update `PROJECTS`, `SKILLS`, `EXPERIENCE` arrays
2. Re-run `npm run seed`
3. Or use the Admin Dashboard at `/admin`

### Update Colors/Theme
Edit `frontend/src/styles/globals.css` — modify CSS variables:
```css
:root {
  --accent: #00d4ff;     /* Primary accent */
  --accent2: #0088ff;    /* Secondary accent */
  --purple: #9d4eff;     /* Purple accent */
  --green: #00ff9d;      /* Success green */
}
```

### Update AI Chatbot Knowledge
Edit the `VED_CONTEXT` string in `frontend/src/components/chat/ChatSection.tsx`

---

## 🔒 Security

- **Helmet.js** — HTTP security headers
- **CORS** — Restricted to allowed origins
- **Rate limiting** — Per-route request throttling
- **JWT** — Stateless authentication with expiry
- **bcrypt** — Password hashing (12 rounds)
- **Input validation** — express-validator on all routes
- **Non-root Docker** — Containers run as `nodejs` user

---

## 📄 License

MIT © [Ved Bajaj](https://github.com/vedbajaj)

---

<div align="center">
Built with ❤️ by <strong>Ved Bajaj</strong> — COEP Technological University, Pune
</div>
=======
# Personal-Portfolio
>>>>>>> 4685052eedcb35be1bd9c85c5ab08621c608a2e2
