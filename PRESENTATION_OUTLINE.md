# Kibo – The Intelligent Career Orchestration Platform
## 90+ Slide Comprehensive Presentation

**Prepared for:** Academic Mini-Project Evaluation | Technical Architecture Review | Demo Day
**Repository:** `Cyrax321/kibo-v7` | **Date:** February 2026

---

# SECTION A – VISION & NARRATIVE (Slides 1–8)

---

## Slide 1: Title Slide

- **Logo:** Kibo (with animated 3D mascot – GLTF/DRACO compressed)
- **Tagline:** The Intelligent Career Orchestration Platform
- **Version:** 1.0.0 | **License:** MIT
- **Tech:** TypeScript 5.8 | React 18 | Supabase | TailwindCSS 3.4 | Vite 5.4

---

## Slide 2: One-Liner – What is Kibo

> "Kibo is a gamified career acceleration engine that transforms the chaotic job hunt into a data-driven, rewarding mission."

**Key Differentiators:**
- Kanban-style application tracking (6-stage pipeline)
- Real-time coding practice with Judge0 CE (16 languages)
- XP/streak/level gamification with Duolingo-style loops
- Rich-text notes with PlateJS (30+ plugins)
- Professional certification exam engine with PDF certificates
- Premium Web Audio API sound system (15 sound types)

---

## Slide 3: The Problem Space

| Problem | Impact |
|---------|--------|
| **Lack of Visibility** | Engineers track 100s of apps across spreadsheets, email, memory |
| **Skill Decay** | Inconsistent coding practice → poor interview performance |
| **Motivation Loss** | Solitary job hunting → high effort attrition |
| **Data Fragmentation** | No single source of truth for interviews, study, applications |
| **Burn-out** | Unstructured recruitment cycle is mentally exhausting |
| **No Accountability** | No gamification or tracking for job seekers |

---

## Slide 4: Why This Problem Exists

- **No Unified Tools:** ATS is for companies, resume builders are one-time use
- **Isolation:** Career coaches expensive; peer support unstructured
- **Information Overload:** LinkedIn, Indeed, Glassdoor without aggregation
- **No Feedback Loop:** Users can't measure what's working
- **No Engagement:** Traditional tools lack gamification

---

## Slide 5: Why Now

- **Remote Work Explosion:** More applications per opening; tracking critical
- **Gen Z Workforce:** Expects gamified, engaging experiences
- **Developer Tools Renaissance:** Engineers invest in productivity tools
- **AI Readiness:** Architecture supports future LLM integration
- **Great Resignation Aftermath:** Continuous job mobility is the norm

---

## Slide 6: Vision – Long-Term Roadmap

| Phase | Features | Status |
|-------|----------|--------|
| **v1.0 (Current)** | Gamified tracker + coding lab + certifications + notes | ✅ Done |
| **v1.1** | AI resume parsing and auto-fill | 🔮 Planned |
| **v1.2** | Browser extension for one-click job scraping | 🔮 Planned |
| **v2.0** | Mock interview marketplace + peer practice rooms | 🔮 Planned |

**Ultimate Vision:** The operating system for career development

---

## Slide 7: User Personas

**Primary – Active Job Seeker:**
- Junior to Senior Software Engineers
- Managing 50-200+ applications
- Needs pipeline visibility

**Secondary – CS Student:**
- Preparing for internships
- Needs structured coding practice
- Values leaderboards

**Profile Fields:** `full_name`, `headline`, `bio`, `avatar_url`, `skills[]`, `country`, `target`, `github_url`, `linkedin_url`, `portfolio_url`, `xp`, `level`, `streak`, `problems_solved`, `applications_count`

---

## Slide 8: Core Use Cases (Complete List)

1. Track Job Applications (Kanban + Table view + CSV import/export)
2. Practice Coding Problems (Monaco editor + Judge0 CE, 16 languages)
3. Take Assessments (Quiz mode: MCQ, coding, short-answer)
4. Earn Certifications (Timed exams, anti-cheat, PDF certificates)
5. Monitor Progress (XP, streaks, levels, achievements)
6. Compete on Leaderboard (Real-time global ranking)
7. Schedule Management (Calendar for interviews/events)
8. Networking (Connections, posts feed, direct messages)
9. Learning Path (Python course: beginner/intermediate/advanced)
10. Take Notes (PlateJS rich editor, sharing, slash commands)
11. View Analytics (Heatmap, funnels, skills radar, charts)

---

# SECTION B – PRODUCT DEEP DIVE (Slides 9–22)

---

## Slide 9: Complete User Journey

```
Landing Page → Sign Up (Email/Google/GitHub) → Dashboard (Mission Control)
  ├── Applications Tracker (Kanban + Table + Analytics)
  ├── Arena (Code Lab – 16 languages)
  ├── Assessments & Quizzes
  ├── Certifications (Timed Exams → PDF Certificates)
  ├── Notes (Rich PlateJS Editor)
  ├── Schedule (Calendar & Events)
  ├── Network (Posts, Connections)
  ├── Messages (Direct Chat)
  ├── Learning (Python Course)
  ├── Achievements & Leaderboard
  └── Profile & Settings
```

---

## Slide 10: Landing Page Deep Dive (9 Components)

| Component | File | Size | Description |
|-----------|------|------|-------------|
| Navbar | `Navbar.tsx` | 8.8KB | Responsive nav, mobile menu, CTA buttons |
| HeroSection | `HeroSection.tsx` | 15.1KB | Animated hero, feature pills, trust badges |
| CompanyTicker | `CompanyTicker.tsx` | 4.2KB | Auto-scrolling company logos carousel |
| FeaturesSection | `FeaturesSection.tsx` | 5.9KB | Feature cards with icons |
| HowItWorksSection | `HowItWorksSection.tsx` | 2.9KB | Step-by-step onboarding guide |
| TestimonialsSection | `TestimonialsSection.tsx` | 7.7KB | User testimonials carousel |
| FAQSection | `FAQSection.tsx` | 3.0KB | Accordion FAQ |
| CTASection | `CTASection.tsx` | 4.7KB | Call-to-action signup |
| Footer | `Footer.tsx` | 4.8KB | Links, social, copyright |

---

## Slide 11: Authentication & Onboarding

**Login (`Login.tsx` – 15KB):**
- "Welcome back, commander" messaging
- Feature pills, trust badges (encryption, SOC 2)
- Google & GitHub OAuth quick-start
- Email/password with validation

**Signup (`Signup.tsx` – 16.6KB):**
- Multi-field registration with Zod validation
- React Hook Form integration
- OAuth alternatives, terms acceptance

**Post-Auth Triggers:**
- Profile auto-created via Supabase DB trigger
- `initDailyActivity()` for streak tracking
- Login greeting email (fire-and-forget)

---

## Slide 12: Dashboard – Mission Control (16 Widgets)

| # | Widget | File | Size | Purpose |
|---|--------|------|------|---------|
| 1 | StatsHUD | `StatsHUD.tsx` | 10.5KB | XP, Level, Streak, Problems, Apps |
| 2 | TheGarden | `TheGarden.tsx` | 9.7KB | 365-day contribution heatmap |
| 3 | ProgressCharts | `ProgressCharts.tsx` | 13.2KB | XP/problems/apps trend lines |
| 4 | DailyFocus | `DailyFocus.tsx` | 10.2KB | To-do + streak integration |
| 5 | ApplicationFunnel | `ApplicationFunnel.tsx` | 7.0KB | Conversion rates |
| 6 | SkillsRadar | `SkillsRadar.tsx` | 5.5KB | Strength chart |
| 7 | StreakCalendar | `StreakCalendar.tsx` | 4.8KB | Monthly activity |
| 8 | CodeLabDashboard | `CodeLabDashboard.tsx` | 7.1KB | Problem-solving stats |
| 9 | CodeLabAnalytics | `CodeLabAnalytics.tsx` | 8.7KB | Code practice analytics |
| 10 | LiveActivityFeed | `LiveActivityFeed.tsx` | 7.2KB | Real-time activity stream |
| 11 | QuickActions | `QuickActions.tsx` | 2.4KB | Shortcut buttons |
| 12 | WeeklyGoals | `WeeklyGoals.tsx` | 4.6KB | Weekly targets |
| 13 | WeeklyComparison | `WeeklyComparison.tsx` | 5.4KB | Week-over-week compare |
| 14 | SuccessRateGauge | `SuccessRateGauge.tsx` | 5.6KB | Success rate dial |
| 15 | ActivityHistory | `ActivityHistory.tsx` | 12.0KB | Historical activity |
| 16 | DashboardHeader | `DashboardHeader.tsx` | 0.9KB | Welcome header |

---

## Slide 13: StatsHUD & TheGarden Widgets

**StatsHUD (10.5KB):**
- Gaming-style HUD with animated counters
- Metrics: XP, Level, Streak, Problems Solved, Apps Tracked, Achievements
- `useGamification()` hook for live data
- Framer Motion on mount + data changes
- Recharts progress visualization

**TheGarden (9.7KB):**
- GitHub-style 365-day contribution heatmap
- Tracks: XP, problems, applications, assessments per day
- Color intensity = activity level
- Tooltip with daily breakdown
- Data: `getDailyActivities(userId)` → `daily_activities` table

---

## Slide 14: Dashboard Charts & Analytics Widgets

**ProgressCharts (13.2KB):** Multi-line trend charts (XP, problems, apps over time)
**ApplicationFunnel (7.0KB):** Funnel chart showing conversion per stage
**SkillsRadar (5.5KB):** Radar chart of skill category strengths
**CodeLabAnalytics (8.7KB):** Detailed code practice statistics
**WeeklyComparison (5.4KB):** Side-by-side week vs prior week
**SuccessRateGauge (5.6KB):** Circular gauge for app success rate
**All powered by Recharts 2.15.4**

---

## Slide 15: Application Tracker – Kanban Board (7 Components)

| Component | File | Size | Purpose |
|-----------|------|------|---------|
| Applications | `Applications.tsx` | 15.9KB | Main page: Kanban + Table toggle |
| AddApplicationDialog | `AddApplicationDialog.tsx` | 17.6KB | Modal form for new apps |
| ApplicationDetailPanel | `ApplicationDetailPanel.tsx` | 17.0KB | Side panel detail view |
| ApplicationNotes | `ApplicationNotes.tsx` | 3.0KB | Per-application notes |
| ApplicationReminders | `ApplicationReminders.tsx` | 11.8KB | Deadline/reminder mgmt |
| ApplicationStats | `ApplicationStats.tsx` | 4.6KB | Analytics tab |
| ApplicationTableView | `ApplicationTableView.tsx` | 15.4KB | Table view alternative |
| ImportExportTools | `ImportExportTools.tsx` | 12.4KB | CSV import/export |

