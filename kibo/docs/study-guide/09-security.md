# 09 – Security Implementation (Deep Dive)

## Security Architecture Overview

Kibo implements security at multiple layers: database (RLS), authentication (JWT), frontend (validation), and application logic (anti-cheat).

## Layer 1: Authentication (Supabase Auth)

### Methods:
| Method | Flow |
|--------|------|
| **Email/Password** | User registers → Supabase hashes password (bcrypt) → JWT issued |
| **Google OAuth** | Redirect to Google → Callback → Supabase creates user → JWT |
| **GitHub OAuth** | Redirect to GitHub → Callback → Supabase creates user → JWT |

### JWT Token:
- Issued by Supabase on successful auth
- Contains: `user_id`, `role`, `exp` (expiry)
- Stored in `localStorage` (managed by supabase-js)
- Auto-refreshed before expiry
- Sent in `Authorization: Bearer <token>` header with every API call
- Used by PostgreSQL RLS via `auth.uid()` function

### Session Security:
- Tokens expire after configurable period (default: 1 hour)
- Refresh tokens used to obtain new access tokens
- `supabase.auth.onAuthStateChange()` detects session changes
- Sign out clears all tokens from localStorage

## Layer 2: Row Level Security (RLS)

**Every table has RLS enabled.** No data can be accessed without matching a policy.

### How RLS Works:
```sql
-- PostgreSQL checks EVERY query against policies
-- If no policy matches → query returns empty set (not error)

-- Example: Only read own applications
CREATE POLICY "users_read_own_apps"
  ON applications FOR SELECT
  USING (user_id = auth.uid());
  -- auth.uid() extracts user_id from the JWT token
```

### Complete RLS Policy Matrix:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | Own | Auto-trigger | Own | — |
| applications | Own | Own (user_id check) | Own | Own |
| submissions | Own | Own | Own | Own |
| notifications | Own | System/Own | Own (mark read) | Own |
| messages | Sent OR Received | Own (as sender) | — | — |
| connections | Involved party | Own | Own | Own |
| posts | ALL (public feed) | Own | Own | Own |
| post_upvotes | ALL | Own | — | Own |
| achievements | ALL (catalog) | System only | — | — |
| user_achievements | Own | System (trigger) | — | — |
| daily_activities | Own | System (RPC) | System (RPC) | — |
| notes | Own | Own | Own | Own |
| note_shares | Token match | Own | Own | Own |
| calendar_events | Own | Own | Own | Own |

### What "Own" means: `user_id = auth.uid()` — the JWT's user ID must match the row's user_id column.

## Layer 3: API Key Security

| Key Type | Exposure | Capabilities |
|----------|----------|-------------|
| **anon (publishable)** | Frontend code (safe) | Subject to RLS — can only do what policies allow |
| **service_role** | Server only (NEVER in frontend) | Bypasses RLS — full admin access |

**In Kibo:** Only the `anon` key is used. It's safe to expose because RLS restricts all queries. The `service_role` key is only in the Supabase dashboard.

## Layer 4: Input Validation (Frontend)

### Zod Schema Validation:
```typescript
const applicationSchema = z.object({
  company: z.string().min(1, "Company required").max(100),
  role: z.string().min(1, "Role required").max(100),
  status: z.enum(['wishlist', 'applied', 'oa', 'technical', 'hr', 'offer']),
  salary: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
});
```
- Every form uses Zod + React Hook Form
- Type-safe validation at compile time AND runtime
- Server-side RLS provides second validation layer

## Layer 5: XSS Prevention

- React automatically escapes all rendered content (JSX)
- User input rendered via `{variable}` not `dangerouslySetInnerHTML`
- PlateJS editor sanitizes rich content
- Markdown rendered with safe renderers

## Layer 6: Anti-Cheat (Certification Exams)

### Tab-Switch Detection:
```typescript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    setTabSwitchCount(prev => prev + 1);
    toast.warning("Tab switch detected! This will be recorded.");
  }
});
```
- Counts every time user leaves the exam tab
- Displayed in exam UI as warning
- Recorded in exam attempt data

## Layer 7: Environment Variables

```
# .env (in .gitignore — NEVER committed)
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...  # anon key (safe)
```
- `.env` file is in `.gitignore`
- No secrets in source code
- `VITE_` prefix means Vite exposes to frontend (only for safe values)
- Sensitive keys (service_role, OAuth secrets) stored in Supabase dashboard only

## Security Bug Fix: Infinite XP Exploit

**Migration:** `20260206153700_fix_infinite_xp.sql` (2,507 bytes)

**What happened:** Users could repeatedly call `award_xp` for the same action, gaining unlimited XP.

**Fix:** Added server-side deduplication logic in the `award_xp` PostgreSQL function to check if the same action was already recorded for the user within a time window. This prevents duplicate XP awards.

## Known Security Gaps

| Gap | Risk | Mitigation Path |
|-----|------|-----------------|
| No rate limiting | API abuse possible | Add Express rate limiter or Edge Function |
| localStorage JWT | Vulnerable to XJS scripts | Consider httpOnly cookies |
| No CSRF tokens | Cross-site requests | Supabase handles via CORS |
| No Content Security Policy | XSS via injected scripts | Add CSP headers |
| No error boundary | App crashes expose stack | Add React Error Boundary |
