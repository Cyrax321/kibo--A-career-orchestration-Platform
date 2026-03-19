# Kibo Gamification System

## Complete Gamification Technical Documentation

---

## 1. Gamification Overview

Kibo implements a comprehensive **gamification engine** designed to drive user engagement through:

- **Experience Points (XP)**: Core currency for progression
- **Level System**: 100 levels with increasing XP requirements
- **Streak Tracking**: Daily activity streaks with bonus multipliers
- **Achievements**: Unlockable badges with XP rewards
- **Leaderboards**: Competitive ranking system
- **Real-time Notifications**: Instant feedback on progress

---

## 2. XP System

### 2.1 XP Actions Table

| Action | XP Value | Description |
|--------|----------|-------------|
| `login` | 5 | Daily login bonus |
| `problem_easy` | 10 | Solve easy problem |
| `problem_medium` | 20 | Solve medium problem |
| `problem_hard` | 50 | Solve hard problem |
| `application_wishlist` | 2 | Add to wishlist |
| `application_sent` | 15 | Send job application |
| `application_interview` | 30 | Get interview |
| `application_offer` | 100 | Receive offer |
| `assessment_passed` | 25 | Pass assessment |
| `assessment_completed` | 10 | Complete assessment |
| `certification_passed` | 100 | Pass certification |
| `connection_made` | 5 | Make connection |
| `post_created` | 3 | Create post |
| `post_upvote_received` | 2 | Receive upvote |
| `study_session` | 1 | Per minute of study |
| `achievement` | Varies | Achievement reward |
| `daily_streak_bonus` | streak * 2 | Streak multiplier |

### 2.2 XP Calculation Functions

#### award_xp Function
```sql
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_action TEXT,
  p_custom_xp INTEGER DEFAULT NULL
)
RETURNS TABLE(new_level INTEGER, leveled_up BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_xp_config RECORD;
  v_xp_to_add INTEGER;
  v_current_xp INTEGER;
  v_current_level INTEGER;
  v_new_level INTEGER;
  v_leveled_up BOOLEAN := FALSE;
BEGIN
  -- Get XP config for action
  SELECT * INTO v_xp_config 
  FROM xp_config 
  WHERE id = p_action;
  
  -- Calculate XP to add
  IF p_custom_xp IS NOT NULL THEN
    v_xp_to_add := p_custom_xp;
  ELSIF v_xp_config IS NOT NULL THEN
    v_xp_to_add := v_xp_config.xp_value;
  ELSE
    v_xp_to_add := 0;
  END IF;
  
  -- Get current XP and level
  SELECT xp, level INTO v_current_xp, v_current_level
  FROM profiles
  WHERE user_id = p_user_id;
  
  -- Add XP
  v_current_xp := COALESCE(v_current_xp, 0) + v_xp_to_add;
  
  -- Calculate new level
  v_new_level := (
    SELECT COUNT(*) 
    FROM level_thresholds 
    WHERE xp_required <= v_current_xp
  );
  
  -- Check for level up
  IF v_new_level > v_current_level THEN
    v_leveled_up := TRUE;
  END IF;
  
  -- Update profile
  UPDATE profiles
  SET xp = v_current_xp,
      level = v_new_level,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Update daily activity
  INSERT INTO daily_activities (user_id, activity_date, xp_earned)
  VALUES (p_user_id, CURRENT_DATE, v_xp_to_add)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET xp_earned = daily_activities.xp_earned + v_xp_to_add;
  
  RETURN QUERY SELECT v_new_level, v_leveled_up;
END;
$$;
```

---

## 3. Level System

### 3.1 Level Thresholds

| Level | XP Required | Title |
|-------|-------------|-------|
| 1 | 0 | Novice |
| 2 | 100 | Beginner |
| 3 | 250 | Apprentice |
| 4 | 500 | Student |
| 5 | 800 | Developer |
| 6 | 1,200 | Coder |
| 7 | 1,700 | Programmer |
| 8 | 2,300 | Engineer |
| 9 | 3,000 | Senior |
| 10 | 3,800 | Lead |
| ... | ... | ... |
| 20 | 15,000 | Expert |
| 30 | 35,000 | Master |
| 40 | 60,000 | Grandmaster |
| 50 | 90,000 | Legend |
| 60 | 130,000 | Mythic |
| 70 | 180,000 | Titan |
| 80 | 250,000 | Immortal |
| 90 | 350,000 | Demi-God |
| 100 | 500,000 | God Mode |