**Kanban:** 6 columns: Wishlist → Applied → OA → Technical → HR → Offer
**DnD:** `@dnd-kit/core` + `@dnd-kit/sortable`
**XP:** `recordApplicationUpdate()` awards XP on status changes
**Confetti + Sound:** `canvas-confetti` + `playOffer()` on reaching "Offer"

---

## Slide 16: Application Tracker – Add & Import/Export

**AddApplicationDialog (17.6KB):**
- Fields: Company, Role, Job URL, Salary, Location, Remote/Hybrid/Onsite
- Status picker, Priority (High/Normal), Notes
- React Hook Form + Zod validation
- On Submit: Supabase insert + `awardXP('application_added')` + sound

**ImportExportTools (12.4KB):**
- CSV Import: Parse, map columns, bulk insert
- CSV Export: Download all applications
- Column mapping UI for flexible import
- Progress indicator

**ApplicationReminders (11.8KB):**
- Per-app deadlines and reminders
- Upcoming reminders panel
- `react-day-picker` date picker

---

## Slide 17: Arena – Code Lab (57KB)

**File:** `Arena.tsx` (57,297 bytes – largest file)

- Monaco Editor (VS Code engine) with IntelliSense
- 16 programming languages
- Problem description with markdown rendering
- Test case runner (expected vs actual)
- Runtime statistics display
- Difficulty badges: Easy / Medium / Hard
- Company + topic tags per problem
- XP on solve via `recordProblemSolved(difficulty)`
- Confetti celebration on correct solutions

---

## Slide 18: Code Execution Engine – Judge0 CE

**File:** `codeExecutor.ts` (5,843 bytes)
**API:** `ce.judge0.com` (public, no API key required)

| Language | ID | Language | ID |
|----------|----|----------|----|
| JavaScript | 63 | Go | 60 |
| Python | 71 | Rust | 73 |
| C++ | 54 | Kotlin | 78 |
| C | 50 | Swift | 83 |
| Java | 62 | Ruby | 72 |
| TypeScript | 74 | PHP | 68 |
| C# | 51 | R | 80 |
| Perl | 85 | Bash | 46 |

**Functions:** `executeCode()`, `runTestCases()`, `normalizeOutput()`, `b64Encode()`, `b64Decode()`
**Status Codes:** Accepted(3), CompileError(6), TLE(5), RuntimeError(7-12)

---

## Slide 19: Assessments & Quiz System (7 Components)

| Component | Size | Purpose |
|-----------|------|---------|
| `Assessments.tsx` | 21.0KB | Main hub page |
| `AssessmentMode.tsx` | 24.1KB | Timed assessment UI |
| `QuizMode.tsx` | 12.2KB | Interactive quiz |
| `QuizCard.tsx` | 3.7KB | Quiz card component |
| `AssessmentCard.tsx` | 2.3KB | Assessment card |
| `ResultDialog.tsx` | 4.3KB | Score display |
| `quizData.ts` | 24.1KB | 50+ questions |

**Question Types:** MCQ, Coding, Short Answer
**Features:** Timer, score tracking, progress bar, result breakdown
**XP:** `recordAssessmentCompleted()` awards XP

---

## Slide 20: Certification Exam Engine (4 Components + Data)

| Component | Size | Purpose |
|-----------|------|---------|
| `ExamEngine.tsx` | 45.9KB | Full-screen timed exam (2nd largest file) |
| `ResultBreakdown.tsx` | 18.7KB | Score analysis + certificate generation |
| `VerifyCertificate.tsx` | 10.4KB | Public verification (no auth) |
| `types.ts` | 5.7KB | TypeScript interfaces |

**Data Files:**
- `certQuestionBank.ts` – 42.1KB (200+ exam questions)
- `certificationData.ts` – 8.7KB (certificate definitions)

**Features:** Anti-cheat tab-switch detection, question navigation, mark for review, auto-submit on expiry, PDF certificate via `pdf-lib`, `useCertifications.ts` hook (11.9KB)

---

## Slide 21: Notes System – PlateJS Rich Editor (5 Components)

| Component | Size | Purpose |
|-----------|------|---------|
| `NoteEditor.tsx` | 20.4KB | PlateJS rich-text editor |
| `NotesSidebar.tsx` | 11.9KB | Note list, search, filter |
| `ShareNoteDialog.tsx` | 9.0KB | Token-based sharing |
| `SlashCommandMenu.tsx` | 5.6KB | Notion-style "/" commands |
| `PremiumGate.tsx` | 1.8KB | Premium feature gating |

**30+ PlateJS Plugins:** Bold, italic, headings, code blocks, lists, tables, callouts, toggles, math equations, emoji, links, media, DnD blocks, slash commands, mentions, comments, suggestions, markdown I/O, DOCX I/O, Excalidraw diagrams, AI suggestions

**Hook:** `useNotes.ts` (9.1KB) – CRUD, auto-save with debounce, tags, pin, archive, share tokens, Supabase realtime sync

**Pages:** `Notes.tsx` (5.5KB), `SharedNote.tsx` (6.4KB)

---

## Slide 22: Developer & Admin Tooling

| File | Location | Purpose |
|------|----------|---------|
| `remove_bg.py` | `/` | Utility script for removing image backgrounds. Likely used for asset preparation. |
| `load_kibo_course.py`| `kibo/scripts/` | Python script to populate the `pythonCourse.ts` data file from an external source. |

---

## Slide 22b: Additional Feature Modules

**Schedule (`Schedule.tsx` – 25.1KB):**
- Full calendar view with event management
- 3 sub-components: event forms, upcoming panel, calendar grid
- Interview scheduling, contest reminders

**Network (`Network.tsx` – 14.8KB):**
- Social feed with posts and upvotes
- Connection requests (send/accept/reject)
- 5 sub-components: post creation, feed, user cards, connection list

**Messages (`Messages.tsx` – 10.7KB):**
- Direct messaging between connected users
- 3 sub-components: conversation list, chat window, message input
- Real-time via Supabase channels

**Learning (`Learning.tsx` – 345 bytes):**
- Python course viewer
- `pythonCourse.ts` (33KB) – 3 tiers: Beginner, Intermediate, Advanced
- Progress tracking via `course-progress.ts`

**Contests (`Contests.tsx` – 12.2KB):** Competitive programming contests
**Playground (`Playground.tsx` – 19.1KB):** Free-form code playground
**Achievements (`Achievements.tsx` – 13.8KB):** Achievement gallery
**Profile (`Profile.tsx` – 18.9KB):** User profile with stats & social
**Settings (`Settings.tsx` – 9.2KB):** Preferences & account management

---

# SECTION C – FRONTEND ARCHITECTURE (Slides 23–35)

---

## Slide 23: Complete Dependency List (80+ packages)

**Core Framework:**
| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI framework |
| react-dom | 18.3.1 | DOM rendering |
| typescript | 5.8.3 | Type safety |
| vite | 5.4.19 | Build tool + HMR |
| tailwindcss | 3.4.17 | Utility CSS |

**UI Components (Radix Primitives – 28 packages):**
`accordion`, `alert-dialog`, `aspect-ratio`, `avatar`, `checkbox`, `collapsible`, `context-menu`, `dialog`, `dropdown-menu`, `hover-card`, `label`, `menubar`, `navigation-menu`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `slider`, `slot`, `switch`, `tabs`, `toast`, `toggle`, `toggle-group`, `toolbar`, `tooltip`

**Rich Editor (PlateJS – 30 packages):** `@platejs/ai`, `autoformat`, `basic-nodes`, `basic-styles`, `callout`, `caption`, `code-block`, `code-drawing`, `combobox`, `comment`, `date`, `dnd`, `docx`, `docx-io`, `emoji`, `excalidraw`, `floating`, `indent`, `juice`, `layout`, `link`, `list`, `markdown`, `math`, `media`, `mention`, `resizable`, `selection`, `slash-command`, `suggestion`, `table`, `toc`, `toggle`

**State & Data:** `@tanstack/react-query` 5.83, `@supabase/supabase-js` 2.93, `zod` 3.25, `react-hook-form` 7.61
**Animation:** `framer-motion` 11.18, `canvas-confetti` 1.9
**3D:** `three` 0.160, `@react-three/fiber` 8.18, `@react-three/drei` 9.122
**Charts:** `recharts` 2.15
**DnD:** `@dnd-kit/core` 6.3, `@dnd-kit/sortable` 10.0, `react-dnd` 16.0
**Editor:** `@monaco-editor/react` 4.7
**PDF:** `pdf-lib` 1.17, `html2canvas-pro` 2.0
**Icons:** `lucide-react` 0.462
**Dates:** `date-fns` 3.6, `react-day-picker` 9.13
**Routing:** `react-router-dom` 6.30
**Toast:** `sonner` 1.7
**Upload:** `@uploadthing/react` 7.3, `uploadthing` 7.7, `use-file-picker` 2.1
**Other:** `cmdk` 1.1, `vaul` 0.9, `embla-carousel-react` 8.6, `lodash` 4.17, `dedent` 1.0, `@number-flow/react` 0.5, `react-player` 3.3, `react-tweet` 3.3, `react-lite-youtube-embed` 3.5, `react-resizable-panels` 2.1, `react-textarea-autosize` 8.5, `remark-gfm` 4.0, `remark-math` 6.0, `lowlight` 3.3, `class-variance-authority` 0.7, `clsx` 2.1, `tailwind-merge` 2.6, `tailwind-scrollbar-hide` 4.0, `tailwindcss-animate` 1.0, `@udecode/cn` 52.0, `next-themes` 0.3, `input-otp` 1.4, `@faker-js/faker` 10.3, `@emoji-mart/data` 1.2, `@ariakit/react` 0.4, `@ai-sdk/react` 2.0, `ai` 5.0, `three-stdlib` 2.36

**Dev Dependencies:** `@vitejs/plugin-react-swc`, `eslint` 9.32, `vitest` 3.2, `@testing-library/react` 16.0, `jsdom` 20.0, `autoprefixer`, `postcss`, `@tailwindcss/typography`

---

## Slide 24: Frontend Folder Structure

