# AI Code Auditor

I built this because I wanted a fast, no-nonsense tool that actually tells me what's wrong with my code — not just highlights it, but explains it and gives me a fix.

LIVE AT : https://ai-code-auditor-green.vercel.app

## What it does

I paste my code, pick the language, hit Run Audit, and get back a full markdown report with the bugs, the risks, and a corrected version. It supports JavaScript, TypeScript, Python, C++, C, Java, Go, Rust, Kotlin, Swift, PHP and Ruby.

## How I built it

- Frontend with React + Vite
- Backend with Node.js + Express
- AI powered by Groq running Llama 3.3 70B

## Running it locally

**Backend**
```bash
cd backend
npm install
node server.js
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

I use a `.env` file in the backend with my `GROQ_API_KEY`. You'll need your own key from [console.groq.com](https://console.groq.com).

## Deployed

Backend lives on Render, frontend on Vercel. Any push to main auto-deploys both.