### 3.2 Level Progress Calculation

```typescript
// Frontend calculation
function calculateLevelProgress(
  currentXP: number,
  thresholds: LevelThreshold[]
): { current: number; next: number; progress: number; title: string } {
  const currentLevel = thresholds.find(t => t.xp_required <= currentXP)
  const nextLevel = thresholds.find(t => t.xp_required > currentXP)

  if (!currentLevel) {
    return { current: 0, next: 100, progress: 0, title: 'Novice' }
  }

  if (!nextLevel) {
    return { current: currentXP, next: currentXP, progress: 100, title: currentLevel.title }
  }

  const xpInCurrentLevel = currentXP - currentLevel.xp_required
  const xpNeededForNext = nextLevel.xp_required - currentLevel.xp_required
  const progress = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100))

  return {
    current: xpInCurrentLevel,
    next: xpNeededForNext,
    progress,
    title: currentLevel.title
  }
}
```

---

## 4. Streak System

### 4.1 Streak Mechanics

- **Daily Login**: Required to maintain streak
- **Streak Bonus**: `streak_days * 2` XP per day
- **Streak Freeze**: Can purchase with XP to skip a day
- **Streak Milestones**: 7, 30, 100, 365 days

### 4.2 Streak Calculation

```sql
CREATE OR REPLACE FUNCTION calculate_streak(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_check_date DATE;
BEGIN
  -- Start from yesterday and go backwards
  v_check_date := v_current_date - 1;
  
  -- Check if user was active yesterday
  IF NOT EXISTS (
    SELECT 1 FROM daily_activities
    WHERE user_id = p_user_id
    AND activity_date = v_check_date
    AND xp_earned > 0
  ) THEN
    -- No activity yesterday, streak is broken
    UPDATE profiles SET streak = 0 WHERE user_id = p_user_id;
    RETURN 0;
  END IF;
  
  -- Count consecutive days
  LOOP
    EXIT WHEN v_streak > 365; -- Max streak cap
    
    IF EXISTS (
      SELECT 1 FROM daily_activities
      WHERE user_id = p_user_id
      AND activity_date = v_check_date
      AND xp_earned > 0
    ) THEN
      v_streak := v_streak + 1;
      v_check_date := v_check_date - 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  -- Update profile
  UPDATE profiles SET streak = v_streak WHERE user_id = p_user_id;
  
  RETURN v_streak;
END;
$$;
```

---

## 5. Achievements System

### 5.1 Achievement Types

| Achievement | Requirement | XP Reward |
|-------------|-------------|-----------|
| First Blood | Solve first problem | 10 |
| Centurion | Solve 100 problems | 100 |
| Problem Solver | Solve 500 problems | 250 |
| Code Master | Solve 1000 problems | 500 |
| First Step | Send first application | 15 |
| Apply Daily | Send 10 applications | 50 |
| Job Hunter | Send 50 applications | 150 |
| Hired | Receive first offer | 100 |
| On Fire | 7-day streak | 75 |
| Unstoppable | 30-day streak | 300 |
| Marathon | 100-day streak | 1000 |
| Legend | 365-day streak | 5000 |
| Level 10 | Reach level 10 | 100 |
| Level 25 | Reach level 25 | 250 |
| Level 50 | Reach level 50 | 500 |
| First Connection | Make first connection | 10 |
| Networker | 50 connections | 100 |
| Influencer | 100 connections | 250 |
| First Post | Create first post | 5 |
| Thought Leader | 50 posts | 75 |
| Certified | Pass first certification | 100 |
| Graduate | Complete Python course | 150 |
| Perfect Score | Get 100% on assessment | 50 |
| Speed Demon | Solve problem under 5 min | 25 |

### 5.2 Achievement Check Function

