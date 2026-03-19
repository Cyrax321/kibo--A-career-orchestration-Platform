# 08 – Certification System (Deep Dive)

## Overview
Kibo includes a professional certification exam engine with timed exams, anti-cheat measures, grading, PDF certificate generation, and public verification.

**Key Files:**
- `src/components/certifications/ExamEngine.tsx` (45,950 bytes) – Full exam UI
- `src/components/certifications/ResultBreakdown.tsx` (18,751 bytes) – Score analysis
- `src/components/certifications/VerifyCertificate.tsx` (10,460 bytes) – Public verify
- `src/components/certifications/types.ts` (5,799 bytes) – TypeScript types
- `src/hooks/useCertifications.ts` (11,943 bytes) – Hook (337 lines)
- `src/data/certQuestionBank.ts` (42,104 bytes) – 200+ questions
- `src/data/certificationData.ts` (8,775 bytes) – Cert definitions
- `src/pages/Certifications.tsx` (27,989 bytes) – Cert catalog page

## Exam Engine (ExamEngine.tsx – 45.9KB)

### Features:
- **Full-screen timed exam interface**
- **Timer:** Countdown with auto-submit on expiry
- **Question navigation panel:** Jump to any question
- **Mark for review:** Flag questions to revisit
- **Progress tracking:** Answered/total counter
- **Anti-cheat:** Tab-switch detection with counter
- **Question types:** MCQ, coding, short-answer
- **Auto-save:** Answers saved as user progresses

### Anti-Cheat System:
```
When user switches tabs (document.visibilitychange event):
  1. Increment tab_switch_count
  2. Display warning toast
  3. Log the event
  4. After N switches: potential auto-submit or flag
```
This deters users from looking up answers during exams.

### Exam Flow:
```
1. User selects certification from catalog
2. Clicks "Start Exam"
3. ExamEngine loads in full-screen mode
4. Questions loaded from certQuestionBank.ts
5. Timer starts counting down
6. User navigates questions, answers, marks for review
7. On submit (or time expiry):
   a. gradeExamLocally() calculates score
   b. Result saved to assessment_attempts table
   c. If passed: certificate generated
 8. ResultBreakdown page shows detailed analysis
```

## Question Bank (200+ Questions)

**File:** `certQuestionBank.ts` (42,104 bytes)

### Question Structure:
```typescript
interface ExamQuestion {
  id: string;
  text: string;                        // Question text
  type: 'mcq' | 'coding' | 'short_answer';
  options?: string[];                   // For MCQ
  correct_answer: string | number;     // Answer key
  explanation: string;                  // Why this is correct
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;                    // Topic category
  points: number;                      // Points value
}
```

### Question Types:
| Type | Description | Grading |
|------|-------------|---------|
| **MCQ** | Multiple choice (4 options) | Exact match with correct option |
| **Coding** | Write code solution | Output comparison |
| **Short Answer** | Text response | Keyword/pattern matching |

## Grading System

### Client-Side Grading (gradeExamLocally):
```typescript
function gradeExamLocally(
  questions: ExamQuestion[],
  answers: Record<string, string | number>
): ExamResult {
  // For each question:
  // - MCQ: compare selected option index with correct_answer
  // - Coding: compare output with expected
  // - Short answer: keyword matching

  return {
    total_score: number,
    max_score: number,
    percentage: number,
    passed: boolean,
    per_question: QuestionResult[],
    time_taken: number
  };
}
```

**Why client-side grading?** For practice exams and development. Production would use server-side grading via Supabase RPC for integrity.

## Result Breakdown (18.7KB)

**What it shows:**
- Overall score (percentage + pass/fail)
- Per-question breakdown:
  - Question text
  - User's answer vs correct answer
  - Explanation of correct answer
  - Points earned
- Time analysis
- Category-wise performance
- Certificate download button (if passed)

## PDF Certificate Generation

**Library:** `pdf-lib` 1.17.1

### Certificate contains:
- Recipient name
- Certification title
- Score and date
- Unique certificate ID
- QR code / verification URL
- Digital signature/stamp

### Generation flow:
```
1. User passes exam
2. ResultBreakdown page shows "Download Certificate"
3. On click: pdf-lib creates PDF in browser
4. Certificate ID generated and saved to database
5. PDF downloaded to user's device
6. Certificate verifiable at /verify/:certificateId
```

## Public Verification (VerifyCertificate.tsx)

- **Route:** `/verify/:certificateId` (NO auth required)
- **Purpose:** Anyone can verify a certificate is authentic
- **Shows:** Recipient, cert title, score, date, verification badge
- **Data source:** `assessment_attempts` table lookup by certificate ID

## Certification Definitions

**File:** `certificationData.ts` (8,775 bytes)

```typescript
interface Certification {
  id: string;
  title: string;              // e.g., "React Developer"
  description: string;
  image: string;              // Certificate image/icon
  duration_minutes: number;   // Time limit
  question_count: number;     // Number of questions
  passing_score: number;      // Minimum % to pass
  difficulty: string;
  topics: string[];           // Covered topics
  prerequisites: string[];
}
```

## useCertifications Hook (337 lines)

| Operation | Purpose |
|-----------|---------|
| Fetch certifications | Load cert catalog |
| Fetch exam questions | Load questions for a cert |
| Start exam attempt | Create attempt record |
| Submit exam | Grade and save results |
| Fetch results | Load result by attempt ID |
| Fetch user certificates | List earned certs |
| Generate certificate | Create PDF |
