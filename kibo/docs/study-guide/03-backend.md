# 03 – Backend Architecture (Deep Dive)

## Architecture: Serverless BaaS (Backend-as-a-Service)

Kibo uses **Supabase** as the entire backend. There is NO custom Node.js/Express/Django server. All business logic lives in PostgreSQL functions, and the frontend talks directly to Supabase APIs.

**Why Supabase?**
- Built on PostgreSQL (battle-tested, ACID compliant)
- Auto-generated REST API via PostgREST
- Built-in Auth (email, OAuth, JWT)
- Realtime subscriptions via WebSocket
- Row Level Security for authorization
- Free tier available, scales to production
- TypeScript type generation

## Supabase Services Used

| Service | Purpose | Protocol |
|---------|---------|----------|
| **Supabase Auth** | User authentication (email, Google, GitHub) | HTTPS |
| **PostgREST** | Auto-generated CRUD REST API from schema | HTTPS |
| **Supabase RPC** | Call PostgreSQL functions from frontend | HTTPS |
| **Supabase Realtime** | Live data sync via WebSocket channels | WSS |
| **Supabase Storage** | File storage for avatars, uploads | HTTPS |

## Database: PostgreSQL 15

### 21+ Tables (Complete List):

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `profiles` | User gamification + social data | user_id, full_name, xp, level, streak, skills[], avatar_url, country |
| `applications` | Job application tracking | user_id, company, role, status (enum), salary, location, url, is_remote |
| `coding_problems` | Problem definitions | title, description, difficulty, test_cases (JSONB), company_tags, topic_tags |
| `submissions` | Code submission records | user_id, problem_id, code, language, status, runtime_ms |
| `achievements` | Achievement catalog | name, description, requirement_type, requirement_value, xp_reward |
| `user_achievements` | Unlocked achievements per user | user_id, achievement_id, unlocked_at |
| `daily_activities` | Daily tracking (heatmap data) | user_id, activity_date, xp_earned, problems_solved, applications_sent |
| `level_thresholds` | Level progression rules | level, xp_required, title |
| `xp_config` | XP values per action | id (action_name), xp_value |
| `notifications` | In-app notifications | user_id, title, body, type, is_read |
| `connections` | User social connections | user_id_1, user_id_2, status (pending/accepted/rejected) |
| `messages` | Direct messages | sender_id, receiver_id, content, created_at |
| `posts` | Network feed posts | user_id, content, post_type, upvotes |
| `post_upvotes` | Post reactions | post_id, user_id |
| `assessment_attempts` | Exam/quiz attempts | user_id, assessment_id, answers (JSONB), score, status |
| `study_sessions` | Study time tracking | user_id, duration_minutes, topic |
| `user_course_progress` | Learning progress | user_id, completed_lessons[], unlocked_hints[] |
| `calendar_events` | Schedule events | user_id, title, start_time, end_time, type |
| `skills` | Skill definitions | name, category |
| `notes` | User notes | user_id, title, content, tags[], color, is_pinned, is_archived |
| `note_shares` | Note sharing tokens | note_id, user_id, share_token, access_level, is_active |

### Application Status Enum:
`wishlist` → `applied` → `oa` → `technical` → `hr` → `offer`

## RPC Functions (Server-Side PostgreSQL Functions)

These run INSIDE PostgreSQL, not in the frontend. Called via `supabase.rpc()`.

| Function | Parameters | Returns | What It Does |
|----------|------------|---------|-------------|
| `award_xp` | p_user_id, p_action, p_custom_xp | new_xp, new_level, xp_gained, leveled_up | Awards XP, updates level, returns new state |
| `record_problem_solved` | p_user_id, p_difficulty | XPResult + new_problems_solved | Awards XP based on difficulty, increments counter |
| `record_assessment_completed` | p_user_id, p_assessment_id, p_score, p_passed, p_time_taken | XPResult | Records attempt and awards XP |
| `record_application_update` | p_user_id, p_old_status, p_new_status, p_application_id | new_xp, xp_gained | Awards XP for status progression |
| `init_daily_activity` | p_user_id | streak, daily_xp, is_new_day | Creates/updates daily row, manages streak |
| `check_achievements` | p_user_id | achievement_id, name, xp_reward | Checks all unlock conditions, awards new ones |
| `get_user_activity` | user_id | date, count array | Returns activity data for heatmap |
| `get_course_progress` | user_id | progress object | Returns completed lessons and hints |
| `save_course_progress` | user_id, lessons, hints | void | Saves learning progress |

