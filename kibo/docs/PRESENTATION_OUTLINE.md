# Kibo – The Intelligent Career Orchestration Platform
## 40-50 Slide Presentation Outline

**Prepared for:** YC-style Demo Day | Technical Architecture Review | Academic Mini-Project Evaluation

**Repository Reference:** `Cyrax321/kibo-v7` (kibo-v2 directory)

---

# Section A – Vision & Narrative (Slides 1–6)

---

## Slide 1: Title Slide – Kibo Overview

**Objective:** Establish brand presence and set the tone for the presentation.

**Content:**
- **Logo:** Kibo (with 3D mascot visual)
- **Tagline:** The Intelligent Career Orchestration Platform
- **Version:** 1.0.0 (per package.json)
- **Tech Identity:** TypeScript 5.x | React 18 | Supabase | TailwindCSS
- **Status:** Production-grade, MIT Licensed

**Note:** README badge shows v5.0.0, but package.json defines v1.0.0.

**Diagram Description:**
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                      [KIBO LOGO]                           │
│                   3D Mascot Graphic                        │
│                                                            │
│              "The Intelligent Career                       │
│               Orchestration Platform"                      │
│                                                            │
│         ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐               │
│         │ TS  │  │React│  │Supa │  │Tail │               │
│         └─────┘  └─────┘  └─────┘  └─────┘               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Slide 2: One-Liner – What is Kibo

**Objective:** Deliver a memorable, elevator-pitch definition.

**Content:**
- **One-liner:** "Kibo is a gamified career acceleration engine that transforms the chaotic job hunt into a data-driven, rewarding mission."
- **Key Differentiators:**
  - Kanban-style application tracking
  - Real-time coding practice analytics
  - Competitive leaderboards with XP/streak mechanics
  - Duolingo-inspired engagement loops
- **Built for:** Software engineers actively seeking new roles

**Reference Files:**
- `docs/PRD.md` (Executive Summary)
- `README.md` (Project description)

---

## Slide 3: The Problem Space (Career Chaos, Fragmented Guidance)

**Objective:** Establish the pain points that Kibo solves.

**Content:**
- **Lack of Visibility:** Engineers track hundreds of applications across spreadsheets, email, and memory
- **Skill Decay:** Inconsistent coding practice leads to poor interview performance
- **Motivation Loss:** Job hunting is solitary; effort attrition is high
- **Data Fragmentation:** No single source of truth for interviews, study progress, and application health
- **Burn-out:** The recruitment cycle is mentally exhausting without structure

**Reference Files:**
- `docs/PRD.md` (Problem Statement section)

---

## Slide 4: Why This Problem Exists (Systemic Gaps)

**Objective:** Explain the root causes behind career chaos.

**Content:**
- **No Unified Tools:** Existing solutions are either ATS-focused (for companies) or resume builders (one-time use)
- **Lack of Accountability:** No gamification or progress tracking for job seekers
- **Isolation:** Career coaches are expensive; peer support is unstructured
- **Information Overload:** Too many platforms (LinkedIn, Indeed, Glassdoor) without aggregation
- **No Feedback Loop:** Users don't know what's working in their job search strategy

**Assumption based on code structure:** The existence of multiple dashboard widgets (ApplicationFunnel, SkillsRadar, StreakCalendar) suggests the platform was designed to address fragmented data.

---

## Slide 5: Why Now (AI + Market Readiness)

**Objective:** Explain the timing and market opportunity.

**Content:**
- **AI Maturity:** LLMs enable intelligent assistance (though AI features are **not implemented in current repo**)
- **Remote Work Explosion:** More applications per job opening; tracking is critical
- **Gen Z Workforce:** Digital natives expect gamified, engaging experiences
- **Developer Tools Renaissance:** Engineers invest in productivity tools
- **Great Resignation Aftermath:** Continuous job mobility is the new normal

**Note:** AI features (resume parsing, auto-fill) are listed in `docs/PRD.md` as Roadmap v1.1, **not implemented in current repo**.

---

## Slide 6: Vision – What Kibo Becomes Long-Term

**Objective:** Paint the picture of Kibo's future state.

**Content:**
- **Phase 1 (Current):** Gamified application tracker + coding practice analytics
- **Phase 2 (Roadmap v1.1):** AI-powered resume parsing and auto-fill
- **Phase 3 (Roadmap v1.2):** Browser extension for one-click job scraping
- **Phase 4 (Roadmap v2.0):** Mock interview marketplace + peer practice rooms
- **Ultimate Vision:** The operating system for career development

**Reference Files:**
- `docs/PRD.md` (Section 7: Roadmap)

---

# Section B – Product Deep Dive (Slides 7–14)

---

## Slide 7: User Personas

**Objective:** Define the target users based on repository context.

**Content:**
- **Primary Persona: Active Job Seeker**
  - Junior to Senior Software Engineers
  - Managing 50-200+ applications simultaneously
  - Needs visibility into pipeline health
  
- **Secondary Persona: CS Student**
  - Preparing for internship seasons
  - Needs structured coding practice
  - Values competitive elements (leaderboards)

- **Profile Fields (from database schema):**
  - `full_name`, `headline`, `bio`
  - `skills[]`, `country`, `target`
  - `github_url`, `linkedin_url`
  - `xp`, `level`, `streak`, `problems_solved`

**Reference Files:**
- `docs/PRD.md` (Section 4: Target Audience)
- `src/integrations/supabase/types.ts` (profiles table)

---

## Slide 8: Core Use Cases

**Objective:** Enumerate the primary workflows supported.

**Content:**
1. **Track Job Applications:** Kanban board with Wishlist → Applied → OA → Technical → HR → Offer
2. **Practice Coding Problems:** Monaco editor with Judge0 execution, test case validation
3. **Monitor Progress:** XP system, streak tracking, level progression
4. **Compete on Leaderboard:** Real-time global ranking by weekly XP
5. **Schedule Management:** Calendar for interviews and contests
6. **Professional Certifications:** Exam engine with timed assessments
7. **Networking:** Connection requests, posts, direct messages
8. **Learning Path:** Python course with lesson tracking

**Reference Files:**
- `src/pages/*.tsx` (all page routes)
- `src/App.tsx` (route definitions)

---

## Slide 9: User Journey (End-to-End Flow)

**Objective:** Visualize the complete user experience.

**Content:**
1. **Landing Page:** Hero section, features, testimonials, FAQ
2. **Sign Up/Login:** Email/password or OAuth (Google, GitHub)
3. **Dashboard (Mission Control):** StatsHUD, The Garden, Progress Charts
4. **Application Tracker:** Add jobs, drag between columns, analytics
5. **Arena (Code Lab):** Solve problems, run tests, earn XP
6. **Certifications:** Take exams, receive digital badges
7. **Profile:** Showcase achievements, connect with others
8. **Settings:** Manage preferences, notifications