```sql
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS TABLE(achievement_id UUID, achievement_name TEXT, xp_reward INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile RECORD;
  v_achievement RECORD;
  v_count INTEGER;
BEGIN
  -- Get user profile
  SELECT * INTO v_profile
  FROM profiles
  WHERE user_id = p_user_id;
  
  -- Loop through all achievements
  FOR v_achievement IN SELECT * FROM achievements LOOP
    -- Check if already unlocked
    SELECT COUNT(*) INTO v_count
    FROM user_achievements
    WHERE user_id = p_user_id 
      AND achievement_id = v_achievement.id;
    
    IF v_count > 0 THEN
      CONTINUE;
    END IF;
    
    -- Check requirement
    IF v_achievement.requirement_type = 'problems_solved' THEN
      IF v_profile.problems_solved >= v_achievement.requirement_value THEN
        INSERT INTO user_achievements (user_id, achievement_id)
        VALUES (p_user_id, v_achievement.id);
        
        IF v_achievement.xp_reward IS NOT NULL THEN
          PERFORM award_xp(p_user_id, 'achievement', v_achievement.xp_reward);
        END IF;
        
        RETURN QUERY SELECT v_achievement.id, v_achievement.name, v_achievement.xp_reward;
      END IF;
    ELSIF v_achievement.requirement_type = 'applications_count' THEN
      IF v_profile.applications_count >= v_achievement.requirement_value THEN
        INSERT INTO user_achievements (user_id, achievement_id)
        VALUES (p_user_id, v_achievement.id);
        
        IF v_achievement.xp_reward IS NOT NULL THEN
          PERFORM award_xp(p_user_id, 'achievement', v_achievement.xp_reward);
        END IF;
        
        RETURN QUERY SELECT v_achievement.id, v_achievement.name, v_achievement.xp_reward;
      END IF;
    ELSIF v_achievement.requirement_type = 'streak' THEN
      IF v_profile.streak >= v_achievement.requirement_value THEN
        INSERT INTO user_achievements (user_id, achievement_id)
        VALUES (p_user_id, v_achievement.id);
        
        IF v_achievement.xp_reward IS NOT NULL THEN
          PERFORM award_xp(p_user_id, 'achievement', v_achievement.xp_reward);
        END IF;
        
        RETURN QUERY SELECT v_achievement.id, v_achievement.name, v_achievement.xp_reward;
      END IF;
    ELSIF v_achievement.requirement_type = 'level' THEN
      IF v_profile.level >= v_achievement.requirement_value THEN
        INSERT INTO user_achievements (user_id, achievement_id)
        VALUES (p_user_id, v_achievement.id);
        
        IF v_achievement.xp_reward IS NOT NULL THEN
          PERFORM award_xp(p_user_id, 'achievement', v_achievement.xp_reward);
        END IF;
        
        RETURN QUERY SELECT v_achievement.id, v_achievement.name, v_achievement.xp_reward;
      END IF;
    END IF;
  END LOOP;
END;
$$;
```

---

## 6. Leaderboard System

### 6.1 Leaderboard Types

- **Global XP**: All-time XP rankings
- **Weekly XP**: Current week rankings
- **Monthly XP**: Current month rankings
- **Problems Solved**: Problem count rankings
- **Streaks**: Active streak rankings
- **Applications**: Application count rankings

### 6.2 Leaderboard Queries

```typescript
// Get global leaderboard
const { data: leaders, error } = await supabase
  .from('profiles')
  .select('user_id, full_name, avatar_url, xp, level, streak, problems_solved')
  .order('xp', { ascending: false })
  .limit(100)

// Get weekly leaderboard
const { data: weeklyLeaders, error } = await supabase
  .from('daily_activities')
  .select(`
    user_id,
    profiles!inner(full_name, avatar_url, level),
    sum(xp_earned) as weekly_xp
  `)
  .gte('activity_date', getWeekStart())
  .groupBy('user_id', 'profiles.full_name', 'profiles.avatar_url', 'profiles.level')
  .order('weekly_xp', { ascending: false })
  .limit(100)
```

---

## 7. Frontend Implementation

### 7.1 useGamification Hook

