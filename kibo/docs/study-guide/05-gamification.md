# 05 – Gamification System (Deep Dive)

## Overview
Kibo's gamification system is inspired by Duolingo and GitHub. It provides XP rewards, level progression, streaks, achievements, leaderboards, and celebration effects to keep users engaged.

**Files involved:**
- `src/lib/gamification.ts` (6,826 bytes) – Core engine (17 functions)
- `src/hooks/useGamification.ts` (10,351 bytes) – React hook (323 lines)
- `src/lib/sounds.ts` (14,999 bytes) – Sound effects (15 types)
- `src/components/dashboard/StatsHUD.tsx` (10,598 bytes) – XP/level display
- `src/components/dashboard/TheGarden.tsx` (9,711 bytes) – Contribution heatmap
- `src/components/dashboard/StreakCalendar.tsx` (4,800 bytes) – Streak calendar
- `src/pages/Achievements.tsx` (13,800 bytes) – Achievement gallery
- `src/components/leaderboard/RealtimeLeaderboard.tsx` – Live ranking

## XP System

### How XP Works:
1. User performs an action (solve problem, add application, complete assessment)
2. Frontend calls `awardXP(userId, action)` from `useGamification` hook
3. Hook calls `supabase.rpc('award_xp', { p_user_id, p_action })`
4. PostgreSQL function looks up XP value in `xp_config` table
5. Updates `profiles.xp`, checks if level threshold crossed
6. Returns `{ new_xp, new_level, xp_gained, leveled_up }`
7. Frontend shows toast, plays sound, fires confetti if level up

### XP-Awarding Actions:
| Action | Trigger | XP | Source |
|--------|---------|-----|--------|
| `problem_solved_easy` | Solve easy problem | Variable | `xp_config` table |
| `problem_solved_medium` | Solve medium problem | Variable | `xp_config` table |
| `problem_solved_hard` | Solve hard problem | Variable | `xp_config` table |
| `application_added` | Add new application | Variable | `xp_config` table |
| `application_status_change` | Move app to new stage | Variable | `xp_config` table |
| `assessment_completed` | Complete any assessment | Variable | `xp_config` table |
| Daily streak bonus | Login on consecutive days | Multiplied | Streak function |
| Achievement unlock | Unlock any achievement | Per-achievement | `achievements` table |

### XP Flow Diagram:
```
User Action → useGamification hook → supabase.rpc('award_xp')
  → PostgreSQL: lookup xp_config → UPDATE profiles SET xp = xp + value
  → Check level_thresholds → Return { new_xp, leveled_up }
  → Frontend: toast("+ XP"), playSound(), if leveled_up → confetti()
```

## Level Progression

- Levels stored in `level_thresholds` table: `{ level, xp_required, title }`
- Each level has an increasing XP requirement
- `calculateLevelProgress(currentXP, thresholds)` returns:
  - Current level number
  - Current level title
  - XP progress to next level (percentage)
  - XP remaining to next level

## Streak System

### How Streaks Work:
1. `initDailyActivity(userId)` called on every dashboard load
2. PostgreSQL checks if `daily_activities` row exists for today
3. If new day: increment streak, create new row
4. If same day: return existing data
5. If day was missed: reset streak to 1

### Streak Bonus:
- Each consecutive day adds a streak multiplier to XP earned
- Longer streaks = more bonus XP per action

## Achievement System

### Architecture:
- `achievements` table: Catalog of all possible achievements (name, description, requirement_type, requirement_value, xp_reward)
- `user_achievements` table: Which achievements each user has unlocked
- `checkAchievements(userId)` RPC: Evaluates ALL unlock conditions at once

### Example Achievements:
| Achievement | Requirement | XP Reward |
|-------------|-------------|-----------|
| First Blood | Solve 1 problem | Bonus XP |
| Streak Master | 7-day streak | Bonus XP |
| Century | Solve 100 problems | Bonus XP |
| Job Hunter | Track 50 applications | Bonus XP |

