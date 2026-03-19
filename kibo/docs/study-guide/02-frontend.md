# 02 – Frontend Architecture (Deep Dive)

## Tech Stack

| Technology | Version | Why We Chose It |
|------------|---------|-----------------|
| **React** | 18.3.1 | Industry standard, component-based, huge ecosystem, virtual DOM for performance |
| **TypeScript** | 5.8.3 | Type safety catches bugs at compile time, better IDE support, self-documenting code |
| **Vite** | 5.4.19 | 10-100x faster than Webpack, native ES modules, instant HMR (Hot Module Replacement) |
| **TailwindCSS** | 3.4.17 | Utility-first CSS eliminates naming conflicts, design consistency, smaller bundle via purging |
| **Shadcn UI** | - | Not a package — code you own. Radix primitives + Tailwind. Accessible, customizable |
| **TanStack Query** | 5.83.0 | Server state caching, background refetch, stale-while-revalidate, optimistic updates |
| **Framer Motion** | 11.18.2 | Declarative animations, gesture support, layout animations, AnimatePresence for exits |
| **React Router** | 6.30.1 | Client-side routing, nested routes, URL params, protected routes |

## Project Structure (376 source files)

```
src/
├── App.tsx                   # Root: QueryClient, Providers, Router, Preloader
├── main.tsx                  # ReactDOM.createRoot entry point
├── index.css                 # 11.5KB global styles, Tailwind @imports, CSS variables
├── vite-env.d.ts             # Vite type declarations
├── pages/          (20 files) # Route-level lazy-loaded page components
├── components/    (298 files) # UI components across 19 directories
├── hooks/          (12 files) # Custom React hooks
├── lib/             (7 files) # Utility modules
├── data/            (3 files) # Static data (courses, questions)
├── integrations/    (2 files) # Supabase client + auto-generated types
├── assets/         (16 files) # Images, logos, 3D models
├── app/            (11 files) # Additional app modules
└── test/            (2 files) # Test files
```

## App.tsx – The Root Component (103 lines)

**What it does:**
1. **3D Asset Preloading** – Initializes DRACOLoader and preloads the GLTF mascot model BEFORE any component mounts
2. **QueryClient** – Creates TanStack Query client for server state management
3. **Provider Hierarchy** – Wraps entire app in providers (Query, Tooltip, Toast)
4. **Preloader** – Shows loading screen until 3D assets are ready
5. **Router** – BrowserRouter with Suspense fallback for lazy-loaded pages
6. **25 Route Definitions** – All mapped to lazy-loaded page components

**Provider Hierarchy (top to bottom):**
```
<QueryClientProvider>     ← TanStack Query cache
  <TooltipProvider>       ← Radix UI tooltips
    <Toaster />           ← Shadcn toast notifications
    <Sonner />            ← Sonner toast notifications
    <Preloader />         ← 3D asset loading screen
    <BrowserRouter>       ← React Router
      <Suspense>          ← Shows PageLoader while lazy chunks load
        <Routes>          ← 25 route definitions
```

**Why two toast systems?** Shadcn Toaster for form validations/errors, Sonner for success notifications and gamification toasts. Different styling contexts.

## Pages (20 Route-Level Components)

Every page is **lazy-loaded** via `React.lazy()` for code splitting — each page becomes a separate JS chunk, loaded only when the user navigates there.

