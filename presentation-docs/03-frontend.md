# Kibo Frontend Architecture

## Complete Frontend Technical Documentation

---

## 1. Frontend Architecture Overview

Kibo's frontend is built with **React 18** using **TypeScript** for type safety, following modern best practices for scalability and maintainability.

### Key Architectural Principles:
- **Component-Driven Development**: Modular, reusable UI components
- **Type Safety**: Full TypeScript implementation with strict typing
- **Lazy Loading**: Route-based code splitting for optimal performance
- **Server State Management**: TanStack Query for data fetching and caching
- **Real-time Sync**: Supabase Realtime for live updates
- **Optimistic UI**: Immediate feedback before server confirmation

---

## 2. Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 18.3.1 |
| Language | TypeScript 5.8.3 |
| Build Tool | Vite 5.4.19 |
| Routing | React Router DOM 6.30.1 |
| State Management | TanStack Query 5.83.0 |
| Styling | TailwindCSS 3.4.17 |
| UI Components | Shadcn/UI + Radix UI |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion 11.18.2 |
| Charts | Recharts 2.15.4 |
| Rich Text | Plate.js 52.x |
| Code Editor | Monaco Editor 4.7.0 |
| 3D Graphics | React Three Fiber 8.18.0 |
| Testing | Vitest 3.2.4 |
| Linting | ESLint 9.32.0 |

---

## 3. Project Structure

```
src/
├── components/
│   ├── ui/                    # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── progress.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toaster.tsx
│   │   ├── tooltip.tsx
│   │   └── ...
│   ├── dashboard/            # Dashboard widgets
│   │   ├── StatsHUD.tsx
│   │   ├── TheGarden.tsx
│   │   ├── WeeklyGoals.tsx
│   │   ├── SkillsRadar.tsx
│   │   ├── ProgressCharts.tsx
│   │   ├── ApplicationFunnel.tsx
│   │   ├── LiveActivityFeed.tsx
│   │   ├── StreakCalendar.tsx
│   │   ├── SuccessRateGauge.tsx
│   │   ├── CodeLabDashboard.tsx
│   │   ├── CodeLabAnalytics.tsx
│   │   └── ...
│   ├── editor/                # Rich text editor
│   │   ├── plate-editor.tsx
│   │   ├── editor-kit.tsx
│   │   ├── editor-base-kit.tsx
│   │   ├── settings-dialog.tsx
│   │   └── transforms.ts
│   ├── landing/               # Landing page
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── learning/              # Learning modules
│   │   ├── CourseViewer.tsx
│   │   └── ...
│   ├── messages/              # Chat system
│   │   ├── ChatArea.tsx
│   │   ├── ConversationList.tsx
│   │   ├── StarterMessages.tsx
│   │   └── ...
│   ├── network/               # Social features
│   │   ├── PostCard.tsx
│   │   ├── ConnectionRequestCard.tsx
│   │   ├── CreatePost.tsx
│   │   ├── ConnectDialog.tsx
│   │   └── MyConnectionsManager.tsx
│   ├── schedule/              # Calendar
│   │   ├── UpcomingEvents.tsx
│   │   ├── QuickStats.tsx
│   │   └── EventDetailsPanel.tsx
│   ├── leaderboard/           # Leaderboard
│   │   └── RealtimeLeaderboard.tsx
│   ├── applications/          # Job applications
│   │   ├── ApplicationDetailPanel.tsx
│   │   └── AddApplicationDialog.tsx
│   ├── certifications/        # Exams
│   │   ├── ExamEngine.tsx
│   │   ├── ResultBreakdown.tsx
│   │   ├── VerifyCertificate.tsx
│   │   └── types.ts
│   ├── layout/                # Layout components
│   │   ├── AppLayout.tsx
│   │   ├── AppSidebar.tsx
│   │   └── NavLink.tsx
│   └── landing/               # Landing page
├── pages/                     # Route pages
│   ├── Index.tsx             # Landing page
│   ├── Login.tsx             # Login page
│   ├── Signup.tsx            # Signup page
│   ├── Dashboard.tsx         # Main dashboard
│   ├── Applications.tsx      # Job tracker
│   ├── Arena.tsx             # Coding problems
│   ├── Playground.tsx       # Code editor
│   ├── Assessments.tsx      # Skill tests
│   ├── Contests.tsx         # Coding contests
│   ├── Schedule.tsx          # Calendar
│   ├── Network.tsx          # Social network
│   ├── Messages.tsx          # Chat
│   ├── Profile.tsx          # User profile
│   ├── Achievements.tsx     # Achievements
│   ├── Settings.tsx         # Settings
│   ├── Learning.tsx         # Course learning
│   ├── Certifications.tsx  # Exams
│   ├── Notes.tsx            # Notes
│   ├── SharedNote.tsx       # Shared notes
│   └── NotFound.tsx         # 404 page
├── hooks/                     # Custom hooks
│   ├── useGamification.ts   # Gamification logic
│   ├── useNotes.ts          # Notes CRUD
│   ├── useCertifications.ts  # Exam logic
│   ├── useAppNotifications.ts # Notifications
│   ├── usePushNotifications.ts # Browser notifications
│   ├── useScrollReveal.ts   # Scroll animations
│   ├── useDebounce.ts       # Debounce utility
│   ├── useMobile.tsx        # Mobile detection
│   ├── useMounted.ts        # Mount detection
│   ├── use-is-touch-device.ts # Touch detection
│   └── use-toast.ts         # Toast notifications
├── lib/                       # Utility libraries
│   ├── supabase/            # Supabase client
│   │   ├── client.ts        # Main client
│   │   └── types.ts         # Database types
│   ├── gamification.ts      # XP & achievements
│   ├── codeExecutor.ts      # Judge0 integration
│   ├── utils.ts             # Utility functions
│   ├── sounds.ts            # Sound effects
│   ├── course-progress.ts   # Course tracking
│   ├── markdown-joiner-transform.ts # Markdown utils
│   └── uploadthing.ts      # File uploads
├── data/                      # Static data
│   ├── pythonCourse.ts       # Python course content
│   ├── certificationData.ts # Certification catalog
│   └── certQuestionBank.ts  # Exam questions
├── assets/                   # Static assets
│   ├── logos/               # Company logos
│   ├── 3D/                  # 3D models
│   └── images/              # Course images
├── App.tsx                   # Main app component
├── main.tsx                  # Entry point
└── vite-env.d.ts            # Vite type definitions
```

