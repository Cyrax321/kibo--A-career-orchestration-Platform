# Kibo API Reference

## Complete API Documentation

---

## 1. API Architecture

Kibo uses a **RESTful API** pattern through **Supabase**:

- **Database API**: Direct PostgreSQL queries via Supabase client
- **Edge Functions**: Serverless functions for complex operations
- **Realtime API**: WebSocket subscriptions for real-time updates
- **Storage API**: File upload/download via UploadThing
- **Auth API**: User authentication and session management

---

## 2. Database Tables & Operations

### 2.1 Profiles

#### Get User Profile
```typescript
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single()
```

#### Update Profile
```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({
    full_name: 'John Doe',
    headline: 'Software Engineer',
    bio: 'Passionate about building great products',
    skills: ['React', 'TypeScript', 'Python'],
  })
  .eq('user_id', userId)
  .select()
  .single()
```

#### Get Leaderboard
```typescript
const { data: leaders, error } = await supabase
  .from('profiles')
  .select('user_id, full_name, avatar_url, xp, level, streak')
  .order('xp', { ascending: false })
  .limit(100)
```

---

### 2.2 Applications

#### List User Applications
```typescript
const { data: applications, error } = await supabase
  .from('applications')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

#### Create Application
```typescript
const { data, error } = await supabase
  .from('applications')
  .insert({
    user_id: userId,
    company: 'Google',
    role: 'Software Engineer',
    status: 'wishlist',
    location: 'Mountain View, CA',
    is_remote: false,
    salary: '$150,000 - $200,000',
    job_url: 'https://careers.google.com/job/123',
  })
  .select()
  .single()
```

#### Update Application Status
```typescript
const { data, error } = await supabase
  .from('applications')
  .update({ 
    status: 'applied',
    applied_at: new Date().toISOString(),
  })
  .eq('id', applicationId)
  .select()
  .single()
```

#### Delete Application
```typescript
const { error } = await supabase
  .from('applications')
  .delete()
  .eq('id', applicationId)
```

---

### 2.3 Coding Problems

#### List All Problems
```typescript
const { data: problems, error } = await supabase
  .from('coding_problems')
  .select('id, title, difficulty, created_at')
  .order('created_at', { ascending: false })
```

#### Get Problem Details
```typescript
const { data: problem, error } = await supabase
  .from('coding_problems')
  .select('*')
  .eq('id', problemId)
  .single()
```

#### Filter by Difficulty
```typescript
const { data: problems, error } = await supabase
  .from('coding_problems')
  .select('*')
  .eq('difficulty', 'medium')
```

---

### 2.4 Submissions

#### Create Submission
```typescript
const { data: submission, error } = await supabase
  .from('submissions')
  .insert({
    user_id: userId,
    problem_id: problemId,
    code: codeString,
    language: 'python',
    status: 'accepted',
    runtime_ms: 45,
    memory_kb: 10240,
    test_results: testResults,
  })
  .select()
  .single()