| Page | File Size | Key Features |
|------|-----------|-------------|
| `Index.tsx` | 2.0KB | Landing page wrapper (imports landing components) |
| `Login.tsx` | 15.0KB | Email/password + OAuth, trust badges, feature pills |
| `Signup.tsx` | 16.6KB | Registration with Zod validation, React Hook Form |
| `Dashboard.tsx` | 8.6KB | Orchestrates 16 dashboard widgets |
| `Applications.tsx` | 15.9KB | Kanban board + table view toggle, drag-and-drop |
| `Arena.tsx` | 57.2KB | Monaco editor, problem solving, Judge0 execution |
| `Playground.tsx` | 19.1KB | Free-form code playground |
| `Assessments.tsx` | 21.0KB | Quiz/assessment hub |
| `Contests.tsx` | 12.2KB | Competitive programming contests |
| `Schedule.tsx` | 25.1KB | Calendar with event management |
| `Network.tsx` | 14.8KB | Social feed, posts, connections |
| `Messages.tsx` | 10.7KB | Direct messaging |
| `Profile.tsx` | 18.9KB | User profile with stats |
| `Achievements.tsx` | 13.8KB | Achievement gallery |
| `Settings.tsx` | 9.2KB | Preferences |
| `Learning.tsx` | 345B | Python course (delegates to learning component) |
| `Certifications.tsx` | 27.9KB | Certification catalog and exam launcher |
| `Notes.tsx` | 5.5KB | Note listing + editor |
| `SharedNote.tsx` | 6.4KB | Public shared note view |
| `NotFound.tsx` | 727B | 404 page |

## Component Architecture (298 components, 19 directories)

| Directory | Count | Purpose |
|-----------|-------|---------|
| `ui/` | 157 | Shadcn/Radix primitives (Button, Card, Dialog, etc.) |
| `editor/` | 65 | PlateJS rich-text editor components |
| `dashboard/` | 16 | Dashboard analytics widgets |
| `landing/` | 11 | Marketing landing page sections |
| `applications/` | 7 | Application tracker components |
| `assessments/` | 7 | Quiz/assessment components |
| `network/` | 5 | Social features components |
| `notes/` | 5 | Note editor components |
| `certifications/` | 4 | Exam engine components |
| `arena/` | 4 | Code lab components |
| `kibo/` | 4 | Brand components (logo, mascot, pricing) |
| `messages/` | 3 | Chat components |
| `schedule/` | 3 | Calendar components |
| `layout/` | 2 | AppLayout + AppSidebar |
| `leaderboard/` | 1 | RealtimeLeaderboard |
| `learning/` | 1 | Course viewer |
| `notifications/` | 1 | NotificationBell |
| `profile/` | 1 | Profile display |

### Design Patterns:
1. **Atomic Design** – UI primitives in `ui/`, composed into feature components
2. **Co-location** – Feature components live alongside their page
3. **Lazy Loading** – All pages use `React.lazy()` for code splitting
4. **Motion-Enhanced** – Framer Motion wrapper for enter/exit animations

## Routing (25 Routes)

| Route | Auth? | Description |
|-------|-------|-------------|
| `/` | No | Landing page |
| `/login` | No | Login |
| `/signup` | No | Registration |
| `/dashboard` | Yes | Mission Control dashboard |
| `/applications` | Yes | Job application tracker |
| `/arena` | Yes | Code Lab (problem solving) |
| `/playground` | Yes | Free-form code editor |
| `/assessments` | Yes | Quizzes and assessments |
| `/contests` | Yes | Competitive coding |
| `/schedule` | Yes | Calendar |
| `/network` | Yes | Social feed |
| `/messages` | Yes | Direct messaging |
| `/profile` | Yes | Own profile |
| `/profile/:userId` | Yes | Other user's profile |
| `/achievements` | Yes | Achievement gallery |
| `/settings` | Yes | Preferences |
| `/learning` | Yes | Python course |
| `/certifications` | Yes | Cert catalog |
| `/certifications/:certId/exam` | Yes | Take exam |
| `/certifications/:certId/result/:attemptId` | Yes | Exam results |
| `/verify/:certificateId` | No | Public certificate verification |
| `/notes` | Yes | Notes list |
| `/notes/:noteId` | Yes | Specific note |
| `/shared/:shareToken` | No | Shared note (public) |
| `*` | No | 404 Not Found |

**Auth protection:** Pages check `supabase.auth.getSession()` and redirect to `/login` if no session exists. Auth state changes are tracked via `supabase.auth.onAuthStateChange()`.

## State Management Strategy

