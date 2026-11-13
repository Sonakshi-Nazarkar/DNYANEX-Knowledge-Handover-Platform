# DNYANEX Setup & Deployment Guide

## 1. Prerequisites
- Node.js >= 20.x
- NPM >= 9.x
- Google Gemini API Key (`GEMINI_API_KEY`)

## 2. Environment Variables
Create or verify your `.env` file from `.env.example`:

```bash
# Gemini API Key (accessed server-side only)
GEMINI_API_KEY="your-gemini-api-key"

# App URL for hosting
APP_URL="http://localhost:3000"
```

## 3. Installation & Local Development
```bash
# Install runtime & build dependencies
npm install

# Launch development environment (port 3000)
npm run dev
```

Visit `http://localhost:3000` in your web browser.

## 4. Production Build & Deployment
```bash
# Compile client bundle and assets
npm run build

# Start production server
npm start
```

## 5. Security Architecture
- Secrets and tokens are stripped before being passed to Gemini models.
- All Gemini API calls are server-authoritative (`server.ts`) via `@google/genai`.
- Personal access tokens and credentials are never sent to the browser bundle.