---

## 4. Core Components Deep Dive

### 4.1 App.tsx - Main Application

```typescript
// Key features:
- Lazy loading all route components
- 3D asset preloading for instant feel
- QueryClient setup with default options
- Global toast/tooltip providers
- Browser router configuration

// Lazy loaded routes:
- / → Index (Landing)
- /login → Login
- /signup → Signup
- /dashboard → Dashboard
- /applications → Applications
- /arena → Arena
- /playground → Playground
- /assessments → Assessments
- /contests → Contests
- /schedule → Schedule
- /network → Network
- /messages → Messages
- /profile → Profile
- /achievements → Achievements
- /settings → Settings
- /learning → Learning
- /certifications → Certifications
- /certifications/:certId/exam → ExamEngine
- /certifications/:certId/result/:attemptId → ResultBreakdown
- /verify/:certificateId → VerifyCertificate
- /notes → Notes
- /notes/:noteId → Notes
- /shared/:shareToken → SharedNote
```

### 4.2 Dashboard Components

#### StatsHUD.tsx
- Real-time display of key metrics
- XP, Level, Streak, Problems Solved, Applications
- Animated number transitions
- Real-time updates via Supabase subscriptions

#### TheGarden.tsx
- GitHub-style contribution heatmap
- 365-day activity visualization
- Color intensity based on activity level
- Tooltip on hover showing daily stats

#### ProgressCharts.tsx
- Line charts for XP trends
- Recharts library integration
- Time range selection (7d, 30d, 90d, 1y)
- Animated data transitions

#### SkillsRadar.tsx
- Radar chart showing skill categories
- Six-axis visualization
- Dynamic data updates

#### ApplicationFunnel.tsx
- Pipeline visualization
- Status-based grouping (wishlist, applied, interview, offer, rejected)
- Click-to-filter functionality

### 4.3 Code Execution Components

#### Monaco Editor Integration
- Syntax highlighting for 15+ languages
- IntelliSense autocomplete
- Theme customization
- Error highlighting

#### Code Executor (Judge0 CE)
```typescript
// Supported languages:
- JavaScript (Node.js)
- Python
- C++
- C
- Java
- TypeScript
- C#
- Go
- Rust
- Kotlin
- Swift
- Ruby
- PHP
- R
- Perl
- Bash

// Features:
- Base64 encoded submissions
- Real-time execution
- Test case validation
- Runtime and memory metrics
- Compilation error handling
```

### 4.4 Rich Text Editor (Plate.js)

- Markdown support
- Code blocks with syntax highlighting
- Tables, lists, blockquotes
- Custom toolbar
- Slash commands
- Emoji support
- Image embedding

### 4.5 Gamification Components