### Unlock Flow:
```
Action → award_xp → check_achievements → if new unlock:
  → INSERT user_achievements → return achievement info
  → Frontend: toast("Achievement Unlocked!"), playSound('achievement'), confetti()
```

## Leaderboard

- **Component:** `RealtimeLeaderboard.tsx`
- **Data:** `profiles` table ordered by `xp DESC`
- **Real-time:** Supabase channel subscription → live re-ranking
- **Display:** Weekly XP, user avatars, level badges, rank numbers
- **Scope:** Global ranking across all users

## Contribution Heatmap ("The Garden")

- **Component:** `TheGarden.tsx` (9,711 bytes)
- **Concept:** GitHub-style 365-day activity heatmap
- **Data tracked per day:** XP earned, problems solved, applications sent, assessments completed
- **Color intensity:** More activity = darker green
- **Tooltip:** Hover to see daily breakdown
- **Query:** `SELECT * FROM daily_activities WHERE activity_date >= NOW() - 365 days`

## Sound System (15 Sound Types)

**File:** `sounds.ts` (14,999 bytes)
**Technology:** Web Audio API (all sounds generated programmatically — no audio files)

| Sound | Trigger | Description |
|-------|---------|-------------|
| `messageReceived` | New message arrives | Ascending chime |
| `messageSent` | Message sent | Subtle whoosh |
| `connectionRequest` | Connection request | Friendly ping |
| `connectionAccepted` | Connection accepted | Warm celebration |
| `achievement` | Achievement unlocked | Epic fanfare |
| `levelUp` | Level up | Triumphant ascending arpeggio |
| `xpGained` | XP awarded | Soft confirmation |
| `notification` | General notification | Soft bell |
| `success` | Generic success | Satisfying tone |
| `like` | Post upvoted | Bubble pop (Duolingo-style) |
| `comment` | Post commented | Soft notification |
| `offer` | App reaches "Offer" | Epic celebration fanfare |
| `quizPassed` | Quiz passed | Triumphant chime |
| `applicationAdded` | New app created | Rich game reward |

### How Sounds Are Generated:
```javascript
// Using Web Audio API oscillators (sine, triangle, square waves)
const audioCtx = new AudioContext();
const oscillator = audioCtx.createOscillator();
oscillator.type = 'sine';           // Wave type
oscillator.frequency.value = 440;   // Frequency in Hz
oscillator.connect(audioCtx.destination);
oscillator.start();
// Frequency modulation creates melodies
// Gain modulation creates volume envelopes
```

### Key Functions:
- `playSound(type, config)` – Play a specific sound
- `initSoundSystem()` – Initialize Web Audio context
- `isSoundSupported()` – Check browser support
- **Config:** `{ enabled: boolean, volume: number (0-1) }`

## Celebration Effects

### canvas-confetti:
- Fires on: Offer received, problem solved, exam passed, achievement unlocked, level up
- Configurable: colors, particle count, spread, origin point

### Toasts:
- `sonner` for gamification toasts ("+ 25 XP!", "Level Up!")
- Animated icons and progress indicators
- Auto-dismiss after 3-5 seconds

## React Hook: useGamification (323 lines)

### Queries (3):
1. `userStats` – Profile XP, level, streak, problems solved
2. `levelThresholds` – All level definitions
3. `dailyActivities` – 365-day heatmap data

### Mutations (5):
1. `awardXP(action, customXP)` – Award XP → toast + sound
2. `spendXP(action, amount)` – Spend XP
3. `recordProblemSolved(difficulty)` – Track solution → confetti
4. `recordAssessment(id, score, passed, time)` – Track exam → confetti if passed
5. `recordApplicationUpdate(old, new, appId)` – Track status → confetti + sound on offer

### Side Effects per Mutation:
- Toast notification with XP amount
- `playSound()` appropriate type
- `confetti()` for celebrations
- `queryClient.invalidateQueries()` for cache refresh