```

#### Get User Submissions
```typescript
const { data: submissions, error } = await supabase
  .from('submissions')
  .select(`
    *,
    coding_problems (title, difficulty)
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

#### Get Problem Submissions
```typescript
const { data: submissions, error } = await supabase
  .from('submissions')
  .select('*')
  .eq('problem_id', problemId)
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

---

### 2.5 Achievements

#### Get All Achievements
```typescript
const { data: achievements, error } = await supabase
  .from('achievements')
  .select('*')
  .order('requirement_value', { ascending: true })
```

#### Get User Achievements
```typescript
const { data: userAchievements, error } = await supabase
  .from('user_achievements')
  .select(`
    *,
    achievements (name, description, icon, xp_reward)
  `)
  .eq('user_id', userId)
```

#### Unlock Achievement (Internal)
```typescript
const { data, error } = await supabase
  .from('user_achievements')
  .insert({
    user_id: userId,
    achievement_id: achievementId,
  })
```

---

### 2.6 Messages

#### Get Conversations
```typescript
const { data: messages, error } = await supabase
  .from('messages')
  .select('*')
  .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
  .order('created_at', { ascending: false })
```

#### Get Conversation with User
```typescript
const { data: messages, error } = await supabase
  .from('messages')
  .select('*')
  .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
  .order('created_at', { ascending: true })
```

#### Send Message
```typescript
const { data: message, error } = await supabase
  .from('messages')
  .insert({
    sender_id: userId,
    receiver_id: receiverId,
    content: 'Hello!',
  })
  .select()
  .single()
```

#### Mark as Read
```typescript
const { error } = await supabase
  .from('messages')
  .update({ is_read: true })
  .eq('receiver_id', userId)
  .eq('sender_id', otherUserId)
```

---

### 2.7 Connections

#### Get User Connections
```typescript
const { data: connections, error } = await supabase
  .from('connections')
  .select(`
    *,
    user1:profiles!connections_user_id_1_fkey (full_name, avatar_url),
    user2:profiles!connections_user_id_2_fkey (full_name, avatar_url)
  `)
  .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
  .eq('status', 'accepted')
```

#### Send Connection Request
```typescript
const { data, error } = await supabase
  .from('connections')
  .insert({
    user_id_1: userId,
    user_id_2: targetUserId,
    status: 'pending',
  })
```

#### Accept Connection
```typescript
const { error } = await supabase
  .from('connections')
  .update({ status: 'accepted' })
  .eq('id', connectionId)
```

---

### 2.8 Posts

#### Get Feed
```typescript
const { data: posts, error } = await supabase
  .from('posts')
  .select(`
    *,
    profiles (full_name, avatar_url, headline),
    post_upvotes (count)
  `)
  .order('created_at', { ascending: false })
  .limit(50)
```

#### Create Post
```typescript
const { data: post, error } = await supabase
  .from('posts')
  .insert({
    user_id: userId,
    content: 'Just completed 100 days of coding!',
    post_type: 'celebration',
  })
  .select()
  .single()
```

#### Upvote Post
```typescript
const { data, error } = await supabase
  .from('post_upvotes')
  .insert({
    user_id: userId,
    post_id: postId,
  })
```

---

### 2.9 Notifications

#### Get User Notifications
```typescript
const { data: notifications, error } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

#### Mark Notification as Read
```typescript
const { error } = await supabase
  .from('notifications')
  .update({ is_read: true })
  .eq('id', notificationId)
```

#### Create Notification (Internal)
```typescript
const { data, error } = await supabase
  .from('notifications')
  .insert({
    user_id: targetUserId,
    title: 'New Achievement!',
    body: 'You unlocked the "First Problem" achievement',
    type: 'achievement',
    from_user_id: userId,
  })
```

---

### 2.10 Notes

#### Get User Notes
```typescript
const { data: notes, error } = await supabase
  .from('notes')
  .select('*')
  .eq('user_id', userId)
  .eq('is_archived', false)
  .order('is_pinned', { ascending: false })
  .order('updated_at', { ascending: false })
```

#### Create Note
```typescript
const { data: note, error } = await supabase
  .from('notes')
  .insert({
    user_id: userId,
    title: 'Interview Prep',
    content: '# Topics\n- Arrays\n- Linked Lists\n- Trees',
    tags: ['interview', 'coding'],
    color: '#3b82f6',
  })
  .select()
  .single()
```

#### Update Note
```typescript
const { data, error } = await supabase
  .from('notes')
  .update({
    title: 'Updated Title',
    content: 'New content...',
    tags: ['updated', 'tags'],
    is_pinned: true,
  })
  .eq('id', noteId)
  .select()
  .single()
```

#### Share Note
```typescript
const { data: share, error } = await supabase
  .from('note_shares')
  .insert({
    note_id: noteId,
    user_id: userId,
    share_token: generateUniqueToken(),
    access_level: 'view',
  })
  .select()
  .single()

// Access shared note
const { data: note, error } = await supabase
  .from('notes')
  .select('*')
  .eq('id', sharedNoteId)
  .single()
```

---

### 2.11 Study Sessions

#### Start Session
```typescript
const { data: session, error } = await supabase
  .from('study_sessions')
  .insert({
    user_id: userId,
    topic: 'Python Functions',
    started_at: new Date().toISOString(),
  })
  .select()
  .single()
```

#### End Session
```typescript
const { error } = await supabase
  .from('study_sessions')
  .update({
    ended_at: new Date().toISOString(),
    duration_minutes: 45,
  })
  .eq('id', sessionId)
```

---

### 2.12 Certifications

#### Get Certification Catalog
```typescript
const { data: certs, error } = await supabase
  .from('certifications')
  .select('*')
  .order('level', { ascending: true })
```

#### Get Exam Attempts
```typescript
const { data: attempts, error } = await supabase
  .from('certification_attempts')
  .select('*')
  .eq('user_id', userId)
  .eq('certification_id', certId)
  .order('created_at', { ascending: false })
```

#### Start Exam
```typescript
const { data: attempt, error } = await supabase
  .from('certification_attempts')
  .insert({
    user_id: userId,
    certification_id: certId,
    status: 'in_progress',
    started_at: new Date().toISOString(),
  })
  .select()
  .single()
```

#### Submit Exam
```typescript
const { error } = await supabase
  .from('certification_attempts')
  .update({
    status: 'completed',
    completed_at: new Date().toISOString(),
    score: 85,
    answers: userAnswers,
  })
  .eq('id', attemptId)
```

---

### 2.13 Assessments

#### Get Assessments
```typescript
const { data: assessments, error } = await supabase
  .from('assessments')
  .select('*')
```

#### Get Assessment Attempts
```typescript
const { data: attempts, error } = await supabase
  .from('assessment_attempts')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

---

## 3. RPC Functions

### 3.1 award_xp

Award XP for user actions.

```typescript
const { data, error } = await supabase.rpc('award_xp', {
  p_user_id: userId,
  p_action: 'problem_medium', // or custom action
  p_custom_xp: null,
})

// Returns: { new_level: 5, leveled_up: true }
```

**Available Actions:**
| Action | XP Value |
|--------|----------|
| login | 5 |
| problem_easy | 10 |
| problem_medium | 20 |
| problem_hard | 50 |
| application_sent | 15 |
| application_interview | 30 |
| application_offer | 100 |
| assessment_passed | 25 |
| certification_passed | 100 |
| achievement | Varies |
| daily_streak_bonus | streak * 2 |

---

### 3.2 record_problem_solved

Record a solved coding problem.

```typescript
const { data, error } = await supabase.rpc('record_problem_solved', {
  p_user_id: userId,
  p_difficulty: 'medium',
})

// Returns: { new_xp: 120, new_level: 3, xp_gained: 20, leveled_up: false, new_problems_solved: 15 }
```

---

### 3.3 record_application_update

Track application status changes.

```typescript
const { data, error } = await supabase.rpc('record_application_update', {
  p_user_id: userId,
  p_old_status: 'wishlist',
  p_new_status: 'applied',
  p_application_id: appId,
})

// Returns: { new_xp: 115, xp_gained: 15 }
```

---

### 3.4 check_achievements

Check and unlock achievements.

```typescript
const { data, error } = await supabase.rpc('check_achievements', {
  p_user_id: userId,
})

// Returns: [{ achievement_id, achievement_name, xp_reward }]
```

---

### 3.5 get_user_activity

Get activity for heatmap.

```typescript
const { data, error } = await supabase.rpc('get_user_activity', {
  p_user_id: userId,
})

// Returns: [{ act_date: '2024-01-15', count: 5 }]
```

---

### 3.6 get_course_progress

Get learning progress.

```typescript
const { data, error } = await supabase.rpc('get_course_progress', {
  p_user_id: userId,
})

// Returns: [{ id, user_id, completed_lessons, unlocked_hints }]
```

---

### 3.7 save_course_progress

Save course progress.

```typescript
const { error } = await supabase.rpc('save_course_progress', {
  p_user_id: userId,
  p_completed_lessons: ['intro', 'syntax', 'variables'],
  p_unlocked_hints: ['hint1', 'hint2'],
})
```

---

## 4. Realtime Subscriptions

### 4.1 Subscribe to Profile Updates

```typescript
const channel = supabase
  .channel(`profile:${userId}`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'profiles',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Profile updated:', payload)
    }
  )
  .subscribe()
```

### 4.2 Subscribe to Messages

```typescript
const channel = supabase
  .channel(`messages:${userId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `receiver_id=eq.${userId}`,
    },
    (payload) => {
      // New message received
      playNotificationSound()
      showToast('New message!')
    }
  )
  .subscribe()
