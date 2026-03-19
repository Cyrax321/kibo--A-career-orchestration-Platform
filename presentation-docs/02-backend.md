# Kibo Backend Architecture

## Complete Backend Technical Documentation

---

## 1. Backend Architecture Overview

Kibo uses a **serverless backend architecture** powered by **Supabase** (PostgreSQL + Edge Functions + Realtime). This provides:

- **Relational Database**: PostgreSQL with JSONB support
- **Realtime Subscriptions**: WebSocket-based change data capture
- **Authentication**: JWT-based secure authentication
- **Row-Level Security**: Fine-grained access control
- **Edge Functions**: Serverless API endpoints
- **Storage**: File and image storage

---

## 2. Database Schema

### 2.1 Core Tables

#### **profiles** - User Profiles
```sql
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY,
  full_name TEXT,
  headline TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT,
  skills TEXT[],
  target TEXT,
  country TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  problems_solved INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  last_active TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Key Fields:**
- `user_id`: References auth.users (PK)
- `xp`: Total experience points accumulated
- `level`: Current gamification level (1-100)
- `streak`: Consecutive days of activity
- `skills`: Array of skill tags
- `problems_solved`: Count of coding problems completed

#### **applications** - Job Applications
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'wishlist',  -- wishlist, applied, interview, offer, rejected
  job_url TEXT,
  location TEXT,
  salary TEXT,
  is_remote BOOLEAN,
  notes TEXT,
  applied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Status Flow:**
```
wishlist → applied → interview → offer
                ↘︎ rejected