**Why RPC instead of frontend logic?**
- **Atomic operations** – XP award + level check + streak update in single transaction
- **Security** – Logic can't be tampered with by modifying frontend code
- **Consistency** – Server-side validation ensures data integrity
- **Performance** – Single round-trip instead of multiple API calls

## Authentication System

### Supported Methods:
1. **Email/Password** – Native Supabase Auth
2. **Google OAuth** – Social login via Google
3. **GitHub OAuth** – Social login via GitHub

### Auth Flow:
```
1. User submits credentials (email+password or OAuth)
2. Supabase Auth API validates → creates session
3. JWT token issued → stored in localStorage
4. supabase-js auto-refreshes token before expiry
5. DB trigger auto-creates `profiles` row on first login
6. Frontend calls initDailyActivity() for streak tracking
```

### Session Management:
- JWT stored in localStorage (auto-managed by supabase-js)
- `supabase.auth.getSession()` – Check current session
- `supabase.auth.onAuthStateChange()` – React to login/logout events
- Token auto-refresh prevents session expiry during use

## Row Level Security (RLS) – Authorization

RLS is PostgreSQL's built-in authorization mechanism. Every query is filtered by policies.

### How it works:
```sql
-- Example: Users can only read their own applications
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  USING (user_id = auth.uid());

-- Example: Users can insert their own applications
CREATE POLICY "Users can insert own applications"
  ON applications FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

### Policy Summary:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | Own only | Auto (trigger) | Own only | — |
| `applications` | Own only | Own only | Own only | Own only |
| `submissions` | Own only | Own only | Own only | Own only |
| `notifications` | Own only | Own only | Own only | Own only |
| `messages` | Sent/Received | Own sender | — | — |
| `connections` | Own connections | Own | Own | Own |
| `posts` | All (public) | Own | Own | Own |
| `achievements` | All (public) | — | — | — |
| `user_achievements` | Own | Own | — | — |
| `notes` | Own | Own | Own | Own |
| `note_shares` | Token-based | Own | Own | Own |

## Realtime System (WebSocket)

Supabase Realtime enables live data sync. When a row changes in PostgreSQL, all subscribed clients receive the change instantly.

### Channels Used:
- `gamification` – XP/level updates
- `applications` – Application status changes
- `notifications` – New notifications
- `messages` – Direct messages
- `network` – Posts and connections

### Subscription Pattern:
```typescript
supabase.channel('channel-name')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'profiles' },
    (payload) => {
      queryClient.invalidateQueries(['userStats', userId]);
    }
  )
  .subscribe();
```

**How it works under the hood:**
1. PostgreSQL logical replication captures row changes
2. Supabase Realtime server reads the replication stream
3. Broadcasts changes to subscribed WebSocket clients
4. Frontend receives event → invalidates TanStack Query cache → UI re-renders

## Database Migrations (12 files, ~54KB SQL)

| # | Date | File | Size | Purpose |
|---|------|------|------|---------|
| 1 | Feb 3 | `20260203095627_*.sql` | 4.6KB | Core tables: profiles, applications, coding_problems |
| 2 | Feb 3 | `20260203095646_*.sql` | 257B | Additional table configs |
| 3 | Feb 3 | `20260203105617_*.sql` | 15.4KB | RLS policies for ALL tables |
| 4 | Feb 3 | `20260203111841_*.sql` | 15.3KB | PostgreSQL functions (award_xp, etc.) |
| 5 | Feb 3 | `20260203112656_*.sql` | 4.6KB | Triggers (auto-create profile, etc.) |
| 6 | Feb 3 | `20260203115947_*.sql` | 1.4KB | XP configuration values |
| 7 | Feb 3 | `20260203120016_*.sql` | 369B | Leaderboard views |
| 8 | Feb 3 | `20260203120222_*.sql` | 819B | Notification system |
| 9 | Feb 3 | `20260203161116_*.sql` | 1.7KB | Calendar events table |
| 10 | Feb 3 | `20260203163343_*.sql` | 7.1KB | Network features (posts, connections, messages) |
| 11 | Feb 6 | `fix_infinite_xp.sql` | 2.5KB | Bug fix: Infinite XP exploit |
| 12 | Feb 11 | `add_user_course_progress.sql` | 650B | Course progress tracking table |

## Supabase Client Configuration

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,       // https://<project>.supabase.co
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY  // anon key (safe for client)
);
```

**Type Safety:** Auto-generated `types.ts` provides complete TypeScript types for all tables, views, functions, and enums. This means every database query is type-checked at compile time.