```

### 4.3 Subscribe to Notifications

```typescript
const channel = supabase
  .channel(`notifications:${userId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      // New notification
      showPushNotification(payload.new)
    }
  )
  .subscribe()
```

---

## 5. Storage API

### 5.1 Upload Avatar

```typescript
import { uploadThing } from '@/lib/uploadthing'

const { data, error } = await uploadThing('avatars', {
  files: [{
    name: 'avatar.jpg',
    file: fileObject,
  }],
})
```

### 5.2 Upload Note Attachment

```typescript
const { data, error } = await uploadThing('notes', {
  files: [{
    name: 'document.pdf',
    file: fileObject,
  }],
})
```

---

## 6. Authentication API

### 6.1 Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})
```

### 6.2 Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

### 6.3 Sign Out

```typescript
const { error } = await supabase.auth.signOut()
```

### 6.4 Get Current User

```typescript
const { data: { user }, error } = await supabase.auth.getUser()
```

### 6.5 Reset Password

```typescript
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com'
)
```

### 6.6 Update Password

```typescript
const { data, error } = await supabase.auth.updateUser({
  password: 'newpassword123',
})
```

---

## 7. Code Execution API (Judge0)

### 7.1 Execute Code

```typescript
import { executeCode } from '@/lib/codeExecutor'

const result = await executeCode(
  `print("Hello, World!")`,
  'python',
  '' // stdin
)

// Returns: { success: true, output: 'Hello, World!\n', runtime: 45 }
```

### 7.2 Run Test Cases

```typescript
import { runTestCases } from '@/lib/codeExecutor'

const result = await runTestCases(
  code,
  'python',
  [
    { input: '2\n3', output: '5' },
    { input: '10\n20', output: '30' },
  ]
)

// Returns: { results: [...], allPassed: true, runtime: 150 }
```

---

## 8. Error Handling

### 8.1 Error Types

```typescript
// Supabase errors
{
  message: 'Row not found',
  details: 'The row was not found in the table',
  hint: 'Check the ID and try again',
  code: 'PGRST116'
}
```

### 8.2 Handling Pattern

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .single()

if (error) {
  if (error.code === 'PGRST116') {
    // Row not found
    return null
  }
  if (error.code === '42501') {
    // Permission denied
    throw new Error('You do not have permission to access this resource')
  }
  // Handle other errors
  console.error('Database error:', error.message)
  throw error
}

return data
```

---

## 9. Rate Limiting

- **Free Tier**: 60 requests/minute
- **Pro Tier**: 600 requests/minute
- **Enterprise**: Custom limits

---

*This API reference provides comprehensive documentation for all database operations, RPC functions, realtime subscriptions, and external integrations used in the Kibo platform.*