```
src/                          (376 files total)
├── App.tsx                   # Root: routing, providers, preloader
├── main.tsx                  # Entry point, React DOM render
├── index.css                 # Global styles (11.5KB), Tailwind imports
├── vite-env.d.ts             # Vite type declarations
│
├── pages/                    # 20 route-level page components
│   ├── Index.tsx (2KB)       ├── Login.tsx (15KB)
│   ├── Signup.tsx (16.6KB)   ├── Dashboard.tsx (8.6KB)
│   ├── Applications.tsx (15.9KB) ├── Arena.tsx (57.2KB)
│   ├── Playground.tsx (19.1KB) ├── Assessments.tsx (21KB)
│   ├── Contests.tsx (12.2KB) ├── Schedule.tsx (25.1KB)
│   ├── Network.tsx (14.8KB)  ├── Messages.tsx (10.7KB)
│   ├── Profile.tsx (18.9KB)  ├── Achievements.tsx (13.8KB)
│   ├── Settings.tsx (9.2KB)  ├── Learning.tsx (345B)
│   ├── Certifications.tsx (27.9KB) ├── Notes.tsx (5.5KB)
│   ├── SharedNote.tsx (6.4KB) └── NotFound.tsx (727B)
│
├── components/               # 298 components across 19 directories
│   ├── ui/                   # 157 Shadcn/Radix primitives
│   ├── dashboard/            # 16 dashboard widgets
│   ├── applications/         # 7 ATS components
│   ├── arena/                # 4 code lab components
│   ├── assessments/          # 7 quiz/assessment components
│   ├── certifications/       # 4 exam engine components
│   ├── editor/               # 65 PlateJS editor components
│   ├── landing/              # 11 marketing page components
│   ├── layout/               # 2 (AppLayout, AppSidebar)
│   ├── leaderboard/          # 1 (RealtimeLeaderboard)
│   ├── learning/             # 1 (course viewer)
│   ├── messages/             # 3 (chat components)
│   ├── network/              # 5 (social components)
│   ├── notes/                # 5 (PlateJS note components)
│   ├── notifications/        # 1 (NotificationBell)
│   ├── onboarding/           # (empty/placeholder)
│   ├── profile/              # 1 (profile display)
│   ├── schedule/             # 3 (calendar components)
│   ├── kibo/                 # 4 (brand: logo, mascot, pricing)
│   └── NavLink.tsx           # Navigation link component
│
├── hooks/                    # 12 custom React hooks
│   ├── useGamification.ts (10.3KB)
│   ├── useCertifications.ts (11.9KB)
│   ├── useNotes.ts (9.1KB)
│   ├── useAppNotifications.ts (7.1KB)
│   ├── usePushNotifications.ts (4.5KB)
│   ├── useScrollReveal.ts (1.7KB)
│   ├── use-toast.ts (3.9KB)
│   ├── use-upload-file.ts (3.2KB)
│   ├── use-debounce.ts (474B)
│   ├── use-is-touch-device.ts (545B)
│   ├── use-mobile.tsx (576B)
│   └── use-mounted.ts (199B)
│
├── lib/                      # 7 utility modules
│   ├── gamification.ts (6.8KB)   # XP/level/streak engine
│   ├── codeExecutor.ts (5.8KB)   # Judge0 CE integration
│   ├── sounds.ts (14.9KB)        # Web Audio sound system
│   ├── course-progress.ts (1.2KB)# Learning progress
│   ├── markdown-joiner-transform.ts (6.6KB)
│   ├── uploadthing.ts (508B)     # File upload config
│   └── utils.ts (169B)           # cn() helper
│
├── data/                     # 3 static data files
│   ├── certQuestionBank.ts (42.1KB) # 200+ exam questions
│   ├── pythonCourse.ts (33KB)       # Full Python curriculum
│   └── certificationData.ts (8.7KB)# Cert definitions
│
├── integrations/supabase/    # Supabase client + types
│   ├── client.ts             # Supabase client init
│   └── types.ts              # Auto-generated TypeScript types
│
├── assets/                   # Static assets
│   ├── kibo-logo.png (14KB)
│   ├── kibo-python-course.jpg (153KB)
│   ├── python-beginner.jpg (203KB)
│   ├── python-intermediate.jpg (173KB)
│   ├── python-advanced.jpg (247KB)
│   ├── logos/                # 15 company/tech logos
│   └── 3D/                   # 3D model assets
│
├── app/                      # API route handlers (Next.js-style)
│   └── api/
│       ├── ai/
│       │   ├── command/      # PlateJS AI command endpoint (route.ts 8.3KB, utils.ts 8.7KB)
│       │   │   └── prompt/   # 7 prompt-building files
│       │   └── copilot/      # AI autocomplete endpoint (route.ts 963B)
│       └── uploadthing/      # Uploadthing file upload handler (route.ts 184B)
└── test/                     # 2 test files
    ├── example.test.ts       # Example test file
    └── setup.ts              # Test setup file
```

---

## Slide 24b: Documentation Structure

```
/
├── README.md                 # Project overview
├── docs/                     # Detailed documentation
│   └── presentation/         # (empty)
└── presentation-docs/        # Presentation-specific markdown files
    ├── 01-project-overview.md
    ├── 02-backend.md
    ├── 03-frontend.md
    ├── 04-api-reference.md
    ├── 05-gamification-system.md
    ├── 06-learning-certification.md
    ├── 07-presentation-qa.md
    ├── 08-quick-reference.md
    └── README.md
```

---

## Slide 25: Complete Routing Table (25 Routes)

| Route | Component | Auth | Description |
|-------|-----------|------|-------------|
| `/` | Index (Landing) | No | Marketing landing page |
| `/login` | Login | No | Authentication |
| `/signup` | Signup | No | Registration |
| `/dashboard` | Dashboard | Yes | Mission Control |
| `/applications` | Applications | Yes | Job tracker |
| `/arena` | Arena | Yes | Code Lab |
| `/playground` | Playground | Yes | Free-form coding |
| `/assessments` | Assessments | Yes | Quizzes & tests |
| `/contests` | Contests | Yes | Competitive coding |
| `/schedule` | Schedule | Yes | Calendar |
| `/network` | Network | Yes | Social feed |
| `/messages` | Messages | Yes | Direct chat |
| `/profile` | Profile | Yes | Own profile |
| `/profile/:userId` | Profile | Yes | Public profile view |
| `/achievements` | Achievements | Yes | Achievement gallery |
| `/settings` | Settings | Yes | Preferences |
| `/learning` | Learning | Yes | Python course |
| `/certifications` | Certifications | Yes | Cert catalog |
| `/certifications/:certId/exam` | ExamEngine | Yes | Take exam |
| `/certifications/:certId/result/:attemptId` | ResultBreakdown | Yes | Exam results |
| `/verify/:certificateId` | VerifyCertificate | No | Public cert verify |
| `/notes` | Notes | Yes | Note listing |
| `/notes/:noteId` | Notes | Yes | Specific note |
| `/shared/:shareToken` | SharedNote | No | Shared note view |
| `*` | NotFound | No | 404 page |

**All pages lazy-loaded via `React.lazy()` for code splitting**

---

## Slide 26: Component Architecture

**Design Principles:**
- Atomic Design: UI primitives in `components/ui/`, composed into features
- Co-location: Feature components live with their pages
- Lazy Loading: All 20 pages use `React.lazy()` for code splitting
- Motion-Enhanced: Framer Motion for entry/exit animations

**Provider Hierarchy:**
```
<App>
  <QueryClientProvider>     ← TanStack Query cache
    <TooltipProvider>       ← Radix tooltips
      <Toaster />           ← Shadcn toast
      <Sonner />            ← Sonner toast
      <Preloader />         ← 3D asset preloader
      <BrowserRouter>       ← React Router
        <Suspense>          ← Lazy loading fallback
          <Routes>          ← 25 route definitions
            <AppLayout>     ← Sidebar + main content
              <Page />      ← Actual page component
            </AppLayout>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
</App>
```

---

## Slide 26b: UI Component Library Deep Dive

The `components/ui` directory contains 157 files, forming a comprehensive design system built on Shadcn UI and Radix UI primitives. This enables rapid, consistent, and accessible UI development.

**Component Categories:**
- **Layout:** `AspectRatio`, `Card`, `Resizable`, `ScrollArea`, `Separator`, `Sheet`, `Drawer`, `Sidebar`
- **Navigation:** `Accordion`, `Breadcrumb`, `Carousel`, `DropdownMenu`, `Menubar`, `NavigationMenu`, `Pagination`, `Tabs`, `Toolbar`
- **Forms & Inputs:** `Button`, `Checkbox`, `ComboBox`, `DatePicker`, `Form`, `Input`, `InputOTP`, `Label`, `RadioGroup`, `Select`, `Slider`, `Switch`, `Textarea`, `Toggle`, `ToggleGroup`
- **Feedback & Display:** `Alert`, `AlertDialog`, `Avatar`, `Badge`, `Calendar`, `Progress`, `Skeleton`, `Toast`, `Toaster`, `Sonner`, `Tooltip`
- **Overlays & Popups:** `ContextMenu`, `Dialog`, `HoverCard`, `Popover`
- **Editor Specific:** A vast array of components for the PlateJS editor, including toolbars, node renderers, and menus.

---

## Slide 27: State Management Strategy

**Server State (TanStack Query 5.83):**
- All Supabase data fetching via `useQuery` / `useMutation`
- Automatic caching, background refetch, stale-while-revalidate
- Query keys: `['userStats', userId]`, `['dailyActivities', userId]`, etc.

**Client State:**
- React `useState` for local UI state
- No global state library (no Redux/Zustand)
- Auth state via Supabase `onAuthStateChange()` listener

**Realtime Updates:**
- Supabase Realtime channels for live sync
- `postgres_changes` events on tables
- Query invalidation on remote changes

**Example:**
```typescript
const { data } = useQuery({
  queryKey: ['userStats', userId],
  queryFn: () => getUserStats(userId),
  enabled: !!userId,
});

supabase.channel('gamification')
  .on('postgres_changes', { table: 'profiles' }, () => {
    queryClient.invalidateQueries(['userStats', userId]);
  })
  .subscribe();
```

---

## Slide 28: Shadcn UI Component Library (157 Components)

**28 Radix Primitive Categories:**
Accordion, AlertDialog, AspectRatio, Avatar, Checkbox, Collapsible, ContextMenu, Dialog, DropdownMenu, HoverCard, Label, Menubar, NavigationMenu, Popover, Progress, RadioGroup, ScrollArea, Select, Separator, Slider, Slot, Switch, Tabs, Toast, Toggle, ToggleGroup, Toolbar, Tooltip

**Additional Shadcn Components:**
Button (variants: default, destructive, outline, secondary, ghost, link)
Card, Badge, Calendar, Carousel, Command, DataTable, Drawer, Form, Input, InputOTP, Pagination, ResizablePanels, Sheet, Skeleton, Sonner, Table, Textarea

**Design System:** `class-variance-authority` + `tailwind-merge` + `clsx` for variant management

---

## Slide 29: 3D Mascot System

**Components:**
- `KiboMascot3D.tsx` (6.4KB) – Three.js GLTF model renderer
- `KiboCompanion.tsx` (3.8KB) – Interactive companion wrapper
- `KiboLogo.tsx` (2.9KB) – Animated logo component

**Technology:**
- Three.js 0.160 + React Three Fiber 8.18 + Drei 9.122
- GLTF format with DRACO compression (`kibo-new.glb`)
- DRACO decoder from Google CDN
- Preloaded at app start: `useLoader.preload(GLTFLoader, '/kibo-new.glb')`
- `<Preloader />` component blocks UI until 3D assets ready

