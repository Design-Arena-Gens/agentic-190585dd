# AI Social Media Manager

A fully automated social media management platform that uses AI to discover trending topics, generate content, and post to multiple platforms.

## 🚀 Live Demo

**Deployed URL:** https://agentic-190585dd.vercel.app

## ✨ Features

### 1. **Trending Topic Discovery**
- Automatically fetches trending topics from multiple sources:
  - Google Trends
  - Reddit Hot Topics
  - Hacker News
  - Twitter/X (with API)
  - YouTube Trending (with API)
- Filter by language (English, Urdu, etc.) and region
- Popularity scoring system
- Manual approval/rejection workflow

### 2. **AI Content Generation**
- Generate unique posts using OpenAI GPT models
- Customize tone: Funny, Professional, or Informative
- Platform-specific content optimization
- Automatic hashtag generation
- AI-powered image creation with DALL-E

### 3. **Multi-Platform Support**
- Facebook, Instagram, Twitter/X, LinkedIn
- YouTube (Community Posts)
- Pinterest, Threads

### 4. **Admin Dashboard**
- Real-time analytics and statistics
- Post management (create, edit, delete, schedule)
- Trend discovery and approval
- Social account management
- Performance analytics with charts
- Engagement metrics tracking

### 5. **Automation Features**
- Auto-posting at configurable intervals
- Scheduled post publishing
- Automatic trend refresh
- Engagement tracking

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite with Prisma ORM
- **AI Services:** OpenAI (GPT-3.5 + DALL-E 3)
- **Charts:** Recharts
- **Deployment:** Vercel

## 📦 Quick Start

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and add your API keys
3. Initialize database: `npx prisma migrate dev --name init`
4. Run dev server: `npm run dev`
5. Open http://localhost:3000

## 🔑 API Keys Required

- **OpenAI:** For AI content and image generation
- **Social Media APIs:** For posting to platforms (optional)

See `.env.example` for all configuration options.

## 📊 Dashboard Pages

- **Dashboard:** Overview with stats and recent posts
- **Trends:** Discover and approve trending topics
- **Posts:** Manage and publish content
- **Analytics:** Performance metrics and charts
- **Accounts:** Connect social media platforms
- **Settings:** Configure automation and preferences

## 🚀 Deployment

Already deployed at: https://agentic-190585dd.vercel.app

To deploy your own:
```bash
vercel --prod
```

## 📝 Note

This is a personal automation tool. Ensure compliance with each platform's API terms of service.
