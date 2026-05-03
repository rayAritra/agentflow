# AntiGravity

A stunning, production-grade AI-powered fitness & workout tracking platform built with the MERN stack.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB Atlas, Groq API (Llama 3), Gemini 1.5 Flash (Fallback), SSE
- **Frontend**: React 18, Vite, TailwindCSS, Zustand, React Query, Recharts

## Setup

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Environment Variables**
   - In `backend/`, copy `.env.example` to `.env` and fill in your keys (MongoDB, Groq, Gemini).
   - In `frontend/`, copy `.env.example` to `.env` and make sure it points to `http://localhost:5000/api`.

3. **Seed Database**
   ```bash
   npm run seed
   ```

4. **Run Application**
   ```bash
   npm run dev
   ```