**Asset Preloading (App.tsx):**
```typescript
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
dracoLoader.setDecoderConfig({ type: "js" });
useLoader.preload(GLTFLoader, "/kibo-new.glb", (loader) => {
  loader.setDRACOLoader(dracoLoader);
});
```

---

## Slide 30: Animations & Motion System

**Framer Motion (11.18.2):**
- Page enter/exit transitions
- Component mount animations
- Hover/tap micro-interactions
- Layout animations for list reordering
- Stagger animations for dashboard widgets

**Canvas Confetti (1.9.4):**
- Celebration on "Offer" status
- Problem solved correctly
- Assessment passed
- Achievement unlocked
- Level up events

**CSS Animations (TailwindCSS):**
- `tailwindcss-animate` for utility animations
- Pulse, spin, bounce, fade effects
- Custom keyframes in `index.css`
- Hover transforms on cards
- Loading spinners (`Loader2` from Lucide)


---

## Slide 31: Premium Sound System (15 Sound Types)

**File:** `sounds.ts` (14,999 bytes)
**Technology:** Web Audio API (no external audio files)

| Sound Type | Trigger | Style |
|------------|---------|-------|
| `messageReceived` | New message arrives | Pleasant ascending chime |
| `messageSent` | Message sent | Subtle whoosh confirmation |
| `connectionRequest` | Connection request received | Friendly ping |
| `connectionAccepted` | Connection accepted | Warm celebratory |
| `achievement` | Achievement unlocked | Epic fanfare |
| `levelUp` | Level up event | Triumphant ascending arpeggio |
| `xpGained` | XP awarded | Soft confirmation tone |
| `notification` | General notification | Soft bell |
| `success` | Generic success | Satisfying confirmation |
| `like` | Post upvoted | Duolingo-style bubble pop |
| `comment` | Post commented | Soft notification |
| `offer` | Application reaches "Offer" | Epic celebration fanfare |
| `quizPassed` | Quiz/exam passed | Triumphant chime |
| `applicationAdded` | New application created | Rich game reward |

**Functions:** `playSound(type, config)`, `initSoundSystem()`, `isSoundSupported()`
**Config:** `{ enabled: true, volume: 0.5 }`
**Sound generation:** `createChime()` using oscillators (sine, triangle, square waves)

---

## Slide 32: PlateJS Editor System (65 Components)

**Directory:** `src/components/editor/` (65 files)
**Core Library:** PlateJS 52.0.17

**Plugin Architecture:**
| Category | Plugins |
|----------|---------|
| **Formatting** | `@platejs/basic-styles` (bold, italic, underline, strikethrough) |
| **Structure** | `@platejs/basic-nodes` (paragraph, heading, blockquote) |
| **Lists** | `@platejs/list` (ordered, unordered, checklists) |
| **Code** | `@platejs/code-block` with `lowlight` syntax highlighting |
| **Tables** | `@platejs/table` (row/column operations) |
| **Media** | `@platejs/media` (images, videos, embeds) |
| **Links** | `@platejs/link` (auto-detect, edit popover) |
| **Math** | `@platejs/math` (LaTeX equations) |
| **Callouts** | `@platejs/callout` (info, warning, error boxes) |
| **Toggles** | `@platejs/toggle` (collapsible sections) |
| **Emoji** | `@platejs/emoji` + `@emoji-mart/data` |
| **Mentions** | `@platejs/mention` (user autocomplete) |
| **Comments** | `@platejs/comment` (inline comments) |
| **Suggestions** | `@platejs/suggestion` (tracked changes) |
| **DnD** | `@platejs/dnd` (drag block reordering) |
| **Indent** | `@platejs/indent` (tab indentation) |
| **AutoFormat** | `@platejs/autoformat` (markdown shortcuts) |
| **Slash Cmd** | `@platejs/slash-command` (/ menu) |
| **Combobox** | `@platejs/combobox` (autocomplete) |
| **AI** | `@platejs/ai` (AI-powered suggestions) |
| **Excalidraw** | `@platejs/excalidraw` (diagrams) |
| **DOCX** | `@platejs/docx-io` (Word import/export) |
| **Markdown** | `@platejs/markdown` (MD import/export) |
| **TOC** | `@platejs/toc` (table of contents) |
| **Layout** | `@platejs/layout` (column layouts) |
| **Caption** | `@platejs/caption` (media captions) |
| **Resizable** | `@platejs/resizable` (resize media) |
| **Selection** | `@platejs/selection` (block selection) |
| **Floating** | `@platejs/floating` (floating toolbar) |
| **Juice** | `@platejs/juice` (inline CSS) |
| **Date** | `@platejs/date` (date picker) |

---

## Slide 33: Frontend–Backend Interaction Patterns

**UI Event → API Call Mapping:**

| User Action | Handler | Supabase Call |
|-------------|---------|---------------|
| Login | `supabase.auth.signInWithPassword` | Auth API |
| Add Application | `supabase.from('applications').insert()` | REST + Realtime |
| Drag to Offer | `supabase.from('applications').update()` | REST |
| Solve Problem | `supabase.rpc('record_problem_solved')` | RPC |
| Award XP | `supabase.rpc('award_xp')` | RPC |
| View Leaderboard | `supabase.from('profiles').select()` | REST |
| Send Message | `supabase.from('messages').insert()` | REST + Realtime |
| Create Note | `supabase.from('notes').insert()` | REST |
| Share Note | `supabase.from('note_shares').insert()` | REST |
| Take Exam | `supabase.from('assessment_attempts').insert()` | REST |
| Upload Avatar | `uploadthing` → Storage | External + Storage |

---

## Slide 34: Error Handling & Validation

**Frontend Validation:** Zod schemas + React Hook Form (`@hookform/resolvers`)
**Toast System:** Dual: Shadcn Toaster + Sonner for different contexts
**Error Categories:**

| Type | Handling |
|------|----------|
| Auth errors | Redirect to `/login` |
| Network errors | Toast + retry option |
| Validation errors | Form field highlighting |
| RLS violations | Generic "unauthorized" toast |
| Code execution errors | Display in output panel |
| 3D load failures | Preloader skip/retry |

**Optimistic UI Pattern:**
```typescript
const { error } = await supabase.from('applications').update(data);
if (error) {
  setApplications(prev => prev.map(a =>
    a.id === id ? { ...a, status: oldStatus } : a
  ));
  toast({ title: "Error", variant: "destructive" });
}
```

---

## Slide 35: Responsive Design & Theming

**Breakpoints (TailwindCSS):** `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`, `2xl:1536px`
**Mobile Detection:** Custom `use-mobile.tsx` hook (576B)
**Touch Detection:** `use-is-touch-device.ts` (545B)
**Theme:** `next-themes` for dark/light mode
**Custom Tailwind Config (`tailwind.config.ts` – 5.6KB):**
- Custom color palette with CSS variables
- Extended animations (accordion, collapsible, sidebar)
- Typography plugin (`@tailwindcss/typography`)
- Scrollbar hide plugin
- Animate plugin (`tailwindcss-animate`)
- Custom border-radius, keyframes, font families

---

# SECTION D – BACKEND ARCHITECTURE (Slides 36–48)

---

## Slide 36: Backend Tech Stack

| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service (BaaS) |
| **PostgreSQL 15** | Primary database |
| **Supabase Auth** | Authentication (Email + OAuth) |
| **Supabase Realtime** | WebSocket pub/sub for live updates |
| **Supabase RPC** | Server-side PostgreSQL functions |
| **PostgREST** | Auto-generated REST API from schema |
| **Row Level Security** | Authorization at database level |
| **Judge0 CE** | External code execution API |
| **Uploadthing** | File upload service |

**Serverless Architecture:** No custom backend server. All business logic in PostgreSQL functions. Frontend directly communicates with Supabase.

---

## Slide 37: Database Schema – Complete Entity List

| Table | Description | Key Fields |
|-------|-------------|------------|
| `profiles` | User gamification & social data | xp, level, streak, skills[], avatar_url |
| `applications` | Job application tracking | company, role, status, salary, location |
| `coding_problems` | Problem definitions | title, description, difficulty, test_cases |
| `submissions` | User code submissions | code, language, status, runtime_ms |
| `achievements` | Achievement definitions | name, description, requirement_type |
| `user_achievements` | Unlocked achievements | user_id, achievement_id, unlocked_at |
| `notifications` | In-app notifications | title, body, type, is_read |
| `connections` | User connections | user_id_1, user_id_2, status |
| `messages` | Direct messages | sender_id, receiver_id, content |
| `posts` | Network feed posts | content, post_type, upvotes |
| `post_upvotes` | Post reactions | post_id, user_id |
| `assessment_attempts` | Exam attempts | answers, score, status |
| `study_sessions` | Study time tracking | duration_minutes, topic |
| `user_course_progress` | Course progress | completed_lessons[], unlocked_hints[] |
| `xp_config` | XP value configuration | id (action), xp_value |
| `skills` | Skill definitions | name, category |
| `daily_activities` | Daily activity tracking | xp_earned, problems_solved, etc. |
| `level_thresholds` | Level progression | level, xp_required, title |
| `notes` | User notes | title, content, tags[], color, is_pinned |
| `note_shares` | Shared notes | share_token, access_level, is_active |
| `calendar_events` | Schedule events | title, start_time, end_time, type |

---

## Slide 38: Database Migrations (12 Migration Files)

| Migration | Date | Size | Purpose |
|-----------|------|------|---------|
| `20260203095627_*.sql` | Feb 3 | 4.6KB | Initial schema: profiles, applications |
| `20260203095646_*.sql` | Feb 3 | 257B | Additional table configs |
| `20260203105617_*.sql` | Feb 3 | 15.4KB | RLS policies for all tables |
| `20260203111841_*.sql` | Feb 3 | 15.3KB | PostgreSQL functions (award_xp, etc.) |
| `20260203112656_*.sql` | Feb 3 | 4.6KB | Triggers (post-insert, post-update) |
| `20260203115947_*.sql` | Feb 3 | 1.4KB | XP configuration values |
| `20260203120016_*.sql` | Feb 3 | 369B | Leaderboard views |
| `20260203120222_*.sql` | Feb 3 | 819B | Notification system |
| `20260203161116_*.sql` | Feb 3 | 1.7KB | Calendar events table |
| `20260203163343_*.sql` | Feb 3 | 7.1KB | Network features (posts, connections, messages) |
| `20260206153700_fix_infinite_xp.sql` | Feb 6 | 2.5KB | Bug fix: infinite XP exploit |
| `20260211024533_add_user_course_progress.sql` | Feb 11 | 650B | Course progress tracking |

**Total Migration SQL:** ~54KB across 12 files

---

## Slide 39: RPC Functions (Server-Side Logic)

| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| `award_xp` | user_id, action, custom_xp | new_xp, new_level, leveled_up | Award XP for actions |
| `record_problem_solved` | user_id, difficulty | XPResult + problems_solved | Track coding solutions |
| `record_assessment_completed` | user_id, assessment_id, score, passed, time | XPResult | Track exam completion |
| `record_application_update` | user_id, old_status, new_status, app_id | new_xp, xp_gained | Track status changes |
| `init_daily_activity` | user_id | streak, daily_xp, is_new_day | Initialize daily tracking |
| `check_achievements` | user_id | achievement_id, name, xp_reward | Check & unlock achievements |
| `get_user_activity` | user_id | date, count array | Activity heatmap data |
| `get_course_progress` | user_id | progress object | Learning progress |
| `save_course_progress` | user_id, lessons, hints | void | Save learning progress |

---

## Slide 40: Gamification Engine – Complete Implementation

**File:** `gamification.ts` (6,826 bytes) – 17 functions
**Hook:** `useGamification.ts` (10,351 bytes) – 323 lines

**TypeScript Interfaces:**
- `XPResult` – { new_xp, new_level, xp_gained, leveled_up }
- `StreakResult` – { new_streak, streak_bonus }
- `DailyInitResult` – { streak, daily_xp, is_new_day }
- `AchievementUnlock` – { achievement_id, name, xp_reward }
- `LevelThreshold` – { level, xp_required, title }

**Functions:**
1. `initDailyActivity(userId)` – Initialize daily tracking
2. `awardXP(userId, action, customXP)` – Award XP
3. `recordProblemSolved(userId, difficulty)` – Track solutions
4. `recordAssessmentCompleted(userId, id, score, passed, time)` – Track exams
5. `recordApplicationUpdate(userId, old, new, appId)` – Track app changes
6. `checkAchievements(userId)` – Check & unlock achievements
7. `getLevelThresholds()` – Get level progression data
8. `getXPConfig()` – Get XP values per action
9. `getDailyActivities(userId)` – 365-day heatmap data
10. `getUserStats(userId)` – Complete stats summary
11. `calculateLevelProgress(xp, thresholds)` – Level progress bar

**Hook provides:** `awardXP()`, `spendXP()`, `recordProblemSolved()`, `recordAssessment()`, `recordApplicationUpdate()` as TanStack mutations with automatic cache invalidation, toast notifications, confetti, and sound effects.

---

## Slide 41: Authentication Flow

**Supported Methods:**
1. Email/Password (native Supabase Auth)
2. Google OAuth
3. GitHub OAuth

**Flow:**
```
User Login → Supabase Auth API → PostgreSQL auth.users → JWT Token
  → localStorage (auto-refresh via supabase-js)
  → Session persisted across tabs
  → DB trigger creates profiles row on first login
  → initDailyActivity() for streak tracking
```

**Auth State Handling:**
- `supabase.auth.getSession()` on page load
- `supabase.auth.onAuthStateChange()` for reactive updates
- Redirect to `/login` if no session

---

## Slide 42: Row Level Security (RLS)

**All tables protected. Users can only access own data.**

| Table | Policy | Rule |
|-------|--------|------|
| `profiles` | SELECT/UPDATE own | `user_id = auth.uid()` |
| `applications` | Full CRUD own | `user_id = auth.uid()` |
| `submissions` | Full CRUD own | `user_id = auth.uid()` |
| `notifications` | CRUD own | `user_id = auth.uid()` |
| `messages` | Read sent/received | `sender_id OR receiver_id = auth.uid()` |
| `connections` | Read own connections | `user_id_1 OR user_id_2 = auth.uid()` |
| `posts` | Read all, CRUD own | Open read, write own |
| `achievements` | Read all | Public catalog |
| `user_achievements` | CRUD own | `user_id = auth.uid()` |
| `notes` | CRUD own | `user_id = auth.uid()` |
| `note_shares` | Read with token | Token-based access |

---

## Slide 43: API Design – REST + RPC + Realtime

**PostgREST (Auto-generated REST):**
- Every table gets CRUD endpoints automatically
- Filtering: `.eq()`, `.gte()`, `.order()`, `.limit()`
- Relations: `.select('*, profiles(*)')` for joins

**RPC (Server-side functions):** 9 functions (see Slide 39)

**Realtime (WebSocket):**
- `postgres_changes` events
- Table-level subscriptions
- Per-user channels
- Query invalidation on changes

**External APIs:**
- Judge0 CE: `ce.judge0.com` (code execution)
- Uploadthing: File uploads
- Google CDN: DRACO decoder

---

## Slide 44: Request Lifecycle (Example: Drag to "Offer")

```
1. User drags card to "Offer" column
   │
2. Optimistic UI: setApplications() → instant visual update
   │ Confetti fires, playOffer() sound plays
   │
3. Supabase API: supabase.from('applications').update({ status: 'offer' })
   │
4. PostgreSQL: RLS check (user_id = auth.uid()) → UPDATE executes
   │
5. Gamification: recordApplicationUpdate('hr', 'offer')
   │ → supabase.rpc('award_xp') → XP calculation
   │
6. Realtime broadcast → All connected clients notified
   │
7. Query invalidation → Re-render with server-confirmed data
```

---

## Slide 45: Security Implementation

| Measure | Implementation |
|---------|---------------|
| **RLS Policies** | All tables protected, `auth.uid()` checks |
| **API Keys** | Only publishable `anon` key in frontend |
| **Input Validation** | Zod schemas for type-safe validation |
| **XSS Prevention** | React's default output escaping |
| **Anti-Cheat (Exams)** | Tab-switch detection + counter |
| **Token Auth** | JWT via Supabase, auto-refresh |
| **Session** | localStorage with `supabase-js` management |
| **CORS** | Supabase handles CORS configuration |
| **Env Variables** | `.env` in `.gitignore`, no secrets in code |
| **Infinite XP Fix** | Migration `fix_infinite_xp.sql` patched exploit |

---

## Slide 46: Supabase Client Configuration

**File:** `src/integrations/supabase/client.ts`

**Environment Variables:**
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ... (anon key, safe for client)
```

**Client Initialization:**
```typescript
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
```

**Type Safety:** Auto-generated `types.ts` provides full TypeScript types for all tables, views, functions, and enums. This is generated by the Supabase CLI.

---

## Slide 47: Realtime System

**Channels Used:**
- `gamification` – XP/level updates
- `applications` – Application status changes
- `notifications` – New notifications
- `messages` – Direct messages
- `network` – Posts and connections

**Subscription Pattern:**
```typescript
supabase.channel('channel-name')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'table_name' },
    (payload) => {
      queryClient.invalidateQueries(['queryKey']);
    }
  )
  .subscribe();
```

---

## Slide 48: External Service Integrations

| Service | Purpose | Auth | Cost |
|---------|---------|------|------|
| **Supabase** | BaaS (DB, Auth, Realtime, Storage) | Project keys | Free tier available |
| **Judge0 CE** | Code execution (16 languages) | None (public) | Free (rate limited) |
| **Uploadthing** | File upload service | API key | Free tier |
| **Google CDN** | DRACO decoder for 3D models | None | Free |
| **Google OAuth** | Social login | OAuth credentials | Free |
| **GitHub OAuth** | Social login | OAuth credentials | Free |
| **AI Gateway (`@ai-sdk/gateway`)** | LLM routing for PlateJS AI features | `AI_GATEWAY_API_KEY` | API usage-based |
| **OpenAI GPT-4o-mini** | AI text generation/editing in notes | Via AI Gateway | API usage-based |
| **Google Gemini 2.5 Flash** | AI text generation/selection edits | Via AI Gateway | API usage-based |

---

## Slide 48b: AI API Layer (`src/app/api/`)

**Directory:** `src/app/api/` (11 files across 2 services)

### AI Command Endpoint (`/api/ai/command`)
**Files:** `route.ts` (8.3KB), `utils.ts` (8.7KB), `prompt/` (7 prompt files)

Powers the PlateJS editor's **AI toolbar** with three operation modes:

| Tool Name | Trigger | Model Used |
|-----------|---------|------------|
| `generate` | Cursor-based content generation | `openai/gpt-4o-mini` |
| `edit` (text) | Rewrite selected text | `openai/gpt-4o-mini` |
| `edit` (selection) | Challenging selection tasks | `google/gemini-2.5-flash` |
| `edit` (table) | Multi-cell table edits | `google/gemini-2.5-flash` |
| `comment` | Inline AI-generated comments | `google/gemini-2.5-flash` |

**Flow:** POST from PlateJS editor → AI Gateway → model → streaming `UIMessageStream` response → real-time rendering in editor

**SDK:** `ai` 5.0, `@ai-sdk/gateway`, `@ai-sdk/react` 2.0

### AI Copilot Endpoint (`/api/ai/copilot`)
**File:** `route.ts` (963B)
- Autocomplete/suggestion endpoint
- Model: `openai/gpt-4o-mini`
- Max 50 output tokens (fast inline suggestions)
- `AbortSignal` support for request cancellation

### Uploadthing API Route (`/api/uploadthing`)
**File:** `route.ts` (184B)
- `createRouteHandler` from `uploadthing/next`
- Exposes GET + POST file upload endpoints
- Delegates to `ourFileRouter` in `src/lib/uploadthing.ts`

---

# SECTION D.5 – AI AGENT SKILLS ARCHITECTURE (Slides 48c-48d)

---

## Slide 48c: Agent Skills Architecture

The project includes a sophisticated AI agent skills architecture located in `.agents/skills/`. This system is designed to extend the capabilities of an AI agent (like Gemini CLI) by providing it with a library of specialized tools and knowledge.

**Key Concepts:**
- **Skills:** Each subdirectory in `.agents/skills/` represents a "skill" – a packaged set of instructions, and sometimes tools, that allow the agent to perform a specific task.
- **`SKILL.md`:** The core of each skill is a markdown file that defines the skill's purpose, usage, and any rules or conventions the agent must follow.
- **Activation:** The agent can "activate" a skill by name, which loads the skill's instructions into its context for the current task.

---

## Slide 48d: Agent Skills Inventory (Categorized)

The project contains a vast library of over 1000 agent skills. Below is a high-level categorization of some of the key skill domains available:

| Category | Example Skills | Purpose |
|----------|----------------|---------|
| **Core Development** | `react-patterns`, `python-pro`, `docker-expert`, `git-advanced-workflows` | Provide best practices and advanced knowledge for specific technologies. |
| **UI/UX & Design**| `shadcn`, `figma-automation`, `landing-page-generator` | Assist with UI design, component usage, and asset creation. |
| **Backend & Database** | `supabase-automation`, `prisma-expert`, `sql-optimization-patterns`, `nosql-expert` | Manage databases, optimize queries, and design backend systems. |
| **AI & ML** | `langchain-architecture`, `rag-engineer`, `llm-evaluation`, `hugging-face-datasets` | Build and evaluate AI/ML systems, manage models, and work with data. |
| **DevOps & Cloud** | `kubernetes-architect`, `terraform-skill`, `aws-serverless`, `gcp-cloud-run` | Automate infrastructure, manage deployments, and work with cloud providers. |
| **Security** | `security-audit`, `vulnerability-scanner`, `xss-html-injection`, `active-directory-attacks`| Perform security audits, scan for vulnerabilities, and understand attack vectors. |
| **Project Management** | `jira-automation`, `asana-automation`, `trello-automation` | Integrate with project management tools. |
| **Utilities & Automation** | `web-scraper`, `pdf-official`, `xlsx-official`, `remove_bg.py` | Perform various utility tasks like web scraping, file manipulation, etc. |

This modular skills system allows the agent's capabilities to be extended and specialized for a wide range of software engineering and operational tasks.

---

# SECTION E – DATA & STATIC CONTENT (Slides 49–52)

---

## Slide 49: Python Course Content

**File:** `pythonCourse.ts` (33,070 bytes)
**Structure:** 3 tiers with multiple lessons each

| Tier | Image | Topics |
|------|-------|--------|
| **Beginner** | `python-beginner.jpg` (203KB) | Variables, data types, control flow, functions |
| **Intermediate** | `python-intermediate.jpg` (173KB) | OOP, file I/O, error handling, modules |
| **Advanced** | `python-advanced.jpg` (247KB) | Decorators, generators, async, metaclasses |

**Progress Tracking:**
- `course-progress.ts` (1.2KB) – `getCourseProgress()`, `saveCourseProgress()`
- `user_course_progress` table – `completed_lessons[]`, `unlocked_hints[]`
- Migration: `20260211024533_add_user_course_progress.sql`

---

## Slide 50: Certification Question Bank

**File:** `certQuestionBank.ts` (42,104 bytes)
**Content:** 200+ exam questions across multiple certifications
**Format:** Each question includes: id, text, type (MCQ/coding/short-answer), options, correct answer, explanation, difficulty, category

**Certification Definitions** (`certificationData.ts` – 8,775 bytes):
- Multiple certification tracks
- Each with: id, title, description, duration, passing score
- Image assets for each cert
- Exam configuration (question count, time limit, pass %)

---

## Slide 51: Quiz Data

**File:** `quizData.ts` (24,197 bytes in assessments/)
**Content:** 50+ quiz questions
**Types:** MCQ, coding challenges, short-answer
**Type Definitions** (`types.ts` – 1,031 bytes):
- Question, Quiz, QuizResult interfaces
- Answer tracking, score calculation

---

## Slide 52: Static Assets

**Directory:** `src/assets/`

| Asset | Size | Purpose |
|-------|------|---------|
| `kibo-logo.png` | 14KB | Brand logo |
| `kibo-python-course.jpg` | 153KB | Course cover image |
| `python-beginner.jpg` | 203KB | Beginner tier image |
| `python-intermediate.jpg` | 173KB | Intermediate tier image |
| `python-advanced.jpg` | 247KB | Advanced tier image |
| `placeholder.svg` | | A placeholder SVG image. |
| `logos/` | 15 files | Company/tech logos |
| `3D/` | 1 file | 3D model reference |
| `kibo-new.glb` | (public/) | GLTF 3D mascot model |

---

# SECTION F – DEPLOYMENT & INFRASTRUCTURE (Slides 53–58)

---

## Slide 53: Deployment Architecture

```
┌─────────────────────────────────────────────┐
│               INTERNET                       │
└─────────────────────────────────────────────┘
          │                        │
          ▼                        ▼