```typescript
interface UseGamificationOptions {
  showNotifications?: boolean;
}

export function useGamification(options: UseGamificationOptions = { showNotifications: true }) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [userId, setUserId] = React.useState<string | null>(null)

  // Fetch data
  const { data: levelThresholds = [] } = useQuery({
    queryKey: ['levelThresholds'],
    queryFn: getLevelThresholds,
  })

  const { data: userStats, refetch: refetchStats } = useQuery({
    queryKey: ['userStats', userId],
    queryFn: () => userId ? getUserStats(userId) : null,
    enabled: !!userId,
  })

  const { data: dailyActivities = [] } = useQuery({
    queryKey: ['dailyActivities', userId],
    queryFn: () => userId ? getDailyActivities(userId) : [],
    enabled: !!userId,
  })

  // Realtime subscriptions
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`gamification:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `user_id=eq.${userId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['userStats', userId] })
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId, queryClient])

  // Mutations
  const awardXPMutation = useMutation({
    mutationFn: async ({ action, customXP }: { action: string; customXP?: number }) => {
      if (!userId) throw new Error("Not logged in")
      return awardXP, customXP)
(userId, action    },
    onSuccess: async (result, { action }) => {
      if (result) {
        showXPNotification(result, action)
        const achievements = await checkAchievements(userId)
        if (achievements.length > 0) {
          showAchievementNotification(achievements)
        }
        queryClient.invalidateQueries({ queryKey: ['userStats })
      }
    },
  })

  return {
    user', userId]Id,
    userStats,
    levelProgress: calculateLevelProgress(userStats?.totalXP || 0, levelThresholds),
    dailyActivities,
    awardXP: (action: string, customXP?: number) => awardXPMutation.mutate({ action, customXP }),
    recordProblemSolved: (difficulty: 'easy' | 'medium' | 'hard') => 
      recordProblemMutation.mutate({ difficulty }),
    recordAssessment: (assessmentId: string, score: number, passed: boolean, timeTaken: number) =>
      recordAssessmentMutation.mutate({ assessmentId, score, passed, timeTaken }),
  }
}
```

### 7.2 Notification System

```typescript
function showXPNotification(result: XPResult, action: string) {
  if (result.leveled_up) {
    playSound("levelUp")
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#8b5cf6", "#10b981", "#f59e0b"],
    })
    toast({
      title: "Level Up",
      description: `You're now level ${result.new_level}. +${result.xp_gained} XP`,
    })
  } else {
    playSound("xpGained")
    toast({
      title: `+${result.xp_gained} XP`,
      description: action,
    })
  }
}
```

---

## 8. Visual Components

### 8.1 Stats HUD
- Real-time XP, Level, Streak display
- Animated number transitions
- Progress bar to next level

### 8.2 The Garden (Heatmap)
- GitHub-style 365-day activity grid
- Color intensity: gray → green → emerald
- Hover tooltips with daily stats

### 8.3 Level Progress Card
- Current level with title
- XP progress bar
- Next level requirements

### 8.4 Achievement Cards
- Icon display
- Achievement name
- Description
- XP reward
- Unlock date

---

## 9. Daily Activity Tracking

### 9.1 Daily Activities Table
```sql
CREATE TABLE daily_activities (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  activity_date DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  problems_solved INTEGER DEFAULT 0,
  applications_sent INTEGER DEFAULT 0,
  assessments_completed INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
)
```

### 9.2 Initialize Daily Activity
```typescript
async function initDailyActivity(userId: string): Promise<DailyInitResult | null> {
  const { data, error } = await supabase.rpc('init_daily_activity', {
    p_user_id: userId
  })

  if (error) {
    console.error('Error initializing daily activity:', error)
    return null
  }

  return data?.[0] || null
}
```

---

## 10. Gamification UX/UI Features

### 10.1 Sound Effects
- `xpGained.mp3` - XP earned
- `levelUp.mp3` - Level up
- `achievement.mp3` - Achievement unlocked
- `streak.mp3` - Streak milestone

### 10.2 Animations
- Confetti burst on level up
- Progress bar fill animations
- Number counting animations
- Card flip on achievement unlock

### 10.3 Notifications
- Toast notifications for XP gains
- Push notifications for achievements
- Badge indicators on navigation
- Sound toggles in settings

---

## 11. Gamification Analytics

### 11.1 Tracked Metrics
- Daily active users (DAU)
- Daily XP distribution
- Average session duration
- Achievement unlock rates
- Streak distribution
- Level progression rates

### 11.2 Funnel Analysis
- New user → First problem
- First problem → 10 problems
- 10 problems → Daily streak
- Streak → First application
- Application → Interview
- Interview → Offer

---

## 12. Anti-Gaming Measures

- **Rate limiting**: Max XP per hour
- **Fraud detection**: Suspicious activity flags
- **Cross-reference checks**: Verify with backend data
- **No client-side XP**: Always verify server-side

---

*This comprehensive gamification documentation covers the complete XP system, achievements, streaks, leaderboards, and implementation details for the Kibo platform.*