#### useGamification Hook
```typescript
// Features:
- Real-time XP tracking
- Streak management
- Achievement checking
- Level progression
- Daily activity initialization
- Toast notifications with confetti
- Sound effects

// Actions:
- awardXP(action, customXP)
- recordProblemSolved(difficulty)
- recordAssessment(assessmentId, score, passed, timeTaken)
- recordApplicationUpdate(oldStatus, newStatus)
```

---

## 5. State Management

### 5.1 TanStack Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### 5.2 Query Keys Structure

```typescript
// Common query keys:
['userStats', userId]
['dailyActivities', userId]
['levelThresholds']
['applications', userId]
['submissions', userId]
['problems']
['achievements']
['connections', userId]
['messages', userId]
['notifications', userId]
['notes', userId]
['certifications']
['assessments']
```

### 5.3 Optimistic Updates

```typescript
// Example: Adding a new application
const addApplicationMutation = useMutation({
  mutationFn: createApplication,
  onMutate: async (newApplication) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['applications', userId])
    
    // Snapshot previous value
    const previousApps = queryClient.getQueryData(['applications', userId])
    
    // Optimistically update
    queryClient.setQueryData(['applications', userId], (old) => [
      ...old,
      { ...newApplication, id: 'temp-' + Date.now() }
    ])
    
    return { previousApps }
  },
  onError: (err, newApp, context) => {
    // Rollback on error
    queryClient.setQueryData(['applications', userId], context.previousApps)
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries(['applications', userId])
  },
})
```

---

## 6. Real-time Subscriptions

### 6.1 Subscription Pattern

```typescript
// Setup subscription
useEffect(() => {
  const channel = supabase
    .channel(`table:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'table_name',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        // Handle changes
        handleChange(payload)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [userId])
```

### 6.2 Tables with Realtime

- **profiles**: XP, level, streak updates
- **daily_activities**: Activity heatmap
- **user_achievements**: New achievements
- **messages**: New messages
- **notifications**: Push notifications
- **connections**: Connection status
- **posts**: Community feed updates
- **submissions**: Code execution results

---

## 7. Authentication Flow

### 7.1 Login/Signup
```
1. User enters credentials
2. Supabase.auth.signInWithPassword()
3. JWT token returned and stored
4. Redirect to dashboard
5. Load user profile and stats
```

### 7.2 Auth State Management

```typescript
// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // User signed in
    setUser(session.user)
    loadUserData()
  } else if (event === 'SIGNED_OUT') {
    // User signed out
    clearUserData()
    redirect to login
  }
})
```

### 7.3 Protected Routes

```typescript
// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return <Loading />
  
  if (!user) return <Navigate to="/login" />
  
  return children
}
```

---

## 8. Performance Optimizations

### 8.1 Code Splitting

```typescript
// Lazy loading all pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Applications = lazy(() => import('./pages/Applications'))
// etc.
```

### 8.2 Asset Preloading

```typescript
// Preload 3D model on app start
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

useLoader.preload(GLTFLoader, '/kibo-new.glb', (loader) => {
  loader.setDRACOLoader(dracoLoader)
})
```

### 8.3 Image Optimization

```typescript
// Lazy load images
<img loading="lazy" src={imageUrl} />

// Use Next.js-style Image component if needed
```

### 8.4 Virtual Scrolling

```typescript
// For large lists like leaderboard
import { useVirtualizer } from '@tanstack/react-virtual'
```

---

## 9. Form Handling

### 9.1 React Hook Form + Zod

```typescript
// Example: Login form
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginForm() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginForm) => {
    // Handle submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  )
}
```

---

## 10. Styling System

### 10.1 TailwindCSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Shadcn theme variables
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

### 10.2 Component Variants (CVA)

```typescript
// Using class-variance-authority
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background',
        ghost: 'hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
```

---

## 11. Testing Strategy

### 11.1 Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 11.2 Test Structure

```typescript
// src/test/example.test.ts
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Kibo')).toBeDefined()
  })
})
```

---

## 12. Build & Deployment

### 12.1 Build Commands

```bash
npm run dev          # Development server
npm run build       # Production build
npm run build:dev   # Development build
npm run preview     # Preview production build
npm run lint        # Lint code
npm run test        # Run tests
npm run test:watch  # Watch mode
```

### 12.2 Environment Variables

```bash
# .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

---

## 13. Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

---

## 14. Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance (WCAG AA)
- Reduced motion support

---

## 15. Internationalization (i18n)

- React Intl for string translations
- Date/time localization
- Number formatting
- RTL support ready

---

*This frontend documentation covers all aspects of the Kibo client-side implementation, from component architecture to state management and performance optimization.*