┌──────────────────┐    ┌──────────────────────────┐
│  Vercel/Netlify  │    │     Supabase Cloud       │
│  ┌────────────┐  │    │  ┌──────────────────┐    │
│  │ Static CDN │  │◄──▶│  │ PostgREST + Auth │    │
│  │ React SPA  │  │REST│  └──────────────────┘    │
│  └────────────┘  │+WS │  ┌──────────────────┐    │
└──────────────────┘    │  │  PostgreSQL 15    │    │
                        │  │  + RLS Policies   │    │
                        │  └──────────────────┘    │
                        │  ┌──────────────────┐    │
                        │  │ Realtime (WS)    │    │
                        │  └──────────────────┘    │
                        └──────────────────────────┘
                                   │
                                   ▼
                        ┌──────────────────┐
                        │   Judge0 CE API  │
                        └──────────────────┘
```

---

## Slide 54: Build System & Configuration

**Vite Configuration (`vite.config.ts`):**
- Plugin: `@vitejs/plugin-react-swc` (SWC for fast builds)
- Path aliases: `@/` → `src/`
- Dev server with HMR

**TypeScript Configuration:**
- `tsconfig.json` – Base config
- `tsconfig.app.json` – App-specific (685B)
- `tsconfig.node.json` – Node/build scripts (481B)

**ESLint (`eslint.config.js` – 765B):** ESLint 9 with flat config, React Hooks + React Refresh plugins

**PostCSS (`postcss.config.js` – 81B):** TailwindCSS + Autoprefixer

**Vercel (`vercel.json` – 119B):** SPA rewrite rules for client-side routing

---

## Slide 55: npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `vite build` | Production build |
| `build:dev` | `vite build --mode development` | Dev build |
| `lint` | `eslint .` | Lint all files |
| `preview` | `vite preview` | Preview production build |
| `test` | `vitest run` | Run tests once |
| `test:watch` | `vitest` | Watch mode tests |

---

## Slide 56: Dev vs Production Environment

| Aspect | Development | Production |
|--------|-------------|------------|
| Vite Mode | HMR, source maps | Minified, tree-shaken |
| Supabase | Local or cloud | Cloud only |
| Judge0 | Public CE instance | Same (or self-hosted) |
| Port | `localhost:8080` (custom) | CDN edge |
| Logging | Console logs | Not configured (gap) |
| Error Tracking | Toast messages | Not configured (gap) |
| Build Output | In-memory (Vite) | `dist/` directory |

---

## Slide 57: Environment Variables & Secrets

**Frontend `.env` (Vite):**
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ... (anon key – safe for client)
```

**Supabase Dashboard (Not in repo):**
- `service_role` key (server-side only)
- Database connection string
- Google OAuth client ID/secret
- GitHub OAuth client ID/secret

**Security:** `.env` in `.gitignore`, no secrets committed, only publishable keys exposed

---

## Slide 58: Deployment Guide

**File:** `DEPLOY.md` (2,421 bytes)

**Steps:**
1. `npm ci` – Install dependencies
2. Set environment variables
3. `npm run build` – Generate `dist/` directory
4. Deploy `dist/` to Vercel/Netlify
5. Configure Supabase project URL and keys
6. Set up OAuth providers in Supabase dashboard
7. Run migrations against production database

---

# SECTION G – SYSTEM DIAGRAMS (Slides 59–64)

---

## Slide 59: High-Level System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │              React SPA (Vite 5.4)                 │  │
│  │  ┌─────────┐ ┌────────┐ ┌────────┐ ┌─────────┐  │  │
│  │  │Dashboard│ │ Arena  │ │  Apps  │ │ Network │  │  │
│  │  └─────────┘ └────────┘ └────────┘ └─────────┘  │  │
│  │  ┌─────────┐ ┌────────┐ ┌────────┐ ┌─────────┐  │  │
│  │  │ Notes  │ │ Exams  │ │Schedule│ │Messages │  │  │
│  │  └─────────┘ └────────┘ └────────┘ └─────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │         TanStack Query (Cache Layer)        │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
           │ REST/RPC        │ WebSocket
           ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE CLOUD                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────────┐ │
│  │ Auth │ │ REST │ │ RPC  │ │Store │ │   Realtime   │ │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────────────┘ │
│  ┌─────────────────────────────────────────────────┐    │
│  │      PostgreSQL 15 + RLS (21+ tables)           │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
           │ HTTP
           ▼
┌─────────────────────┐  ┌─────────────────────┐
│   Judge0 CE API     │  │    Uploadthing       │
│  (Code Execution)   │  │  (File Uploads)      │
└─────────────────────┘  └─────────────────────┘
```

---

## Slide 60: Data Flow Diagram

```
User Action (click, type, drag)
  │
  ▼
React Event Handler → Optimistic UI Update (instant feedback)
  │
  ▼
Supabase Client SDK → HTTPS Request (REST or RPC)
  │
  ▼
Supabase Edge API → RLS Policy Check (user_id = auth.uid())
  │
  ▼
PostgreSQL → SQL Execution → Trigger Realtime Broadcast
  │
  ▼
Realtime Cluster (WebSocket) → Push to all subscribers
  │
  ▼
All Connected Clients → Query Invalidation → Re-render
```


---

## Slide 61: Sequence Diagram – Code Submission Flow

```
User          React UI        codeExecutor.ts       Judge0 CE       Supabase
 │               │                  │                   │               │
 │──1. Click ───▶│                  │                   │               │
 │   "Submit"    │                  │                   │               │
 │               │──2. Execute ────▶│                   │               │
 │               │   Code           │                   │               │
 │               │                  │──3. POST ────────▶│               │
 │               │                  │  /submissions     │               │
 │               │                  │  (base64 code)    │               │
 │               │                  │                   │               │
 │               │                  │◀──4. Result ──────│               │
 │               │                  │  {stdout,status}  │               │
 │               │◀──5. Parse ──────│                   │               │
 │               │   Test Results   │                   │               │
 │◀──6. Show ────│                  │                   │               │
 │   Results +   │                  │                   │               │
 │   Confetti    │                  │                   │               │
 │               │──────────────────────7. award_xp() ─────────────────▶│
 │               │◀────────────────────8. {xp, level} ◀────────────────│
 │◀──9. Toast ───│                  │                   │               │
 │   "+25 XP"    │                  │                   │               │
```

---

## Slide 62: Sequence Diagram – Note Creation & Sharing

```
User          NoteEditor      useNotes.ts       Supabase       Recipient
 │               │                  │               │               │
 │──1. Type ────▶│                  │               │               │
 │   content     │                  │               │               │
 │               │──2. Debounce ───▶│               │               │
 │               │   (auto-save)    │               │               │
 │               │                  │──3. INSERT ──▶│               │
 │               │                  │  notes table   │               │
 │               │◀──4. Confirm ───│◀──────────────│               │
 │               │                  │               │               │
 │──5. Click ───▶│                  │               │               │
 │   "Share"     │                  │               │               │
 │               │──6. Generate ───▶│               │               │
 │               │   share token    │               │               │
 │               │                  │──7. INSERT ──▶│               │
 │               │                  │  note_shares   │               │
 │               │◀──8. Token ─────│               │               │
 │◀──9. Copy ────│                  │               │               │
 │   share link  │                  │               │               │
 │               │                  │               │               │
 │──10. Send ───────────────────────────────────────────────────────▶│
 │   link to     │                  │               │               │
 │   recipient   │                  │               │               │
 │               │                  │               │──11. GET ────▶│
 │               │                  │               │  /shared/:tok │