**Diagram Description:**
```
Landing Page
     │
     ▼
┌─────────────┐
│   Sign Up   │───────────────────────────────┐
└─────────────┘                               │
     │                                        │
     ▼                                        ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Dashboard  │◄──│ Applications│   │    Arena    │
│  (Mission   │   │   Tracker   │   │  (Code Lab) │
│   Control)  │   └─────────────┘   └─────────────┘
└─────────────┘          │                 │
     │                   ▼                 ▼
     │            ┌─────────────┐   ┌─────────────┐
     │            │   Schedule  │   │Certifications│
     │            └─────────────┘   └─────────────┘
     │                   │                 │
     ▼                   ▼                 ▼
┌─────────────────────────────────────────────────┐
│              Profile & Achievements             │
└─────────────────────────────────────────────────┘
```

---

## Slide 10: Onboarding Flow (Duolingo-Style Screens)

**Objective:** Describe the user onboarding experience.

**Content:**
- **Onboarding Components Observed:**
  - Login page with motivational messaging ("Welcome back, commander")
  - Feature pills highlighting capabilities
  - Trust badges (encryption, compliance)
  - OAuth quick-start options

- **Post-Authentication:**
  - Profile creation triggers on first login (Supabase trigger)
  - Daily activity initialization for streak tracking
  - Login greeting email (fire-and-forget)

