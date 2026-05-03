# AgentFlow

A real-time multi-agent AI research and competitor intelligence platform built with the MERN stack.

## Overview

Users submit a research task (e.g., "Monitor Notion vs Linear pricing this week"). Four AI agents run in sequence — **Scraper** → **Analyzer** → **FactChecker** → **Writer** — each streaming their thinking token-by-token to the browser via SSE. The final output is a polished markdown intelligence report.

## Tech Stack (100% Free Tier Supported)

- **Backend**: Node.js, Express, MongoDB Atlas, BullMQ + Upstash Redis, Groq SDK, Google Gemini API, Cheerio, SSE.
- **Frontend**: React 18, Vite, TailwindCSS, Zustand, React Query, React Router v6, EventSource.

## Requirements

You will need free API keys and URIs for the following services:
1. **MongoDB Atlas** - Free 512MB cluster: [https://www.mongodb.com/pricing](https://www.mongodb.com/pricing)
2. **Upstash Redis** - Free tier: [https://upstash.com/pricing](https://upstash.com/pricing)
3. **Groq** - Free Llama 3 API: [https://console.groq.com/keys](https://console.groq.com/keys)
4. **Google Gemini** - Free Gemini 1.5 Flash API: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

## Setup Instructions

1. **Install Dependencies**
   Run the following command from the root directory to install dependencies for the root, backend, and frontend:
   ```bash
   npm run install:all
   ```

2. **Environment Variables**
   - Navigate to `backend/` and copy `.env.example` to `.env`. Fill in all required keys.
   - Navigate to `frontend/` and copy `.env.example` to `.env`.

3. **Run the Application**
   From the root directory, start both frontend and backend concurrently:
   ```bash
   npm run dev
   ```

## Folder Structure
- `backend/`: Express server, BullMQ workers, Agent logic, SSE controllers.
- `frontend/`: React + Vite client, Zustand stores, Live Agent streaming UI.