```

---

## Slide 63: Sequence Diagram – Certification Exam

```
User          ExamEngine       useCertifications    Supabase
 │               │                  │                   │
 │──1. Start ───▶│                  │                   │
 │   Exam        │                  │                   │
 │               │──2. Load ───────▶│                   │
 │               │   questions      │──3. SELECT ──────▶│
 │               │                  │   certQuestionBank │
 │               │◀──4. Questions ──│◀─────────────────│
 │               │                  │                   │
 │──5. Answer ──▶│  (timer running) │                   │
 │   questions   │  (tab-switch     │                   │
 │               │   detection)     │                   │
 │               │                  │                   │
 │──6. Submit ──▶│                  │                   │
 │  (or timeout) │──7. Grade ──────▶│                   │
 │               │  gradeExamLocally│                   │
 │               │                  │──8. INSERT ──────▶│
 │               │                  │  assessment_attempts│
 │               │◀──9. Result ────│◀─────────────────│
 │◀──10. Show ──│                  │                   │
 │   breakdown   │                  │                   │
 │               │──11. Generate ──▶│                   │
 │               │   PDF cert       │  (pdf-lib)        │
 │◀──12. Download│                  │                   │
 │   certificate │                  │                   │
```

---

## Slide 64: Failure Modes & Recovery

| Failure | Detection | User Experience | Recovery |
|---------|-----------|-----------------|----------|
| **Network Error** | `fetch()` throws | Toast "Network error" | Manual retry |
| **Auth Expired** | `onAuthStateChange(null)` | Redirect to `/login` | Re-login |
| **RLS Violation** | Supabase error response | Toast "Error" | Check auth, refresh |
| **Optimistic Rollback** | API fails after UI update | State reverted + toast | Automatic |
| **Code Exec Timeout** | `status_id === 5` | "Time Limit Exceeded" | Optimize code |
| **Compilation Error** | `status_id === 6` | Show compile output | Fix code |
| **3D Load Failure** | Preloader timeout | Skip/retry preloader | Refresh page |
| **Judge0 Rate Limit** | HTTP 429 | Toast "Try again" | Wait and retry |
| **File Upload Error** | Uploadthing error | Toast with details | Retry upload |

**Gap:** No React Error Boundary – unhandled exceptions crash the app

---

# SECTION H – HOOKS DEEP DIVE (Slides 65–70)

---

## Slide 65: useGamification Hook (323 lines)

**File:** `useGamification.ts` (10,351 bytes)
**Imports:** TanStack Query, Supabase, Toast, Gamification lib, Sounds, Confetti

**Queries:**
- `userStats` – Profile XP, level, streak, problems solved
- `levelThresholds` – Level progression data
- `dailyActivities` – 365-day heatmap data

**Mutations (5):**
1. `awardXP(action, customXP)` – Award XP → toast + sound on success
2. `spendXP(action, amount)` – Spend XP
3. `recordProblemSolved(difficulty)` – Track solutions → confetti on solve
4. `recordAssessment(id, score, passed, time)` – Track exams → confetti if passed
5. `recordApplicationUpdate(old, new, appId)` – Track status → confetti + sound on offer

**Side Effects:** Toast notifications, `playSound()`, `confetti()`, query invalidation

---

## Slide 66: useCertifications Hook (337 lines)

**File:** `useCertifications.ts` (11,943 bytes)

**`gradeExamLocally()`** (140 lines):
- Client-side grading for practice exams
- Handles MCQ, coding, and short-answer questions
- Calculates: total score, per-question results, pass/fail, percentage

**`useCertifications()` hook provides:**
- Fetch certification catalog
- Start exam attempt
- Submit exam answers
- Fetch exam results
- Fetch user certificates
- Generate certificate PDF

---

## Slide 67: useNotes Hook (291 lines)

**File:** `useNotes.ts` (9,160 bytes)

**Interfaces:** `Note` (13 fields), `NoteShare` (8 fields)

**Operations:**
- `fetchNotes()` – Get all user's notes
- `createNote()` – Create new note
- `updateNote()` – Update content/title
- `deleteNote()` – Soft delete
- `pinNote()` / `unpinNote()` – Toggle pin
- `archiveNote()` – Archive/unarchive
- `addTag()` / `removeTag()` – Tag management
- `shareNote()` – Generate share token
- `revokeShare()` – Revoke sharing
- `getSharedNote()` – Fetch by share token

**Auto-save:** Debounced save on content change

---

## Slide 68: useAppNotifications Hook

**File:** `useAppNotifications.ts` (7,155 bytes)

**Features:**
- Fetch unread notification count
- List all notifications (paginated)
- Mark as read (single / all)
- Real-time subscription for new notifications
- Notification bell badge count
- Sound on new notification

---

## Slide 69: usePushNotifications Hook

**File:** `usePushNotifications.ts` (4,544 bytes)

**Features:**
- Browser push notification permission
- Service worker registration
- Push subscription management
- Notification payload handling

---

## Slide 70: Utility Hooks

| Hook | File | Size | Purpose |
|------|------|------|---------|
| `use-toast.ts` | hooks/ | 3.9KB | Toast state management |
| `use-upload-file.ts` | hooks/ | 3.2KB | File upload with progress |
| `useScrollReveal.ts` | hooks/ | 1.7KB | Scroll-triggered animations |
| `use-debounce.ts` | hooks/ | 474B | Value debouncing |
| `use-is-touch-device.ts` | hooks/ | 545B | Touch device detection |
| `use-mobile.tsx` | hooks/ | 576B | Mobile breakpoint detection |
| `use-mounted.ts` | hooks/ | 199B | Component mounted state |

---

# SECTION I – TESTING & QUALITY (Slides 71–74)

---

## Slide 71: Testing Infrastructure

**Test Framework:** Vitest 3.2.4
**Test Utilities:** `@testing-library/react` 16.0, `@testing-library/jest-dom` 6.6
**DOM Environment:** jsdom 20.0.3

**Configuration (`vitest.config.ts` – 395B):**
- Globals enabled
- jsdom environment
- Path alias resolution

**Test Directory:** `src/test/`
- `example.test.ts`: A placeholder/example test file.
- `setup.ts`: Test setup and configuration.

**Scripts:** `npm test` (run once), `npm run test:watch` (watch mode)

---

## Slide 72: Code Quality & Linting

**ESLint 9.32 (Flat Config):**
- `eslint-plugin-react-hooks` – Hook rules enforcement
- `eslint-plugin-react-refresh` – Fast refresh compatibility
- `typescript-eslint` 8.38 – TypeScript rules

**Known Lint Issues (`lint_errors.txt` – 10KB, `lint_output.txt` – 8KB):**
- `@typescript-eslint/no-explicit-any` suppressions in some files
- Large file warnings (Arena.tsx > 57KB)
- Some dependency array issues in useEffect

**TypeScript:** Strict mode enabled, full type coverage via auto-generated Supabase types

---

## Slide 73: Code Metrics

| Metric | Value |
|--------|-------|
| **Total Source Files** | 376 |
| **Pages** | 20 |
| **Components** | 298 (across 19 directories) |
| **Hooks** | 12 |
| **Lib Modules** | 7 |
| **Data Files** | 3 |
| **Supabase Migrations** | 12 |
| **npm Dependencies** | 80+ |
| **Dev Dependencies** | 15 |
| **Largest File** | Arena.tsx (57.2KB) |
| **2nd Largest** | ExamEngine.tsx (45.9KB) |
| **Total Source Size** | ~1.5MB+ |
| **Test Files** | 2 |
| **Lines of Code** | ~30,000+ (estimated) |

---

## Slide 74: Technical Debt & Known Issues

| Issue | Location | Severity |
|-------|----------|----------|
| `eslint-disable no-explicit-any` | Dashboard.tsx | Medium |
| Arena.tsx > 57KB (should be split) | Arena.tsx | Medium |
| No React Error Boundary | App.tsx | High |
| Limited unit test coverage | src/test/ | High |
| Console.warn in production | Login.tsx | Low |
| No logging/monitoring integration | Global | High |
| No analytics integration | Global | Medium |
| No feature flags | Global | Medium |
| No rate limiting (frontend) | Global | Low |
| Infinite XP bug (fixed) | Migration fix | Fixed ✅ |

---

# SECTION J – FEATURES INVENTORY (Slides 75–82)

---

## Slide 75: Complete Feature Matrix

| Feature | Status | Evidence |
|---------|--------|----------|
| Email/OAuth Authentication | ✅ | Login.tsx, Signup.tsx |
| Kanban Application Tracker | ✅ | Applications.tsx |
| Table View for Applications | ✅ | ApplicationTableView.tsx |
| CSV Import/Export | ✅ | ImportExportTools.tsx |
| Application Reminders | ✅ | ApplicationReminders.tsx |
| Application Notes | ✅ | ApplicationNotes.tsx |
| Monaco Code Editor | ✅ | Arena.tsx |
| Judge0 Code Execution (16 langs) | ✅ | codeExecutor.ts |
| Test Case Runner | ✅ | codeExecutor.ts |
| Code Playground | ✅ | Playground.tsx |
| Quiz System | ✅ | QuizMode.tsx, quizData.ts |
| Assessment Engine | ✅ | AssessmentMode.tsx |
| Certification Exams | ✅ | ExamEngine.tsx |
| PDF Certificate Generation | ✅ | ResultBreakdown.tsx |
| Certificate Verification | ✅ | VerifyCertificate.tsx |

---

## Slide 76: Complete Feature Matrix (Continued)

| Feature | Status | Evidence |
|---------|--------|----------|
| XP System | ✅ | gamification.ts |
| Level Progression | ✅ | gamification.ts |
| Streak Tracking | ✅ | gamification.ts |
| Achievement System | ✅ | Achievements.tsx |
| Real-time Leaderboard | ✅ | RealtimeLeaderboard |
| Contribution Heatmap | ✅ | TheGarden.tsx |
| Dashboard (16 widgets) | ✅ | dashboard/*.tsx |
| Progress Charts | ✅ | ProgressCharts.tsx |
| Skills Radar Chart | ✅ | SkillsRadar.tsx |
| Rich Notes (PlateJS) | ✅ | NoteEditor.tsx |
| Note Sharing | ✅ | ShareNoteDialog.tsx |
| Slash Commands | ✅ | SlashCommandMenu.tsx |
| Social Network Feed | ✅ | Network.tsx |
| Direct Messaging | ✅ | Messages.tsx |
| Connection System | ✅ | Network.tsx |
| Event Calendar | ✅ | Schedule.tsx |
| Python Course | ✅ | Learning.tsx |
| Sound Effects (15 types) | ✅ | sounds.ts |
| Confetti Celebrations | ✅ | canvas-confetti |
| 3D Mascot | ✅ | KiboMascot3D.tsx |
| Responsive Design | ✅ | Tailwind breakpoints |
| Dark/Light Mode | ✅ | next-themes |
| Lazy Loading | ✅ | React.lazy() |
| Real-time Updates | ✅ | Supabase Realtime |
| Notifications | ✅ | NotificationBell |
| Push Notifications | ✅ | usePushNotifications |
| User Profiles | ✅ | Profile.tsx |
| Settings Page | ✅ | Settings.tsx |
| 404 Page | ✅ | NotFound.tsx |
| Landing Page (9 sections) | ✅ | landing/*.tsx |

---

## Slide 77: Gamification Mechanics Detail

**XP Awards:**
| Action | XP | Source |
|--------|-----|--------|
| Problem Solved (Easy) | Variable | `xp_config` table |
| Problem Solved (Medium) | Variable | `xp_config` table |
| Problem Solved (Hard) | Variable | `xp_config` table |
| Application Added | Variable | `xp_config` table |
| Application Status Change | Variable | `xp_config` table |
| Assessment Completed | Variable | `xp_config` table |
| Achievement Unlocked | Bonus XP | Per achievement |
| Streak Bonus | Daily bonus | Streak multiplier |

**Level Formula:** Level thresholds stored in `level_thresholds` table
**Progress Calc:** `calculateLevelProgress(currentXP, thresholds)` → { current, next, progress%, title }

---

## Slide 78: Achievement System

**Implementation:**
- `achievements` table: Achievement catalog (name, description, requirement_type, requirement_value)
- `user_achievements` table: Unlocked achievements (user_id, achievement_id, unlocked_at)
- `checkAchievements(userId)` RPC: Evaluates all unlock conditions
- Achievement unlock → XP bonus + sound + toast notification

**Page:** `Achievements.tsx` (13.8KB) – Gallery view with locked/unlocked states

---

## Slide 79: Leaderboard System

**Component:** `RealtimeLeaderboard.tsx` (in leaderboard/)
**Data Source:** `profiles` table, ordered by XP DESC
**Real-time:** Supabase channel subscriptions for live updates
**Display:** Weekly XP ranking, user avatars, level badges

---

## Slide 80: Notification System

**In-App Notifications:**
- `NotificationBell.tsx` (notifications/)
- `useAppNotifications.ts` (7.1KB)
- Bell icon with unread count badge
- Dropdown panel listing notifications
- Mark as read (individual/all)

**Push Notifications:**
- `usePushNotifications.ts` (4.5KB)
- Browser Push API integration
- Service worker registration

**Types:** XP gain, achievement unlock, connection request, message, exam result

---

## Slide 81: Schedule & Calendar

**Page:** `Schedule.tsx` (25,188 bytes)
**Components:** 3 sub-components (schedule/)
**Features:**
- Month/week/day calendar views
- Add/edit/delete events
- Event types: Interview, Contest, Deadline, Custom
- `calendar_events` table in Supabase
- Migration: `20260203161116_*.sql`
- Upcoming events sidebar panel

---

## Slide 82: Network & Social Features

**Page:** `Network.tsx` (14,877 bytes)
**Components:** 5 sub-components (network/)

**Posts Feed:**
- Create posts (text content)
- Upvote/downvote system (`post_upvotes` table)
- `playLike()` sound on upvote

**Connections:**
- Send/accept/reject connection requests
- `connections` table with status enum
- `playConnectionRequest()` / `playConnectionAccepted()` sounds

**Messages (`Messages.tsx` – 10.7KB):**
- Direct messaging between connections
- 3 sub-components (messages/)
- Real-time via Supabase channels
- `playMessageReceived()` / `playMessageSent()` sounds

**Migration:** `20260203163343_*.sql` (7.1KB) – Network features schema

---

# SECTION K – EVALUATION & ROADMAP (Slides 83–90)

---

## Slide 83: What Works Today

| Category | Features | Count |
|----------|----------|-------|
| **Pages** | Full routing with lazy loading | 20 |
| **Components** | UI primitives + features | 298 |
| **Dashboard Widgets** | Real-time analytics | 16 |
| **Languages** | Code execution | 16 |
| **Sound Effects** | Web Audio API | 15 |
| **Editor Plugins** | PlateJS rich text | 30+ |
| **Hooks** | Custom React hooks | 12 |
| **DB Tables** | PostgreSQL entities | 21+ |
| **Migrations** | Schema evolution | 12 |
| **RPC Functions** | Server-side logic | 9 |
| **OAuth Providers** | Social login | 2 (Google, GitHub) |
| **Certifications** | Exam questions | 200+ |
| **Quiz Questions** | Interactive quizzes | 50+ |
| **AI LLM Models** | Notes AI: Gemini 2.5 Flash + GPT-4o-mini | 2 |
| **AI API Endpoints** | PlateJS AI command + copilot + uploadthing | 3 |

---

## Slide 84: Known Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| Judge0 CE public instance | Rate limiting | Self-host for production |
| No offline support | App needs network | Add PWA service worker |
| No PWA manifest | Not installable on mobile | Add manifest.json |
| localStorage auth | Session lost on clear | Consider cookies |
| No error boundary | Unhandled crashes | Add React Error Boundary |
| Limited test coverage | Bug risk | Expand test suite |
| No monitoring | Blind to prod issues | Add Sentry |
| No analytics | Can't measure usage | Add Mixpanel |
| English only | Limited audience | Add i18n |

---

## Slide 85: Scalability Considerations

**Database:**
| Risk | Current | Mitigation |
|------|---------|------------|
| Leaderboard query | SELECT * ORDER BY xp | Add pagination, caching |
| Daily activities heatmap | 365-day range query | Aggregate tables |
| Real-time subscriptions | Per-user channels | Connection pooling |

**Frontend:**
| Risk | Current | Mitigation |
|------|---------|------------|
| Bundle size | Lazy loading ✅ | Bundle analyzer |
| 3D model loading | Preloaded + DRACO ✅ | CDN, progressive |
| State management | TanStack Query ✅ | Consider Zustand if complex |

---

## Slide 86: Production Readiness Checklist

| Category | Item | Status |
|----------|------|--------|
| **Security** | RLS policies enabled | ✅ |
| | Input validation (Zod) | ✅ |
| | No secrets in code | ✅ |
| | HTTPS enforced | ⚠️ Deploy dependent |
| **Performance** | Lazy loading | ✅ |
| | 3D DRACO compression | ✅ |
| | Image optimization | ❌ Missing |
| **Reliability** | Error boundaries | ❌ Missing |
| | Retry logic | ❌ Missing |
| **Monitoring** | Error tracking | ❌ Missing |
| | Analytics | ❌ Missing |
| **Testing** | Unit tests | ⚠️ Minimal |
| | E2E tests | ❌ Missing |
| **Docs** | README | ✅ |
| | DEPLOY.md | ✅ |

**Verdict:** MVP-ready for demo/staging. Production requires monitoring and error handling.

---

## Slide 87: Bug Fixes & Iterations

| Fix | File | Description |
|-----|------|-------------|
| **Infinite XP exploit** | `fix_infinite_xp.sql` | Patched XP duplication vulnerability |
| **Course progress table** | `add_user_course_progress.sql` | Added missing table for learning tracking |
| **Lint error fixes** | Multiple files | Fixed TypeScript and ESLint issues |
| **Quiz creation fix** | Assessments components | Fixed instructor quiz creation flow |
| **Login authentication** | Login/Signup pages | Fixed auth error handling |
| **Dashboard loading** | Dashboard.tsx | Fixed blank white screen on lazy load |
| **3D preloader crash** | Preloader component | Fixed Canvas context crash on non-3D pages |
| **Code executor migration** | codeExecutor.ts | Migrated from Piston API to Judge0 CE |
| **Certification icons** | Certifications components | Fixed incorrect icon display |
| **Sound system** | sounds.ts | Fixed no-audio issue, added 15 sound types |

---

## Slide 88: Version History

| Version | Date | Major Changes |
|---------|------|---------------|
| Initial | Feb 3, 2026 | Core schema, auth, applications, arena, gamification |
| v1.0.1 | Feb 6, 2026 | Fixed infinite XP exploit |
| v1.0.2 | Feb 10, 2026 | Fixed certification icons |
| v1.0.3 | Feb 11, 2026 | Added course progress tracking |
| v1.0.4 | Feb 13, 2026 | Implemented sound effects system |
| v1.0.5 | Feb 14, 2026 | Fixed lint errors, dashboard loading |
| v1.0.6 | Feb 17, 2026 | Migrated from Piston API to Judge0 CE |
| v1.0.7 | Feb 24, 2026 | UI polishing, MCQ alignment, logo alignment |
| v1.0.8 | Feb 25, 2026 | Quiz creation fix, login fix, notes system |
| v1.0.9 | Mar 3, 2026 | AI API layer: PlateJS AI command + copilot endpoints (Gemini 2.5 Flash + GPT-4o-mini) |

---

## Slide 89: Roadmap – Future Features

| Version | Feature | Status |
|---------|---------|--------|
| **v1.0 (Current)** | AI-powered PlateJS Notes (Gemini + GPT) | ✅ Done |
| **v1.1** | AI Resume Parsing | 🔮 Planned |
| **v1.1** | Smart Job Recommendations | 🔮 Planned |
| **v1.2** | Browser Extension | 🔮 Planned |
| **v1.2** | Mobile App (React Native) | 🔮 Planned |
| **v2.0** | Mock Interview Rooms | 🔮 Planned |
| **v2.0** | Interview Marketplace | 🔮 Planned |
| **v2.0** | Team Workspaces | 🔮 Planned |

**Technical Improvements:**
| Improvement | Priority |
|-------------|----------|
| Add Sentry error tracking | High |
| Add Mixpanel analytics | High |
| React Error Boundary | High |
| Comprehensive test suite | Medium |
| Design system docs | Medium |
| i18n (multi-language) | Low |
| PWA support | Low |

---

## Slide 90: Technical Moats & Competitive Advantages

| Advantage | Description |
|-----------|-------------|
| **Real-time Architecture** | Sub-100ms sync via Supabase Realtime |
| **Gamification Engine** | SQL-based XP with triggers and functions |
| **Integrated Code Lab** | 16-language execution without leaving platform |
| **Rich Note Editor** | PlateJS with 30+ plugins (Notion-like) |
| **Type-Safe Stack** | Full TypeScript coverage |
| **Premium Sound System** | 15 Web Audio API sound types |
| **3D Brand Identity** | GLTF mascot with DRACO compression |
| **Modern DX** | Vite HMR, TanStack Query, Shadcn |
| **Anti-Cheat Exams** | Tab-switch detection for certification integrity |
| **PDF Certificates** | Client-side PDF generation with pdf-lib |

---

# SECTION L – CLOSING (Slides 91–95)