### Server State (TanStack Query):
- **ALL Supabase data** fetched via `useQuery` hooks
- Automatic caching, background refetch, stale-while-revalidate
- Query keys follow pattern: `['entity', userId]` e.g. `['userStats', 'abc-123']`
- Mutations via `useMutation` with `onSuccess` cache invalidation

### Client State (React useState):
- Local UI state only (form inputs, toggle states, selected tabs)
- No global state library (no Redux, no Zustand, no Jotai)
- **Why no global state?** TanStack Query handles server state; remaining state is local to components

### Auth State:
- Managed via Supabase listeners
- `supabase.auth.getSession()` on mount
- `supabase.auth.onAuthStateChange()` for reactive updates

### Realtime Updates:
- Supabase Realtime channel subscriptions
- `postgres_changes` events trigger query invalidation
- All connected clients see updates instantly via WebSocket

## Key Libraries Explained

### TailwindCSS (tailwind.config.ts – 5.6KB):
- Custom color palette using CSS variables for theming
- Extended animations: accordion, collapsible, sidebar
- Typography plugin for prose content
- Scrollbar hide plugin
- Animate plugin for utility animations

### Framer Motion (animations):
- Page enter/exit transitions
- Dashboard widget stagger animations
- Hover/tap micro-interactions
- Layout animations for list reordering

### canvas-confetti:
- Fires on: Offer received, problem solved, exam passed, achievement unlocked, level up

### Shadcn UI (157 components):
28 Radix primitive categories: Accordion, AlertDialog, AspectRatio, Avatar, Checkbox, Collapsible, ContextMenu, Dialog, DropdownMenu, HoverCard, Label, Menubar, NavigationMenu, Popover, Progress, RadioGroup, ScrollArea, Select, Separator, Slider, Slot, Switch, Tabs, Toast, Toggle, ToggleGroup, Toolbar, Tooltip

### Monaco Editor:
- VS Code's editor engine in the browser
- Syntax highlighting, IntelliSense, minimap
- Used in Arena and Playground pages

## Custom Hooks (12 total)

| Hook | Lines | Purpose | Key Queries/Mutations |
|------|-------|---------|----------------------|
| `useGamification` | 323 | XP, levels, streaks | 3 queries, 5 mutations |
| `useCertifications` | 337 | Exam management | 3 queries, 2 mutations |
| `useNotes` | 291 | Note CRUD + sharing | 1 query, 8 mutations |
| `useAppNotifications` | ~180 | Notification system | 2 queries, 2 mutations |
| `usePushNotifications` | ~120 | Browser push | 0 queries, 1 mutation |
| `useScrollReveal` | ~50 | Scroll animations | IntersectionObserver |
| `use-toast` | ~100 | Toast state | State management |
| `use-upload-file` | ~90 | File upload | Upload progress |
| `use-debounce` | ~15 | Debounce values | Timer |
| `use-is-touch-device` | ~15 | Touch detection | matchMedia |
| `use-mobile` | ~15 | Mobile breakpoint | matchMedia |
| `use-mounted` | ~8 | Mount state | useEffect |

## Lib Modules (7 files)

| Module | Size | Purpose |
|--------|------|---------|
| `gamification.ts` | 6.8KB | XP engine (17 exported functions) |
| `codeExecutor.ts` | 5.8KB | Judge0 CE integration |
| `sounds.ts` | 14.9KB | Web Audio API sound system (15 types) |
| `course-progress.ts` | 1.2KB | Learning progress tracking |
| `markdown-joiner-transform.ts` | 6.6KB | Markdown processing |
| `uploadthing.ts` | 508B | File upload config |
| `utils.ts` | 169B | `cn()` helper (clsx + tailwind-merge) |

## Responsive Design
- TailwindCSS breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`, `2xl:1536px`
- Custom `use-mobile.tsx` hook detects mobile viewport
- Sidebar collapses on mobile (via `SidebarProvider`)
- Grid layouts adapt (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Touch-friendly interactions via `use-is-touch-device.ts`