```

#### **coding_problems** - Problem Library
```sql
CREATE TABLE coding_problems (
  id UUID PRIMARY KEY DEFAULT UUID(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  initial_code TEXT NOT NULL,
  starter_code TEXT,
  solution_code TEXT,
  test_cases JSONB,  -- Array of {input, output} objects
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **submissions** - Code Submissions
```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  problem_id UUID REFERENCES coding_problems(id),
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT,  -- accepted, wrong_answer, runtime_error, time_limit
  runtime_ms INTEGER,
  memory_kb INTEGER,
  test_results JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **achievements** - Achievement Definitions
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT UUID(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirement_type TEXT,
  requirement_value INTEGER,
  xp_reward INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **user_achievements** - Unlocked Achievements
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

#### **messages** - Direct Messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT UUID(),
  sender_id UUID REFERENCES profiles(user_id),
  receiver_id UUID REFERENCES profiles(user_id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **connections** - Social Connections
```sql
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id_1 UUID REFERENCES profiles(user_id),
  user_id_2 UUID REFERENCES profiles(user_id),
  status TEXT DEFAULT 'pending',  -- pending, accepted, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **posts** - Community Posts
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  content TEXT NOT NULL,
  image_url TEXT,
  post_type TEXT,  -- question, achievement, update, celebration
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **post_upvotes** - Post Upvotes
```sql
CREATE TABLE post_upvotes (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  post_id UUID REFERENCES posts(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);
```

#### **notifications** - User Notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  title TEXT NOT NULL,
  body TEXT,
  type TEXT,  -- achievement, connection, message, application
  is_read BOOLEAN DEFAULT FALSE,
  from_user_id UUID,
  reference_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **study_sessions** - Learning Sessions
```sql
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  topic TEXT,
  duration_minutes INTEGER,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);
```

#### **notes** - User Notes
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  application_id UUID REFERENCES applications(id),
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[],
  color TEXT DEFAULT '#3b82f6',
  is_pinned BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **note_tags** - Note Tags
```sql
CREATE TABLE note_tags (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **note_attachments** - Note File Attachments
```sql
CREATE TABLE note_attachments (
  id UUID PRIMARY KEY DEFAULT UUID(),
  note_id UUID REFERENCES notes(id),
  user_id UUID REFERENCES profiles(user_id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **note_shares** - Shared Notes
```sql
CREATE TABLE note_shares (
  id UUID PRIMARY KEY DEFAULT UUID(),
  note_id UUID REFERENCES notes(id),
  user_id UUID REFERENCES profiles(user_id),
  share_token TEXT UNIQUE NOT NULL,
  access_level TEXT DEFAULT 'view',  -- view, edit
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **certifications** - Certification Definitions
```sql
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT UUID(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  level TEXT,  -- beginner, intermediate, advanced
  language TEXT,
  description TEXT,
  duration_minutes INTEGER,
  total_marks INTEGER,
  passing_score INTEGER,
  cooldown_hours INTEGER,
  is_premium BOOLEAN DEFAULT FALSE,
  syllabus TEXT[],
  format JSONB,
  rules TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **certification_attempts** - Exam Attempts
```sql
CREATE TABLE certification_attempts (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  certification_id UUID REFERENCES certifications(id),
  status TEXT DEFAULT 'in_progress',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  score INTEGER,
  answers JSONB,
  questions_order INTEGER[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **assessments** - Skill Assessments
```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT UUID(),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  questions JSONB,
  passing_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **assessment_attempts** - Assessment Attempts
```sql
CREATE TABLE assessment_attempts (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  status TEXT DEFAULT 'in_progress',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  score INTEGER,
  answers JSONB,
  questions_order INTEGER[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **xp_config** - XP Configuration
```sql
CREATE TABLE xp_config (
  id TEXT PRIMARY KEY,  -- e.g., 'problem_easy', 'application_sent'
  xp_value INTEGER NOT NULL,
  description TEXT
);
```

#### **level_thresholds** - Level Thresholds
```sql
CREATE TABLE level_thresholds (
  id UUID PRIMARY KEY DEFAULT UUID(),
  level INTEGER NOT NULL,
  xp_required INTEGER NOT NULL,
  title TEXT NOT NULL
);
```

#### **daily_activities** - Daily Activity Tracking
```sql
activities (
  idCREATE TABLE daily_ UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  activity_date DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  problems_solved INTEGER DEFAULT 0,
  applications_sent INTEGER DEFAULT 0,
  assessments_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);
```

---

## 3. Database Functions (PL/pgSQL)

### 3.1 XP Award Function

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
  v_threshold INTEGER;
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

### 3.2 Problem Solved Recording Function

```sql
CREATE OR REPLACE FUNCTION record_problem_solved(
  p_user_id UUID,
  p_difficulty TEXT
)
RETURNS TABLE(
  new_xp INTEGER,
  new_level INTEGER,
  xp_gained INTEGER,
  leveled_up BOOLEAN,
  new_problems_solved INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_xp_value INTEGER;
  v_current_xp INTEGER;
  v_current_level INTEGER;
  v_current_problems INTEGER;
  v_new_level INTEGER;
  v_leveled_up BOOLEAN := FALSE;
BEGIN
  -- Get XP for difficulty
  SELECT xp_value INTO v_xp_value
  FROM xp_config
  WHERE id = CONCAT('problem_', p_difficulty);
  
  v_xp_value := COALESCE(v_xp_value, 0);
  
  -- Get current stats
  SELECT xp, level, problems_solved 
  INTO v_current_xp, v_current_level, v_current_problems
  FROM profiles
  WHERE user_id = p_user_id;
  
  v_current_xp := COALESCE(v_current_xp, 0);
  v_current_problems := COALESCE(v_current_problems, 0);
  
  -- Calculate new level
  v_new_level := (
    SELECT COUNT(*) 
    FROM level_thresholds 
    WHERE xp_required <= (v_current_xp + v_xp_value)
  );
  
  IF v_new_level > v_current_level THEN
    v_leveled_up := TRUE;
  END IF;
  
  -- Update profile
  UPDATE profiles
  SET 
    xp = v_current_xp + v_xp_value,
    level = v_new_level,
    problems_solved = v_current_problems + 1,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Update daily activity
  INSERT INTO daily_activities (user_id, activity_date, xp_earned, problems_solved)
  VALUES (p_user_id, CURRENT_DATE, v_xp_value, 1)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET 
    xp_earned = daily_activities.xp_earned + v_xp_value,
    problems_solved = daily_activities.problems_solved + 1;
  
  RETURN QUERY SELECT 
    v_current_xp + v_xp_value,
    v_new_level,
    v_xp_value,
    v_leveled_up,
    v_current_problems + 1;
END;
$$;
```

### 3.3 Application Update Function

```sql
CREATE OR REPLACE FUNCTION record_application_update(
  p_user_id UUID,
  p_old_status TEXT,
  p_new_status TEXT,
  p_application_id UUID DEFAULT NULL
)
RETURNS TABLE(new_xp INTEGER, xp_gained INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_xp_config_id TEXT;
  v_xp_value INTEGER;
  v_current_xp INTEGER;
BEGIN
  -- Determine XP config based on status change
  v_xp_config_id := CASE 
    WHEN p_new_status = 'wishlist' THEN 'application_wishlist'
    WHEN p_new_status = 'applied' THEN 'application_sent'
    WHEN p_new_status = 'interview' THEN 'application_interview'
    WHEN p_new_status = 'offer' THEN 'application_offer'
    ELSE NULL
  END;
  
  -- Get XP value
  SELECT xp_value INTO v_xp_value
  FROM xp_config
  WHERE id = v_xp_config_id;
  
  v_xp_value := COALESCE(v_xp_value, 0);
  
  -- Get current XP
  SELECT xp INTO v_current_xp
  FROM profiles
  WHERE user_id = p_user_id;
  
  v_current_xp := COALESCE(v_current_xp, 0);
  
  -- Update profile
  UPDATE profiles
  SET 
    xp = v_current_xp + v_xp_value,
    applications_count = applications_count + 1,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Update daily activity
  IF p_new_status = 'applied' THEN
    INSERT INTO daily_activities (user_id, activity_date, applications_sent)
    VALUES (p_user_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, activity_date)
    DO UPDATE SET applications_sent = daily_activities.applications_sent + 1;
  END IF;
  
  RETURN QUERY SELECT v_current_xp + v_xp_value, v_xp_value;
END;
$$;
```

### 3.4 Achievement Check Function

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
        -- Unlock achievement
        INSERT INTO user_achievements (user_id, achievement_id)
        VALUES (p_user_id, v_achievement.id);
        
        -- Award XP
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

## 4. Row-Level Security (RLS) Policies

### 4.1 Profiles RLS
```sql
-- Users can read all profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);
```

### 4.2 Applications RLS
```sql
-- Users can read their own applications
CREATE POLICY "Users can view own applications"
ON applications FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own applications
CREATE POLICY "Users can insert own applications"
ON applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own applications
CREATE POLICY "Users can update own applications"
ON applications FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own applications
CREATE POLICY "Users can delete own applications"
ON applications FOR DELETE
USING (auth.uid() = user_id);
```

### 4.3 Messages RLS
```sql
-- Users can read messages they sent or received
CREATE POLICY "Users can view own messages"
ON messages FOR SELECT
USING (
  auth.uid() = sender_id OR 
  auth.uid() = receiver_id
);

-- Users can insert messages they send
CREATE POLICY "Users can insert own messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);
```

### 4.4 Notes RLS
```sql
-- Users can CRUD their own notes
CREATE POLICY "Users can manage own notes"
ON notes FOR ALL
USING (auth.uid() = user_id);
```

---

## 5. Supabase Edge Functions

### 5.1 Daily Activity Initialization
```typescript
// supabase/functions/init-daily-activity/index.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const { user_id } = await req.json()
  
  const today = new Date().toISOString().split('T')[0]
  
  // Check if already initialized today
  const { data: existing } = await supabase
    .from('daily_activities')
    .select('*')
    .eq('user_id', user_id)
    .eq('activity_date', today)
    .single()
  
  if (existing) {
    return Response.json({ 
      streak: existing.streak, 
      daily_xp: existing.xp_earned,
      is_new_day: false 
    })
  }
  
  // Calculate streak
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  
  const { data: yesterdayActivity } = await supabase
    .from('daily_activities')
    .select('streak')
    .eq('user_id', user_id)
    .eq('activity_date', yesterdayStr)
    .single()
  
  const newStreak = yesterdayActivity?.streak 
    ? yesterdayActivity.streak + 1 
    : 1
  
  // Create today's activity
  await supabase
    .from('daily_activities')
    .insert({
      user_id,
      activity_date: today,
      xp_earned: 5, // Login bonus
      streak: newStreak
    })
  
  // Update profile streak
  await supabase
    .from('profiles')
    .update({ streak: newStreak })
    .eq('user_id', user_id)
  
  return Response.json({ 
    streak: newStreak, 
    daily_xp: 5,
    is_new_day: true 
  })
})
```

---

## 6. Authentication System

### 6.1 Supabase Auth Integration
- Email/Password authentication
- OAuth providers (GitHub, Google)
- JWT tokens with 1-hour expiry
- Refresh token rotation
- Session persistence in localStorage

### 6.2 Auth Flow
```
1. User signs up/in
2. Supabase creates JWT access token
3. Token stored in localStorage
4. All API requests include Bearer token
5. RLS policies verify ownership
6. Token auto-refreshes before expiry
```

---

## 7. Realtime Subscriptions

### 7.1 Channels Used
- `profiles` - User stats updates
- `messages` - New message notifications
- `connections` - Connection status changes
- `posts` - New community posts
- `notifications` - User notifications
- `submissions` - Code submission results
- `daily_activities` - Activity heatmap updates

### 7.2 Subscription Example
```typescript
const channel = supabase
  .channel(`gamification:${userId}`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'profiles',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      // Update UI in real-time
      queryClient.invalidateQueries(['userStats'])
    }
  )
  .subscribe()
```

---

## 8. Storage (UploadThing Integration)

### 8.1 Buckets
- `avatars` - User profile pictures
- `notes` - Note attachments
- `certificates` - Generated certificates
- `posts` - Post images

### 8.2 Upload Configuration
- Max file size: 5MB
- Allowed types: Images, PDFs
- Auto-generated unique filenames
- CDN delivery for fast access

---

## 9. API Rate Limiting

- Supabase Free tier: 60 requests/minute
- Pro tier: 600 requests/minute
- Edge Functions: 1000 requests/day (free)
- Custom rate limiting available via Supabase

---

## 10. Database Indexing

### 10.1 Primary Indexes
```sql
-- Auto-created on primary keys
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_problem ON submissions(problem_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_daily_activities_user_date ON daily_activities(user_id, activity_date);
```

### 10.2 Performance Indexes
```sql
-- For leaderboard queries
CREATE INDEX idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX idx_profiles_level ON profiles(level DESC);
CREATE INDEX idx_profiles_streak ON profiles(streak DESC);

-- For search queries
CREATE INDEX idx_profiles_skills ON profiles USING GIN(skills);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);
```

---

## 11. Database Migrations

### 11.1 Migration Strategy
- Version-controlled SQL migrations
- Supabase CLI for deployment
- Rollback support for critical changes
- Seeding for development data

---

## 12. Backup & Recovery

- Supabase automatic daily backups
- Point-in-time recovery available
- Export to JSON/CSV supported
- 30-day backup retention (free tier)

---

## 13. Monitoring & Logging

### 13.1 Available Metrics
- Query performance (slow query log)
- API response times
- Database connection count
- Storage usage
- Realtime channel subscriptions

---

*This backend documentation covers all database operations, functions, security policies, and infrastructure details for the Kibo platform.*
