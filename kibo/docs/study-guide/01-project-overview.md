# 01 – Project Overview & Vision

## What is Kibo?
Kibo is a **gamified career acceleration platform** built for software engineers and CS students actively seeking jobs. It transforms the chaotic, fragmented job hunt into a structured, data-driven, rewarding experience — similar to how Duolingo gamifies language learning.

**Full Name:** Kibo – The Intelligent Career Orchestration Platform
**Version:** 1.0.0 | **License:** MIT | **Repo:** `Cyrax321/kibo-v7`

## One-Liner (Elevator Pitch)
> "Kibo is a gamified career acceleration engine that transforms the chaotic job hunt into a data-driven, rewarding mission."

## The Problem We Solve

### Pain Points:
1. **Lack of Visibility** – Engineers track hundreds of applications across spreadsheets, email, and memory with no central dashboard
2. **Skill Decay** – Inconsistent coding practice between applications leads to poor interview performance
3. **Motivation Loss** – Job hunting is solitary; without structure, effort attrition is extremely high
4. **Data Fragmentation** – No single source of truth for interviews, study progress, and application health
5. **Burn-out** – The recruitment cycle is mentally exhausting without gamified structure
6. **No Accountability** – No progress tracking, no streaks, no rewards for consistent effort

### Why These Problems Exist:
- **No Unified Tools** – Existing solutions are either ATS-focused (for companies hiring) or resume builders (one-time use for candidates)
- **Isolation** – Career coaches are expensive ($200+/hr); peer support networks are unstructured
- **Information Overload** – Too many platforms (LinkedIn, Indeed, Glassdoor, AngelList) without aggregation
- **No Feedback Loop** – Users don't know what aspects of their job search strategy are working

### Why Now:
- **Remote Work Explosion** – More applications per opening; tracking is critical
- **Gen Z Workforce** – Digital natives expect gamified, engaging experiences in every tool
- **Developer Tools Renaissance** – Engineers are investing in personal productivity tools
- **AI Readiness** – Modern architecture supports future LLM integration for resume parsing, interview prep
- **Great Resignation Aftermath** – Continuous job mobility is the new normal

## Target Users

### Primary Persona: Active Job Seeker
- Junior to Senior Software Engineers
- Managing 50-200+ job applications simultaneously
- Needs visibility into pipeline health and conversion rates
- Wants accountability through gamification

### Secondary Persona: CS Student
- Preparing for internship seasons and campus placements
- Needs structured, progressive coding practice
- Values competitive elements (leaderboards, achievements)
- Wants certifications to showcase skills

### User Profile Fields (from database):
`full_name`, `headline`, `bio`, `avatar_url`, `skills[]`, `country`, `target`, `github_url`, `linkedin_url`, `portfolio_url`, `xp`, `level`, `streak`, `problems_solved`, `applications_count`

## Complete Feature List

### Implemented Features (v1.0):

| Category | Features |
|----------|----------|
| **Authentication** | Email/Password, Google OAuth, GitHub OAuth |
| **Application Tracking** | 6-stage Kanban board, Table view, CSV import/export, Reminders, Notes per app |
| **Code Practice** | Monaco editor (VS Code engine), 16 languages via Judge0 CE, Test case runner |
| **Assessments** | Quiz mode (MCQ, coding, short-answer), Timed assessments, Result breakdown |
| **Certifications** | Full exam engine, Anti-cheat tab detection, PDF certificate generation, Public verification |
| **Gamification** | XP system, Level progression, Streaks, Achievements, Real-time leaderboard |
| **Notes** | PlateJS rich editor (30+ plugins), Slash commands, Note sharing, DOCX export |
| **Networking** | Posts feed, Upvotes, Connection requests, Direct messages |
| **Learning** | Python course (3 tiers: beginner/intermediate/advanced), Progress tracking |
| **Schedule** | Event calendar, Interview scheduling, Contest reminders |
| **Dashboard** | 16 analytics widgets, Contribution heatmap, Funnel charts, Skills radar |
| **Notifications** | In-app bell, Push notifications, Real-time updates |
| **3D Elements** | GLTF mascot with DRACO compression, Three.js rendering |
| **Sound System** | 15 Web Audio API sounds (chimes, fanfares, pops) |
| **Responsive** | Full mobile + desktop support with TailwindCSS |

### NOT Implemented (Future Roadmap):
| Version | Feature |
|---------|---------|
| v1.1 | AI-powered resume parsing and auto-fill |
| v1.1 | Smart job recommendations |
| v1.2 | Browser extension for one-click job scraping |
| v1.2 | React Native mobile app |
| v2.0 | Mock interview marketplace |
| v2.0 | Peer-to-peer practice rooms |
| v2.0 | Team workspaces for cohort-based job hunting |

## Technology Stack Summary

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18.3, TypeScript 5.8, Vite 5.4, TailwindCSS 3.4 |
| **UI Library** | Shadcn UI (28 Radix primitives), Lucide icons |
| **State** | TanStack Query 5.83 (server state), React useState (local) |
| **Animation** | Framer Motion 11.18, canvas-confetti, CSS animations |
| **3D** | Three.js 0.160, React Three Fiber, Drei |
| **Editor** | PlateJS 52 (30+ plugins), Monaco Editor 4.7 |
| **Charts** | Recharts 2.15 |
| **Backend** | Supabase BaaS (PostgreSQL 15, Auth, Realtime, Storage) |
| **Code Exec** | Judge0 CE (public instance, 16 languages) |
| **PDF** | pdf-lib 1.17 |
| **Forms** | React Hook Form 7.61 + Zod 3.25 |
| **Routing** | React Router 6.30 |
| **DnD** | @dnd-kit (core + sortable) |

## Architecture Overview
- **Serverless** – No custom backend server
- **BaaS** – All business logic in PostgreSQL functions (Supabase RPC)
- **SPA** – Single Page Application with client-side routing
- **Realtime** – WebSocket connections for live updates
- **Lazy Loading** – All 20 pages use React.lazy() for code splitting
