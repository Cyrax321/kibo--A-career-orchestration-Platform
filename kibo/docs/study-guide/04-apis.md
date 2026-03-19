# 04 – APIs & Integrations (Deep Dive)

## API Architecture Overview

Kibo uses three types of APIs:

| Type | Source | Protocol | Purpose |
|------|--------|----------|---------|
| **PostgREST** | Supabase (auto-generated) | HTTPS REST | CRUD on all tables |
| **RPC** | Supabase (custom PG functions) | HTTPS POST | Business logic |
| **External** | Judge0 CE, Uploadthing | HTTPS REST | Code execution, file upload |

**No custom backend server.** All API calls go from React frontend directly to Supabase or external services.

## PostgREST API (Auto-Generated CRUD)

Supabase auto-generates a REST API for every table in the database. The `supabase-js` SDK wraps this.

### CRUD Pattern:
```typescript
// CREATE
const { data, error } = await supabase
  .from('applications')
  .insert({ company: 'Google', role: 'SWE', status: 'applied', user_id: userId });

// READ (with filters)
const { data, error } = await supabase
  .from('applications')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

// READ with joins
const { data } = await supabase
  .from('posts')
  .select('*, profiles(full_name, avatar_url)')
  .order('created_at', { ascending: false });

// UPDATE
const { error } = await supabase
  .from('applications')
  .update({ status: 'offer' })
  .eq('id', applicationId);

// DELETE
const { error } = await supabase
  .from('applications')
  .delete()
  .eq('id', applicationId);
```

### Query Operators:
| Operator | Method | Example |
|----------|--------|---------|
| Equals | `.eq()` | `.eq('status', 'applied')` |
| Not equals | `.neq()` | `.neq('status', 'offer')` |
| Greater than | `.gt()` | `.gt('xp', 1000)` |
| Less than | `.lt()` | `.lt('level', 10)` |
| In array | `.in()` | `.in('status', ['applied', 'oa'])` |
| Like | `.like()` | `.like('company', '%Google%')` |
| Order | `.order()` | `.order('xp', { ascending: false })` |
| Limit | `.limit()` | `.limit(10)` |
| Range | `.range()` | `.range(0, 9)` |

## RPC Functions API

Called via `supabase.rpc('function_name', params)`. These execute PostgreSQL functions server-side.

### award_xp
```typescript
const { data, error } = await supabase.rpc('award_xp', {
  p_user_id: userId,
  p_action: 'problem_solved_easy', // action name from xp_config
  p_custom_xp: null                // optional custom XP override
});
// Returns: { new_xp: 125, new_level: 3, xp_gained: 25, leveled_up: false }
```

### record_problem_solved
```typescript
const { data, error } = await supabase.rpc('record_problem_solved', {
  p_user_id: userId,
  p_difficulty: 'medium'           // 'easy' | 'medium' | 'hard'
});
// Returns: XPResult + { new_problems_solved: 43 }
```

### init_daily_activity
```typescript
const { data, error } = await supabase.rpc('init_daily_activity', {
  p_user_id: userId
});
// Returns: { streak: 7, daily_xp: 0, is_new_day: true }
```

### record_application_update
```typescript
const { data, error } = await supabase.rpc('record_application_update', {
  p_user_id: userId,
  p_old_status: 'technical',
  p_new_status: 'offer',
  p_application_id: appId
});
// Returns: { new_xp: 350, xp_gained: 100 }
```

## Judge0 CE API (Code Execution)

**Base URL:** `https://ce.judge0.com`
**Auth:** None (public instance)
**File:** `src/lib/codeExecutor.ts`

### Submit Code:
```typescript
// POST https://ce.judge0.com/submissions/?base64_encoded=true&wait=true
{
  "source_code": btoa(code),      // Base64 encoded
  "language_id": 71,               // Python 3.8
  "stdin": btoa(testInput),        // Base64 encoded input
  "expected_output": btoa(expected) // Optional
}
```

### Response:
```json
{
  "status": { "id": 3, "description": "Accepted" },
  "stdout": "SGVsbG8=",           // Base64 encoded output
  "stderr": null,
  "compile_output": null,
  "time": "0.015",
  "memory": 9340
}
```

### Status IDs:
| ID | Status | Meaning |
|----|--------|---------|
| 1 | In Queue | Waiting |
| 2 | Processing | Running |
| 3 | Accepted | Correct output |
| 4 | Wrong Answer | Output mismatch |
| 5 | TLE | Time Limit Exceeded |
| 6 | Compilation Error | Code won't compile |
| 7-12 | Runtime Errors | Various crashes |

### 16 Supported Languages:
| Language | ID | Language | ID |
|----------|-----|----------|-----|
| JavaScript (Node) | 63 | Go | 60 |
| Python 3 | 71 | Rust | 73 |
| C++ (GCC) | 54 | Kotlin | 78 |
| C (GCC) | 50 | Swift | 83 |
| Java | 62 | Ruby | 72 |
| TypeScript | 74 | PHP | 68 |
| C# (Mono) | 51 | R | 80 |
| Perl | 85 | Bash | 46 |

### Code Execution Flow:
```
1. User writes code in Monaco Editor
2. User clicks "Run" or "Submit"
3. Frontend encodes code to Base64
4. POST to Judge0 CE with language_id
5. Judge0 sandboxes and executes code
6. Response with stdout/stderr/status
7. Frontend decodes Base64 output
8. Compare with expected output (test cases)
9. Display results + award XP if all pass
```

## Supabase Auth API

### Email/Password:
```typescript
// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123'
});

// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123'
});

// Sign Out
await supabase.auth.signOut();

// Get Session
const { data: { session } } = await supabase.auth.getSession();
```

### OAuth:
```typescript
// Google Login
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: window.location.origin + '/dashboard' }
});

// GitHub Login
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: { redirectTo: window.location.origin + '/dashboard' }
});
```

### Auth State Listener:
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') { /* handle login */ }
  if (event === 'SIGNED_OUT') { /* redirect to /login */ }
  if (event === 'TOKEN_REFRESHED') { /* session renewed */ }
});
```

## Supabase Realtime API

```typescript
// Subscribe to table changes
const channel = supabase.channel('my-channel')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages',
      filter: `receiver_id=eq.${userId}` },
    (payload) => {
      // payload.new contains the inserted row
      playSound('messageReceived');
      queryClient.invalidateQueries(['messages']);
    }
  )
  .subscribe();

// Cleanup
channel.unsubscribe();
```

## Uploadthing API (File Uploads)

```typescript
// src/lib/uploadthing.ts
import { generateReactHelpers } from "@uploadthing/react";
export const { useUploadThing, uploadFiles } = generateReactHelpers();
```

Used for: Avatar uploads, file attachments.

## API Error Handling Pattern

```typescript
const { data, error } = await supabase.from('table').select();

if (error) {
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive"
  });
  return;
}

// Use data safely
```

**Optimistic Updates:**
```typescript
// 1. Update UI immediately
setApplications(prev => prev.map(app =>
  app.id === id ? { ...app, status: newStatus } : app
));

// 2. Call API
const { error } = await supabase.from('applications').update({ status: newStatus });

// 3. Rollback if API fails
if (error) {
  setApplications(prev => prev.map(app =>
    app.id === id ? { ...app, status: oldStatus } : app
  ));
}
```