**Not Implemented:**
- Step-by-step onboarding wizard (like Duolingo's style selection)
- Goal-setting screens

**Reference Files:**
- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`
- `src/lib/gamification.ts` (initDailyActivity)

---

## Slide 11: Dashboard & Modules Overview

**Objective:** Map out all major UI modules.

**Content:**

| Module | Location | Description |
|--------|----------|-------------|
| **StatsHUD** | Dashboard | XP, Level, Streak display with 3D-style HUD |
| **The Garden** | Dashboard | GitHub-style contribution heatmap |
| **Progress Charts** | Dashboard | Trend lines for XP, problems, applications |
| **Daily Focus** | Dashboard | To-do list with streak integration |
| **Application Funnel** | Dashboard | Conversion visualization |
| **Skills Radar** | Dashboard | Strength categorization chart |
| **Streak Calendar** | Dashboard | Monthly activity calendar |
| **Leaderboard** | Dashboard | Real-time global ranking |
| **CodeLab Dashboard** | Dashboard | Problem-solving statistics |

**Reference Files:**
- `src/pages/Dashboard.tsx`
- `src/components/dashboard/*.tsx`

---

## Slide 12: Feature Map (Current Features Only)

**Objective:** Provide a comprehensive feature inventory.

**Content:**

**Implemented Features:**
| Category | Features |
|----------|----------|
| **Authentication** | Email/Password, Google OAuth, GitHub OAuth |
| **Application Tracking** | Kanban board, Table view, Import/Export (CSV), Reminders |
| **Code Practice** | Monaco editor, 16 language support (Judge0), Test case runner |
| **Gamification** | XP system, Levels, Streaks, Achievements, Leaderboard |
| **Certifications** | Exam engine, Result breakdown, Certificate verification |
| **Networking** | Posts, Upvotes, Connections, Direct messages |
| **Learning** | Python course viewer, Progress tracking |
| **Schedule** | Event calendar, Upcoming events panel |
| **Notifications** | In-app bell, Real-time updates |
| **3D Elements** | GLTF mascot preloading, Three.js integration |

**Not Implemented:**
- AI resume parsing
- Browser extension
- Mock interview marketplace

---

## Slide 13: Feature Walkthrough – Application Tracker

**Objective:** Deep dive into the ATS module.

**Content:**
- **Kanban Board:**
  - 6 columns: Wishlist, Applied, OA, Technical, HR, Offer
  - Drag-and-drop status changes
  - Optimistic UI updates (instant feedback)
  
- **Application Card:**
  - Company, Role, Salary, Location badges
  - Remote indicator
  - Priority star (high priority)
  - External link to job posting
  - Notes indicator

- **Analytics Tab:**
  - Funnel visualization (conversion rates)
  - Application statistics

- **XP Integration:**
  - XP awarded on status changes (offer = celebration + confetti)

**Reference Files:**
- `src/pages/Applications.tsx`
- `src/components/applications/*.tsx`

**Diagram Description:**
```
┌───────────┬───────────┬───────────┬───────────┬───────────┬───────────┐
│ Wishlist  │  Applied  │    OA     │ Technical │    HR     │   Offer   │
├───────────┼───────────┼───────────┼───────────┼───────────┼───────────┤
│ ┌───────┐ │ ┌───────┐ │           │ ┌───────┐ │           │ ┌───────┐ │
│ │Google │ │ │Amazon │ │           │ │ Meta  │ │           │ │Stripe │ │
│ │ SWE   │ │ │ SDE   │ │           │ │ Eng   │ │           │ │ Dev   │ │
│ └───────┘ │ └───────┘ │           │ └───────┘ │           │ └───────┘ │
│ ┌───────┐ │           │           │           │           │     🎉    │
│ │Netflix│ │           │           │           │           │           │
│ └───────┘ │           │           │           │           │           │
└───────────┴───────────┴───────────┴───────────┴───────────┴───────────┘
                              Drag & Drop
```

---

## Slide 14: Feature Walkthrough – Arena (Code Lab)

**Objective:** Deep dive into the coding practice module.

**Content:**
- **Problem Interface:**
  - Description panel with markdown rendering
  - Monaco code editor (syntax highlighting, intellisense)
  - Language selector (16 languages supported)
  - Company tags, Topic tags, Difficulty badge

- **Execution Engine:**
  - Judge0 CE public API integration
  - Real-time code execution
  - Test case runner with expected vs actual output
  - Runtime statistics

- **Problem Types:**
  - Easy, Medium, Hard difficulties
  - Sample problems (Two Sum, Reverse String, etc.)

- **Gamification:**
  - XP awarded based on difficulty
  - Submission history tracking
  - Confetti celebration on correct solutions

**Reference Files:**
- `src/pages/Arena.tsx`
- `src/components/arena/*.tsx`
- `src/lib/codeExecutor.ts`

**Diagram Description:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Arena: Code Lab                                                         │
├─────────────────────────────────┬───────────────────────────────────────┤
│ ┌─────────────────────────────┐ │ ┌───────────────────────────────────┐ │
│ │ Problem Description         │ │ │ Monaco Editor                     │ │
│ │                             │ │ │ ┌─────────────────────────────────┐│ │
│ │ Two Sum                     │ │ │ │ function twoSum(nums, target) { ││ │
│ │ Difficulty: Easy            │ │ │ │   // Your code here             ││ │
│ │ Tags: Array, Hash Table     │ │ │ │ }                               ││ │
│ │                             │ │ │ └─────────────────────────────────┘│ │
│ │ Given an array of integers..│ │ │                                   │ │
│ │                             │ │ │ [Run Code] [Submit]               │ │
│ └─────────────────────────────┘ │ └───────────────────────────────────┘ │
├─────────────────────────────────┴───────────────────────────────────────┤
│ Test Results: ✅ Case 1: Passed | ✅ Case 2: Passed | Runtime: 45ms     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# Section C – Frontend Architecture (Slides 15–20)

---

## Slide 15: Frontend Tech Stack

**Objective:** Detail the frontend technology choices.

**Content:**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI component framework |
| **TypeScript** | 5.8.3 | Type safety and developer experience |
| **Vite** | 5.4.19 | Build tool, dev server, HMR |
| **TailwindCSS** | 3.4.17 | Utility-first styling |
| **Shadcn UI** | - | Component design system (Radix primitives) |
| **TanStack Query** | 5.83.0 | Server state management, caching |
| **Framer Motion** | 11.18.2 | Animations and transitions |
| **React Router** | 6.30.1 | Client-side routing |
| **Monaco Editor** | 4.7.0 | Code editing (VS Code engine) |
| **Recharts** | 2.15.4 | Data visualization |
| **Three.js** | 0.160.1 | 3D graphics (mascot) |

**Reference Files:**
- `package.json` (dependencies)
- `docs/SRS.md` (Section 2.2: Tech Stack)

---

## Slide 16: Frontend Folder Structure

**Objective:** Map the codebase organization.

**Content:**
```
src/
├── App.tsx              # Root component, routing setup
├── main.tsx             # Entry point, React DOM render
├── index.css            # Global styles, Tailwind imports
├── vite-env.d.ts        # Vite type declarations
│
├── pages/               # Route-level page components (18 pages)
│   ├── Dashboard.tsx
│   ├── Applications.tsx
│   ├── Arena.tsx
│   ├── Login.tsx / Signup.tsx
│   ├── Profile.tsx
│   └── ... (14 more)
│
├── components/          # Reusable UI components
│   ├── ui/              # Shadcn primitives (Button, Card, etc.)
│   ├── dashboard/       # Dashboard-specific widgets
│   ├── applications/    # ATS components
│   ├── arena/           # Code lab components
│   ├── certifications/  # Exam engine
│   ├── landing/         # Marketing page sections
│   ├── layout/          # AppLayout, AppSidebar
│   └── ... (8 more directories)
│
├── hooks/               # Custom React hooks
│   ├── useGamification.ts
│   ├── useAppNotifications.ts
│   └── ... (5 more)
│
├── lib/                 # Utility functions
│   ├── gamification.ts  # XP/level logic
│   ├── codeExecutor.ts  # Judge0 integration
│   └── utils.ts         # General helpers
│
├── integrations/        # External service clients
│   └── supabase/        # Supabase client & types
│
├── data/                # Static data files
│   ├── pythonCourse.ts  # Course content
│   └── certificationData.ts
│
└── assets/              # Static assets (images, logos)
```

---

## Slide 17: Routing & Page Flow

**Objective:** Document all application routes.

**Content:**

| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/` | Index (Landing) | No |
| `/login` | Login | No |
| `/signup` | Signup | No |
| `/dashboard` | Dashboard | Yes |
| `/applications` | Applications | Yes |
| `/arena` | Arena (Code Lab) | Yes |
| `/playground` | Playground | Yes |
| `/assessments` | Assessments | Yes |
| `/contests` | Contests | Yes |
| `/schedule` | Schedule | Yes |
| `/network` | Network (Social) | Yes |
| `/messages` | Messages | Yes |
| `/profile` | Profile | Yes |
| `/profile/:userId` | Public Profile | Yes |
| `/achievements` | Achievements | Yes |
| `/settings` | Settings | Yes |
| `/learning` | Learning | Yes |
| `/certifications` | Certifications | Yes |
| `/certifications/:certId/exam` | ExamEngine | Yes |
| `/certifications/:certId/result/:attemptId` | ResultBreakdown | Yes |
| `/verify/:certificateId` | VerifyCertificate | No |
| `*` | NotFound (404) | No |

**Reference Files:**
- `src/App.tsx` (Routes configuration)

---

## Slide 18: Component Architecture

**Objective:** Explain the component design patterns.

**Content:**

**Design Principles:**
- **Atomic Design:** UI primitives in `components/ui/`, composed into features
- **Co-location:** Feature components live with their pages
- **Lazy Loading:** All pages use `React.lazy()` for code splitting
- **Motion-Enhanced:** Framer Motion for entry/exit animations

**Component Hierarchy:**
```
<App>
  <QueryClientProvider>
    <TooltipProvider>
      <BrowserRouter>
        <Suspense>
          <Routes>
            <Dashboard>
              <AppLayout>
                <AppSidebar />
                <MainContent>
                  <StatsHUD />
                  <TheGarden />
                  <ProgressCharts />
                  ...
                </MainContent>
              </AppLayout>
            </Dashboard>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
</App>
```

**Key Patterns:**
- `AppLayout` wraps all authenticated pages
- `SidebarProvider` manages sidebar state
- `useGamification()` hook provides XP context

---

## Slide 19: State Management & Data Fetching

**Objective:** Explain how state is managed.

**Content:**

**Server State (TanStack Query):**
- Used for all Supabase data fetching
- Automatic caching, background refetch
- Query keys: `['userStats', userId]`, `['dailyActivities', userId]`, etc.

**Client State:**
- React `useState` for local UI state
- No global state library (Redux/Zustand)
- Auth state managed via Supabase listeners

**Realtime Updates:**
- Supabase Realtime channels for live sync
- `postgres_changes` events on `profiles`, `applications`, etc.
- Query invalidation on remote changes

**Example Pattern (from useGamification.ts):**
```typescript
const { data: userStats } = useQuery({
  queryKey: ['userStats', userId],
  queryFn: () => getUserStats(userId),
  enabled: !!userId,
});

// Realtime sync
supabase.channel('gamification')
  .on('postgres_changes', { table: 'profiles' }, () => {
    queryClient.invalidateQueries(['userStats', userId]);
  })
  .subscribe();
```

**Reference Files:**
- `src/hooks/useGamification.ts`
- `src/pages/Dashboard.tsx`

---

## Slide 20: Frontend–Backend Interaction Flow

**Objective:** Show how UI events trigger backend calls.

**Content:**

**UI Event → API Call Mapping:**
| User Action | Frontend Handler | Supabase Call |
|-------------|------------------|---------------|
| Login | `supabase.auth.signInWithPassword` | Auth API |
| Add Application | `supabase.from('applications').insert()` | REST + Realtime |
| Drag App to Offer | `supabase.from('applications').update()` | REST |
| Solve Problem | `supabase.rpc('award_xp')` | RPC Function |
| View Leaderboard | `supabase.from('profiles').select()` | REST |

**Onboarding Logic Location:**
- `src/pages/Signup.tsx` - User creation
- Profile auto-created via Supabase trigger (not in frontend code)
- `initDailyActivity()` called on mount in `useGamification`

**Auth State Handling:**
- `supabase.auth.getSession()` on page load
- `supabase.auth.onAuthStateChange()` for reactive updates
- Redirect to `/login` if no session

**Diagram Description:**
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  User Click  │───▶│ React State  │───▶│  Optimistic  │
│  (Button)    │    │   Update     │    │  UI Update   │
└──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────┐
│              supabase.from('table').insert()         │
│              supabase.rpc('function')                │
└──────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Supabase   │───▶│  PostgreSQL  │───▶│   Realtime   │
│   Edge API   │    │   Database   │    │   Broadcast  │
└──────────────┘    └──────────────┘    └──────────────┘
                                               │
                                               ▼
                    ┌──────────────────────────────────┐
                    │  All Connected Clients Receive   │
                    │  Update via WebSocket            │
                    └──────────────────────────────────┘
```

---

# Section D – Backend Architecture (Slides 21–27)

---

## Slide 21: Backend Tech Stack

**Objective:** Document the backend technology choices.

**Content:**

| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service (BaaS) |
| **PostgreSQL 15** | Primary database |
| **Supabase Auth** | Authentication (Email, OAuth) |
| **Supabase Realtime** | WebSocket pub/sub for live updates |
| **Supabase RPC** | Server-side functions (award_xp, etc.) |
| **Row Level Security (RLS)** | Authorization at database level |
| **Judge0 CE** | External code execution API |

**Serverless Architecture:**
- No custom backend server
- All business logic in PostgreSQL functions
- Frontend directly communicates with Supabase

**Reference Files:**
- `src/integrations/supabase/client.ts`
- `docs/SRS.md` (Section 2.1: High-Level Design)

---

## Slide 22: Backend Folder Structure

**Objective:** Map the Supabase configuration.

**Content:**
```
supabase/
├── config.toml          # Supabase project configuration
└── migrations/          # Database migration files
    ├── 20260203095627_*.sql  # Initial schema
    ├── 20260203095646_*.sql  # Additional tables
    ├── 20260203105617_*.sql  # RLS policies
    ├── 20260203111841_*.sql  # Functions
    ├── 20260203112656_*.sql  # Triggers
    ├── 20260203115947_*.sql  # XP config
    ├── 20260203120016_*.sql  # Leaderboard
    ├── 20260203120222_*.sql  # Notifications
    ├── 20260203161116_*.sql  # Calendar events
    ├── 20260203163343_*.sql  # Network features
    ├── 20260206153700_fix_infinite_xp.sql
    └── 20260211024533_add_user_course_progress.sql
```

**Note:** Actual SQL migration content is in the repository; exact table definitions can be inferred from `src/integrations/supabase/types.ts`.

---

## Slide 23: API Design & Endpoint Overview

**Objective:** Document the API surface.

**Content:**

**Supabase REST API (Auto-generated):**
All tables expose CRUD endpoints via PostgREST:

| Table | Operations | RLS Protected |
|-------|------------|---------------|
| `profiles` | CRUD | Yes (own data only) |
| `applications` | CRUD | Yes |
| `coding_problems` | Read | Yes |
| `submissions` | CRUD | Yes |
| `achievements` | Read | No (public) |
| `user_achievements` | CRUD | Yes |
| `notifications` | CRUD | Yes |
| `connections` | CRUD | Yes |
| `messages` | CRUD | Yes |
| `posts` | CRUD | Yes |
| `post_upvotes` | CRUD | Yes |

**RPC Functions (from types.ts):**
| Function | Parameters | Returns |
|----------|------------|---------|
| `award_xp` | user_id, action, custom_xp | new_level, leveled_up |
| `get_user_activity` | user_id | date, count array |
| `get_course_progress` | user_id | progress object |
| `save_course_progress` | user_id, lessons, hints | void |

---

## Slide 24: Authentication Flow

**Objective:** Detail the auth implementation.

**Content:**

**Supported Methods:**
1. Email/Password (native Supabase Auth)
2. Google OAuth
3. GitHub OAuth

**Flow:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   Supabase  │────▶│  PostgreSQL │
│   Login     │     │   Auth API  │     │  auth.users │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  JWT Token  │
                    │   Issued    │
                    └─────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│  Token stored in localStorage                       │
│  Auto-refresh via supabase-js                       │
│  Session persisted across tabs                      │
└─────────────────────────────────────────────────────┘
```

**Post-Login Trigger:**
- Supabase trigger creates `profiles` row on `auth.users` insert
- Frontend calls `initDailyActivity()` for streak tracking

**Reference Files:**
- `src/pages/Login.tsx`
- `src/integrations/supabase/client.ts`

---

## Slide 25: Request Lifecycle (User Action → Response)

**Objective:** Trace a complete request cycle.

**Content:**

**Example: User drags application to "Offer" status**

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. User drags application card to "Offer" column                       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. Optimistic UI Update                                                │
│    - setApplications() updates local state immediately                 │
│    - Confetti fires, sound plays                                       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. Supabase API Call                                                   │
│    supabase.from('applications').update({ status: 'offer' }).eq('id')  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. PostgreSQL Execution                                                │
│    - RLS check: user_id = auth.uid()                                   │
│    - UPDATE statement executes                                         │
│    - Realtime broadcast triggered                                      │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. Gamification Hook                                                   │
│    recordApplicationUpdate('hr', 'offer')                              │
│    → supabase.rpc('award_xp')                                          │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 6. Response & Sync                                                     │
│    - API returns success                                               │
│    - Realtime channel broadcasts change                                │
│    - Other tabs/users see update instantly                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Slide 26: Error Handling & Validation

**Objective:** Document error handling patterns.

**Content:**

**Frontend Validation:**
- Zod schemas for form validation (mentioned in SRS)
- React Hook Form integration (`@hookform/resolvers`)
- Toast notifications for user feedback

**API Error Handling:**
```typescript
const { error } = await supabase.from('applications').update(data);
if (error) {
  // Revert optimistic update
  setApplications(prev => prev.map(a => 
    a.id === id ? { ...a, status: oldStatus } : a
  ));
  toast({ 
    title: "Error", 
    description: error.message, 
    variant: "destructive" 
  });
}
```

**Error Categories:**
| Type | Handling |
|------|----------|
| Auth errors | Redirect to login |
| Network errors | Toast + retry option |
| Validation errors | Form field highlighting |
| RLS violations | Generic "unauthorized" toast |

**Reference Files:**
- `src/pages/Applications.tsx` (error handling example)

---

## Slide 27: Security Considerations

**Objective:** Document security measures from the codebase.

**Content:**

**Row Level Security (RLS):**
- All tables protected by RLS policies
- Users can only access their own data
- `user_id = auth.uid()` checks enforced

**API Key Exposure:**
- Only `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key) in frontend
- Service role key never exposed (per SRS NFR-SEC-02)

**Input Validation:**
- Zod schemas for type-safe validation
- XSS prevention through React's default escaping

**Environment Variables:**
```
VITE_SUPABASE_URL=<project_url>
VITE_SUPABASE_PUBLISHABLE_KEY=<anon_key>
```

**Security Claims (from UI):**
- "256-bit encryption" badge on login page
- "SOC 2 compliant" badge

**Note:** Actual SOC 2 compliance status cannot be verified from code.

**Reference Files:**
- `src/integrations/supabase/client.ts`
- `docs/SRS.md` (Section 4.2: Security)

---

# Section E – AI Layer (Slides 28–33)

---

## Slide 28: AI Architecture Overview

**Objective:** Document AI capabilities in the current repo.

**Content:**

**⚠️ NOT IMPLEMENTED IN CURRENT REPO**

The repository documentation mentions AI features in the roadmap, but no AI integration code exists in the current codebase.

**Planned AI Features (from PRD Roadmap):**
- v1.1: AI-powered resume parsing and auto-fill
- v2.0: Mock interview marketplace

**Current "Intelligence" (Deterministic):**
- XP calculation formulas
- Level thresholds
- Streak logic
- Achievement unlock rules

---

## Slide 29: LLM / Model Providers Used

**Objective:** Identify any AI/ML integrations.

**Content:**

**NOT IMPLEMENTED IN CURRENT REPO**

No LLM or ML model providers are integrated in the codebase.

**Code Execution (Not AI):**
- Judge0 CE is used for code execution
- This is a sandboxed runtime, not an AI service

**Future Candidates (Assumption):**
If AI were to be added, likely providers would be:
- OpenAI GPT-4
- Anthropic Claude
- Google Gemini

---

## Slide 30: Prompting Pipeline

**Objective:** Document any prompt engineering patterns.

**Content:**

**NOT IMPLEMENTED IN CURRENT REPO**

No prompts, prompt templates, or LLM API calls exist in the codebase.

**If Implemented (Assumption):**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ User Input  │────▶│   Prompt    │────▶│  LLM API    │
│  (Resume)   │     │  Template   │     │   Call      │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────┐
                    │  Parse Response                  │
                    │  Extract: Skills, Experience    │
                    │  Auto-fill application form     │
                    └─────────────────────────────────┘
```

---

## Slide 31: AI Request Flow Diagram

**Objective:** Visualize AI data flow.

**Content:**

**NOT IMPLEMENTED IN CURRENT REPO**

No AI request flow exists.

**Current Code Execution Flow (Judge0):**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ User Code   │────▶│   Base64    │────▶│  Judge0 CE  │
│             │     │   Encode    │     │   API       │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────┐
                    │  Sandboxed Execution             │
                    │  Returns: stdout, stderr, status │
                    │  Runtime: 45ms (example)         │
                    └─────────────────────────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────┐
                    │  Test Case Comparison            │
                    │  Expected vs Actual output       │
                    │  Pass/Fail determination         │
                    └─────────────────────────────────┘
```

**Reference Files:**
- `src/lib/codeExecutor.ts`

---

## Slide 32: Token Usage & Cost Model

**Objective:** Document AI costs if applicable.

**Content:**

**NOT IMPLEMENTED IN CURRENT REPO**

No token usage or AI cost tracking exists.

**Judge0 CE (Current):**
- Public instance: Free (rate limited)
- No API key required
- Self-hosting available for production scale

---

## Slide 33: Deterministic vs AI-driven Components

**Objective:** Clarify what is algorithmic vs AI.

**Content:**

| Component | Type | Implementation |
|-----------|------|----------------|
| XP Calculation | **Deterministic** | SQL function with fixed weights |
| Level Progression | **Deterministic** | `Level = floor(sqrt(XP / 100))` |
| Streak Logic | **Deterministic** | Daily activity check |
| Achievement Unlock | **Deterministic** | Rule-based triggers |
| Leaderboard Ranking | **Deterministic** | SQL ORDER BY xp DESC |
| Code Execution | **Deterministic** | Judge0 sandboxed runtime |
| Test Case Validation | **Deterministic** | String comparison |
| Resume Parsing | **Not Implemented** | Roadmap v1.1 |
| Interview Coach | **Not Implemented** | Roadmap v2.0 |

---

# Section F – Data, Infra & Deployment (Slides 34–38)

---

## Slide 34: Data Model Overview

**Objective:** High-level view of the data architecture.

**Content:**

**Core Entities:**
```
┌─────────────────────────────────────────────────────────────────┐
│                           USERS                                  │
│  auth.users (Supabase Auth) ◄──────────────┐                    │
└─────────────────────────────────────────────┼────────────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    │                     profiles                       │
                    │  Gamification: xp, level, streak, problems_solved │
                    │  Social: full_name, bio, avatar_url, skills       │
                    └───────────────────────────────────────────────────┘
                                              │
        ┌─────────────────┬───────────────────┼───────────────────┬─────────────────┐
        ▼                 ▼                   ▼                   ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ applications  │ │  submissions  │ │ achievements  │ │   messages    │ │     posts     │
│ Job tracking  │ │ Code solutions│ │ User unlocks  │ │ Direct chat   │ │ Network feed  │
└───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
```

---

## Slide 35: Database Schema & Entities

**Objective:** Document all database tables.

**Content:**

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

**Reference Files:**
- `src/integrations/supabase/types.ts`

---

## Slide 36: Environment Variables & Secrets

**Objective:** Document configuration management.

**Content:**

**Frontend Environment Variables:**
```bash
# .env (Vite)
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...  # anon key (safe for client)
```

**Supabase Dashboard Secrets (Not in repo):**
- `service_role` key (server-side only)
- Database connection string
- OAuth provider secrets (Google, GitHub)

**Security Notes:**
- No secrets committed to repository
- `.env` file in `.gitignore`
- Only publishable keys exposed to frontend

**Reference Files:**
- `kibo-v2/.env` (present but not committed to source control)
- `kibo-v2/.gitignore`

---

## Slide 37: Deployment Architecture

**Objective:** Document the deployment infrastructure.

**Content:**

**Frontend Hosting:**
- **Target:** Vercel or Netlify (from SRS)
- **Build:** `vite build` produces static assets
- **CDN:** Edge network for global distribution

**Backend (Supabase):**
- **Database:** Managed PostgreSQL (Supabase cloud)
- **Auth:** Supabase Auth service
- **Realtime:** Supabase Realtime cluster
- **Storage:** Supabase Storage (for avatars, if used)

**Deployment Diagram:**
```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
┌─────────────────────┐           ┌─────────────────────────────┐
│   Vercel/Netlify    │           │      Supabase Cloud         │
│   ┌─────────────┐   │           │   ┌───────────────────┐     │
│   │ Static CDN  │   │◄─────────▶│   │   Edge Network    │     │
│   │ React SPA   │   │   REST    │   │   (PostgREST)     │     │
│   └─────────────┘   │   + WS    │   └───────────────────┘     │
└─────────────────────┘           │           │                  │
                                  │           ▼                  │
                                  │   ┌───────────────────┐     │
                                  │   │   PostgreSQL 15   │     │
                                  │   │   + RLS Policies  │     │
                                  │   └───────────────────┘     │
                                  │           │                  │
                                  │           ▼                  │
                                  │   ┌───────────────────┐     │
                                  │   │  Realtime Cluster │     │
                                  │   │  (WebSockets)     │     │
                                  │   └───────────────────┘     │
                                  └─────────────────────────────┘
```

**Reference Files:**
- `vercel.json` (Vercel configuration)
- `DEPLOY.md` (deployment instructions)

---

## Slide 38: Dev vs Prod Setup

**Objective:** Document environment differences.

**Content:**

**Development:**
```bash
# Install dependencies
npm ci

# Start dev server
npm run dev  # Vite HMR on localhost:5173

# Local Supabase (optional)
supabase start  # Docker-based local instance
```

**Production:**
```bash
# Build optimized bundle
npm run build

# Output: dist/ directory
# Deploy to Vercel/Netlify

# Supabase: Use cloud project
```

**Key Differences:**
| Aspect | Development | Production |
|--------|-------------|------------|
| Vite Mode | HMR, source maps | Minified, tree-shaken |
| Supabase | Local or cloud | Cloud only |
| Judge0 | Public CE instance | Same (or self-hosted) |
| Logging | Console logs | **Not configured** (gap) |
| Error Tracking | Toast messages | **Not configured** (gap) |

**Reference Files:**
- `package.json` (scripts)
- `vite.config.ts`

---

# Section G – System Diagrams (Slides 39–42)

---

## Slide 39: High-Level System Architecture Diagram

**Objective:** Visualize the complete system architecture.

**Content:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         React SPA (Vite)                            │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │    │
│  │  │Dashboard │ │  Arena   │ │  Apps    │ │ Network  │ │ Profile  │  │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │    │
│  │                              │                                       │    │
│  │  ┌───────────────────────────┴────────────────────────────────────┐ │    │
│  │  │                    TanStack Query (Cache)                       │ │    │
│  │  └───────────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │ REST/RPC        │ WebSocket       │
                    ▼                 ▼                 │
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SUPABASE CLOUD                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Edge Network (PostgREST)                        │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │    │
│  │  │  Auth    │ │  REST    │ │   RPC    │ │ Storage  │               │    │
│  │  │  API     │ │  CRUD    │ │ Functions│ │  (Files) │               │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    PostgreSQL 15 + RLS                               │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │    │
│  │  │ profiles │ │   apps   │ │submissions│ │  posts   │               │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                      │                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Realtime Cluster                                │    │
│  │                 (PostgreSQL Logical Replication)                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP (code execution)
                                      ▼
                    ┌─────────────────────────────────────┐
                    │           Judge0 CE API             │
                    │    (External Code Execution)        │
                    └─────────────────────────────────────┘
```

---

## Slide 40: Data Flow Diagram

**Objective:** Show how data moves through the system.

**Content:**

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW DIAGRAM                                │
└───────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐
  │     User     │
  └──────────────┘
         │
         │ 1. User Action (click, type, drag)
         ▼
  ┌──────────────┐
  │  React UI   │──────────────────────────────────────────────────────────┐
  └──────────────┘                                                         │
         │                                                                 │
         │ 2. Event Handler                                                │
         ▼                                                                 │
  ┌──────────────┐                                                         │
  │ Local State  │ ◄── 3. Optimistic Update (immediate UI feedback)        │
  │ (useState)   │                                                         │
  └──────────────┘                                                         │
         │                                                                 │
         │ 4. API Call                                                     │
         ▼                                                                 │
  ┌──────────────┐                                                         │
  │  Supabase    │                                                         │
  │  Client SDK  │ ─────────────────────────────────────────────────────┐  │
  └──────────────┘                                                      │  │
         │                                                              │  │
         │ 5. HTTPS Request (REST or RPC)                               │  │
         ▼                                                              │  │
  ┌──────────────────────────────────────┐                              │  │
  │         Supabase Edge API            │                              │  │
  │  ┌────────────────────────────────┐  │                              │  │
  │  │     RLS Policy Check           │  │                              │  │
  │  │  (user_id = auth.uid())        │  │                              │  │
  │  └────────────────────────────────┘  │                              │  │
  └──────────────────────────────────────┘                              │  │
         │                                                              │  │
         │ 6. SQL Execution                                             │  │
         ▼                                                              │  │
  ┌──────────────────────────────────────┐                              │  │
  │           PostgreSQL                  │                              │  │
  │  ┌────────────────────────────────┐  │                              │  │
  │  │     Tables / Functions         │  │ ─────────┐                   │  │
  │  └────────────────────────────────┘  │          │                   │  │
  └──────────────────────────────────────┘          │                   │  │
         │                                          │                   │  │
         │ 7. Trigger Realtime Broadcast            │ 8. Response       │  │
         ▼                                          │                   │  │
  ┌──────────────────────────────────────┐          │                   │  │
  │        Realtime Cluster              │          │                   │  │
  │  (WebSocket pub/sub)                 │          │                   │  │
  └──────────────────────────────────────┘          │                   │  │
         │                                          │                   │  │
         │ 9. Push to all subscribers               │                   │  │
         ▼                                          ▼                   │  │
  ┌──────────────────────────────────────────────────────────────────┐ │  │
  │  All Connected Clients (including originator)                     │ │  │
  │                                                                   │◄┘  │
  │  10. Query Invalidation → Re-render                               │◄───┘
  └──────────────────────────────────────────────────────────────────┘
```

---

## Slide 41: Sequence Diagram (User → AI → Response)

**Objective:** Detail a typical user interaction sequence.

**Content:**

**Note:** Since AI is not implemented, this shows the Code Execution sequence.

```
┌───────────────────────────────────────────────────────────────────────────┐
│        SEQUENCE DIAGRAM: User Submits Code in Arena                       │
└───────────────────────────────────────────────────────────────────────────┘

  User          React UI        codeExecutor.ts       Judge0 CE       Supabase
   │               │                  │                   │               │
   │──1. Click ───▶│                  │                   │               │
   │   "Submit"    │                  │                   │               │
   │               │                  │                   │               │
   │               │──2. Execute ────▶│                   │               │
   │               │   Code           │                   │               │
   │               │                  │                   │               │
   │               │                  │──3. POST ────────▶│               │
   │               │                  │   /submissions    │               │
   │               │                  │   (base64 code)   │               │
   │               │                  │                   │               │
   │               │                  │                   │──4. Run in ──▶│
   │               │                  │                   │   sandbox     │
   │               │                  │                   │               │
   │               │                  │◀──5. Result ──────│               │
   │               │                  │   {stdout,status} │               │
   │               │                  │                   │               │
   │               │◀──6. Parse ──────│                   │               │
   │               │   Test Results   │                   │               │
   │               │                  │                   │               │
   │◀──7. Show ────│                  │                   │               │
   │   Results +   │                  │                   │               │
   │   Confetti    │                  │                   │               │
   │               │                  │                   │               │
   │               │──────────────────────8. award_xp() ─────────────────▶│
   │               │                  │                   │               │
   │               │◀────────────────────9. {new_xp, level} ◀─────────────│
   │               │                  │                   │               │
   │◀──10. Toast ──│                  │                   │               │
   │   "+25 XP"    │                  │                   │               │
   │               │                  │                   │               │
```

---

## Slide 42: Failure Modes & Recovery Flow

**Objective:** Document error handling and recovery.

**Content:**

```
┌───────────────────────────────────────────────────────────────────────────┐
│                      FAILURE MODES & RECOVERY                              │
└───────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FAILURE: Network Error (API Unreachable)                        │
├─────────────────────────────────────────────────────────────────┤
│ Detection: fetch() throws                                       │
│ User Experience: Toast "Network error"                          │
│ Recovery: Manual retry (no auto-retry implemented)              │
│ Code Location: src/lib/codeExecutor.ts                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FAILURE: Authentication Expired                                  │
├─────────────────────────────────────────────────────────────────┤
│ Detection: supabase.auth.onAuthStateChange(null)                │
│ User Experience: Redirect to /login                             │
│ Recovery: Re-login, session restored                            │
│ Code Location: src/pages/*.tsx (useEffect auth check)           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FAILURE: RLS Policy Violation (Unauthorized Access)             │
├─────────────────────────────────────────────────────────────────┤
│ Detection: Supabase returns error                               │
│ User Experience: Toast "Error: [message]"                       │
│ Recovery: Check auth state, refresh page                        │
│ Code Location: All Supabase calls                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FAILURE: Optimistic Update Rollback                             │
├─────────────────────────────────────────────────────────────────┤
│ Detection: API call fails after UI update                       │
│ User Experience: State reverted, Toast error                    │
│ Recovery: Automatic state rollback                              │
│ Code Location: src/pages/Applications.tsx                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FAILURE: Code Execution Timeout (Judge0)                        │
├─────────────────────────────────────────────────────────────────┤
│ Detection: status_id === 5 (Time Limit Exceeded)                │
│ User Experience: "Time Limit Exceeded" message                  │
│ Recovery: User must optimize code                               │
│ Code Location: src/lib/codeExecutor.ts                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ GAP: No Global Error Boundary                                   │
├─────────────────────────────────────────────────────────────────┤
│ Risk: Unhandled exceptions crash entire app                     │
│ Recommendation: Add React Error Boundary                        │
└─────────────────────────────────────────────────────────────────┘
```

---

# Section H – Evaluation, Limits & Roadmap (Slides 43–48)

---

## Slide 43: What Works Today (Based on Repo)

**Objective:** Summarize production-ready features.

**Content:**

**✅ Fully Implemented & Functional:**
| Feature | Status | Evidence |
|---------|--------|----------|
| Email/OAuth Authentication | ✅ | `Login.tsx`, `Signup.tsx` |
| Kanban Application Tracker | ✅ | `Applications.tsx` |
| Drag-and-Drop Status Updates | ✅ | `Applications.tsx` |
| Monaco Code Editor | ✅ | `Arena.tsx` |
| Judge0 Code Execution (16 langs) | ✅ | `codeExecutor.ts` |
| XP/Level/Streak Gamification | ✅ | `useGamification.ts` |
| Real-time Leaderboard | ✅ | `RealtimeLeaderboard.tsx` |
| Contribution Heatmap (The Garden) | ✅ | `TheGarden.tsx` |
| Achievement System | ✅ | `Achievements.tsx` |
| In-app Notifications | ✅ | `NotificationBell.tsx` |
| Direct Messaging | ✅ | `Messages.tsx` |
| Network Feed (Posts) | ✅ | `Network.tsx` |
| Certification Exams | ✅ | `ExamEngine.tsx` |
| Python Learning Course | ✅ | `Learning.tsx` |
| Responsive Design | ✅ | Tailwind breakpoints |
| 3D Mascot | ✅ | `KiboMascot3D.tsx` |

---

## Slide 44: Known Limitations

**Objective:** Document current constraints.

**Content:**

**Technical Limitations:**
| Limitation | Impact | Workaround |
|------------|--------|------------|
| Judge0 CE public instance | Rate limiting possible | Self-host for production |
| No offline support | App non-functional without network | **None** |
| No PWA manifest | Not installable on mobile | Add manifest.json |
| localStorage auth | Session lost on clear | Use cookies |

**Feature Gaps:**
| Missing Feature | Priority | Status |
|-----------------|----------|--------|
| AI resume parsing | High | Roadmap v1.1 |
| Browser extension | Medium | Roadmap v1.2 |
| Mock interviews | Low | Roadmap v2.0 |
| Mobile native app | Low | Not planned |
| Multi-language UI | Low | English only |

**UX Gaps:**
| Gap | Impact |
|-----|--------|
| No onboarding wizard | Users may feel lost |
| No empty states | Confusing when no data |
| No loading skeletons | Perceived slowness |

---

## Slide 45: Technical Debt & Gaps

**Objective:** Identify areas needing improvement.

**Content:**

**Code Quality Issues:**
| Issue | Location | Severity |
|-------|----------|----------|
| `eslint-disable @typescript-eslint/no-explicit-any` | Dashboard.tsx | Medium |
| Large file size (Arena.tsx > 56KB) | Arena.tsx | Medium |
| No React Error Boundary | App.tsx | High |
| No unit tests for core logic | lib/*.ts | High |
| Console.warn in production | Login.tsx | Low |

**Architecture Gaps:**
| Gap | Risk |
|-----|------|
| No logging/monitoring integration | Blind to production issues |
| No analytics integration | Can't measure user behavior |
| No A/B testing framework | Can't experiment |
| No feature flags | Risky deployments |
| No rate limiting (frontend) | API abuse possible |

**Test Coverage:**
- Vitest configured (`vitest.config.ts`)
- `src/test/` directory exists
- **Actual test coverage: Not determined** (no coverage report in repo)

---

## Slide 46: Scalability Risks

**Objective:** Identify scaling challenges.

**Content:**

**Database Scaling:**
| Risk | Current State | Mitigation |
|------|---------------|------------|
| Leaderboard query (all users) | SELECT * ORDER BY xp | Add pagination, caching |
| Daily activities heatmap | 365-day range query | Aggregate tables |
| Real-time subscriptions | Per-user channels | Connection pooling |

**Frontend Scaling:**
| Risk | Current State | Mitigation |
|------|---------------|------------|
| Bundle size | Lazy loading implemented | Monitor with bundle analyzer |
| 3D model loading | Preloaded on app start | CDN, progressive loading |
| State management | TanStack Query | Consider Zustand for complex state |

**External Dependencies:**
| Service | Risk | Mitigation |
|---------|------|------------|
| Judge0 CE | Rate limits, downtime | Self-host, fallback queue |
| Supabase | Vendor lock-in | Abstract data layer |

---

## Slide 47: Production Readiness Checklist

**Objective:** Evaluate deployment readiness.

**Content:**

| Category | Item | Status |
|----------|------|--------|
| **Security** | RLS policies enabled | ✅ |
| | Input validation (Zod) | ✅ |
| | No secrets in code | ✅ |
| | HTTPS enforced | ⚠️ (deployment dependent) |
| **Performance** | Lazy loading | ✅ |
| | Image optimization | ❌ Not configured |
| | CDN for assets | ⚠️ (deployment dependent) |
| **Reliability** | Error boundaries | ❌ Missing |
| | Retry logic | ❌ Missing |
| | Health checks | ❌ Missing |
| **Monitoring** | Error tracking (Sentry) | ❌ Not configured |
| | Analytics (Mixpanel) | ❌ Not configured |
| | Logging (Datadog) | ❌ Not configured |
| **Testing** | Unit tests | ⚠️ Infrastructure only |
| | E2E tests | ❌ Missing |
| | Load tests | ❌ Missing |
| **Documentation** | README | ✅ |
| | API docs | ❌ Auto-generated only |
| | Runbook | ❌ Missing |

**Verdict:** MVP-ready for demo/staging. Production deployment requires monitoring and error handling improvements.

---

## Slide 48: Roadmap (Clearly Marked as Future)

**Objective:** Present future development plans.

**Content:**

**🚀 FUTURE FEATURES (NOT IMPLEMENTED)**

| Version | Feature | Description | Status |
|---------|---------|-------------|--------|
| **v1.1** | AI Resume Parsing | Auto-fill applications from uploaded resume | 🔮 Planned |
| **v1.1** | Smart Suggestions | AI-powered job recommendations | 🔮 Planned |
| **v1.2** | Browser Extension | One-click job scraping from LinkedIn/Indeed | 🔮 Planned |
| **v1.2** | Mobile App | React Native companion app | 🔮 Planned |
| **v2.0** | Mock Interviews | Peer-to-peer practice rooms | 🔮 Planned |
| **v2.0** | Interview Marketplace | Connect with coaches | 🔮 Planned |
| **v2.0** | Team Workspaces | Cohort-based job hunting | 🔮 Planned |

**Technical Improvements (Not in PRD, recommended):**
| Improvement | Priority |
|-------------|----------|
| Add Sentry for error tracking | High |
| Add Mixpanel for analytics | High |
| Implement React Error Boundary | High |
| Add comprehensive test suite | Medium |
| Create design system documentation | Medium |

**Reference Files:**
- `docs/PRD.md` (Section 7: Roadmap)

---

# Section I – Closing (Slides 49–50)

---

## Slide 49: Why Kibo Wins (Tech Moat)

**Objective:** Articulate competitive advantages.

**Content:**

**Technical Moats:**

| Advantage | Description |
|-----------|-------------|
| **Real-time Architecture** | Sub-100ms state sync via Supabase Realtime |
| **Gamification Engine** | SQL-based XP system with triggers and functions |
| **Integrated Code Lab** | 16-language execution without leaving platform |
| **Type-Safe Stack** | Full TypeScript coverage reduces bugs |
| **Modern DX** | Vite HMR, TanStack Query, Shadcn components |

**UX Moats:**

| Advantage | Description |
|-----------|-------------|
| **Duolingo-Inspired Loops** | Streaks, confetti, sounds create habit formation |
| **Unified Dashboard** | Single source of truth for career journey |
| **3D Personality** | Memorable mascot creates brand identity |

**Why Now:**
- Remote work explosion → More applications per candidate
- Gen Z enters workforce → Expects gamified experiences
- AI readiness → Platform can integrate LLMs when needed

---

## Slide 50: Final Vision Slide

**Objective:** Leave audience with an inspiring conclusion.

**Content:**

**The Vision:**

> "Kibo transforms the chaotic, lonely job hunt into a structured, rewarding game. Every application tracked, every problem solved, every connection made — they all earn XP, build your profile, and accelerate your career."

**Key Metrics (Hypothetical Targets - Not Actual Data):**
- 📊 **100+** applications tracked per user (target)
- 🔥 **30-day** average streak retention (target)
- 🏆 **95%** user satisfaction (target)

**Call to Action:**
- 🚀 Try the demo
- 💻 Review the code
- 🤝 Join the mission

**Contact:**
- Repository: `github.com/Cyrax321/kibo-v7`
- Technology: React + TypeScript + Supabase

---

# Appendix: File Reference Index

## Key Files by Section

| Section | Key Files |
|---------|-----------|
| **Product** | `docs/PRD.md`, `docs/SRS.md` |
| **Frontend** | `src/App.tsx`, `src/pages/*.tsx`, `src/components/**` |
| **State** | `src/hooks/useGamification.ts`, `src/lib/gamification.ts` |
| **Backend** | `src/integrations/supabase/*.ts`, `supabase/migrations/*.sql` |
| **Code Lab** | `src/lib/codeExecutor.ts`, `src/pages/Arena.tsx` |
| **Gamification** | `src/hooks/useGamification.ts`, `src/lib/gamification.ts` |
| **Config** | `package.json`, `vite.config.ts`, `tsconfig.json` |

---

*Document generated from repository analysis. All claims cross-referenced with actual code.*
