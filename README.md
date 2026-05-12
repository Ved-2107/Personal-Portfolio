# Ved Bajaj Portfolio

A full-stack developer portfolio built with Next.js, Node.js, and MongoDB. This application includes a public-facing portfolio, an admin dashboard for content management, and an AI-powered chatbot. 

The entire portfolio is currently protected by an authentication system, requiring visitors to log in to view the content.

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Framer Motion

**Backend:**
- Node.js
- Express
- MongoDB (Mongoose)
- Socket.io (Real-time features)

## Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Environment Variables

**Backend (`backend/.env`)**
Create a `.env` file in the `backend` directory based on `.env.example`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
ADMIN_SECRET=your_admin_secret
```

**Frontend (`frontend/.env.local`)**
Create a `.env.local` file in the `frontend` directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Database Seeding

To populate the database with initial data (projects, skills, experience):
```bash
cd backend
npm run seed
```

### Running Locally

You need to run both the frontend and backend servers simultaneously.

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`. 
