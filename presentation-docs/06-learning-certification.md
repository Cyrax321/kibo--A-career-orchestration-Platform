# Kibo Learning & Certification System

## Complete Learning Management System Documentation

---

## 1. Learning System Overview

Kibo provides a comprehensive **Learning Management System (LMS)** featuring:

- **Structured Python Courses**: Beginner, Intermediate, Advanced
- **Interactive Lessons**: Markdown content with code examples
- **In-Browser Code Execution**: Practice directly in the browser
- **Hint Unlock System**: Progressive hint revealing
- **Progress Tracking**: Per-lesson completion status
- **Certificate Generation**: Completion certificates

---

## 2. Course Structure

### 2.1 Python Beginner Course

**Course Details:**
- **ID**: `python-beginner`
- **Title**: KIBO PYTHON COURSE
- **Description**: Master Python the Kibo Way - Simple, Fast, & Effective
- **Difficulty**: Beginner
- **Lessons**: 25+ modules

**Module List:**
| Module ID | Title | Topics |
|-----------|-------|--------|
| intro | Python Intro | What is Python, Why Kibo, Use cases |
| syntax | Python Syntax | Indentation, Execution, Comments |
| comments | Python Comments | Single-line, Multi-line, Documentation |
| variables | Variables | Variables, Data Types, Naming |
| data-types | Data Types | Strings, Numbers, Booleans |
| operators | Operators | Arithmetic, Comparison, Logical |
| strings | Strings | String Methods, Slicing, Formatting |
| lists | Lists | List Operations, Methods, Comprehension |
| tuples | Tuples | Tuple Basics, Immutability, Packing |
| sets | Sets | Set Operations, Methods |
| dictionaries | Dictionaries | Dict Basics, Methods, Nesting |
| conditionals | Conditionals | if, elif, else, Match Case |
| loops | Loops | for, while, Nested Loops |
| functions | Functions | def, Parameters, Return, Scope |
| args-kwargs | *args & **kwargs | Variable Arguments |
| lambda | Lambda Functions | Anonymous Functions, map, filter |
| modules | Modules | Import, From, Alias |
| files | File I/O | Reading, Writing, Files |
| errors | Error Handling | try, except, finally, Custom |
| oop | OOP Basics | Classes, Objects, Methods |
| inheritance | Inheritance | Class Inheritance, Super |
| polymorphism | Polymorphism | Method Overriding |
| regex | Regular Expressions | re module, Patterns |
| datetime | Date & Time | datetime, timedelta |
| math | Math Module | math module, Statistics |

### 2.2 Course Data Structure

```typescript
interface CourseLesson {
  id: string;
  title: string;
  content: string;           // Markdown supported
  exampleCode?: string;      // For "Try it Yourself"
  exercise?: {
    question: string;
    placeholder: string;    // Code with ___
    solution: string;        // Expected answer
    hint?: string;
    hints?: string[];       // Multiple hints
  };
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
  image?: string;
}
```

### 2.3 Lesson Content Format

```markdown
# Lesson Title

## Topic Explanation
Content goes here with **bold**, *italic*, and `code`.

### Subtopic
More detailed explanation.

```python
# Code Example
def example():
    return "Hello, Kibo!"
```

### Key Points
- Point 1
- Point 2

> Important quote or tip
```

---

## 3. Code Execution in Learning

### 3.1 In-Browser Execution

```typescript
// Execute code from lesson examples
import { executeCode } from '@/lib/codeExecutor'

const result = await executeCode(
  `print("Hello, World!")`,
  'python',
  ''
)

// Returns: { success: true, output: 'Hello, World!\n' }
```

### 3.2 Exercise Validation

```typescript
// Validate user exercise answers
function validateExercise(
  userCode: string,
  exercise: Exercise
): { passed: boolean; output: string } {
  // Replace placeholder with user's answer
  const fullCode = exercise.placeholder.replace('___', userCode)
  
  // Execute
  const result = await executeCode(fullCode, 'python', '')
  
  // Check if output matches expected
  const passed = result.output.trim() === exercise.solution
  
  return {
    passed,
    output: result.output
  }
}
```

---

## 4. Progress Tracking

### 4.1 Course Progress Table

```sql
CREATE TABLE user_course_progress (
  id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID REFERENCES profiles(user_id),
  completed_lessons TEXT[] DEFAULT '{}',
  unlocked_hints TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Progress Functions

```sql
-- Get course progress
CREATE OR REPLACE FUNCTION get_course_progress(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  completed_lessons TEXT[],
  unlocked_hints TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM user_course_progress
  WHERE user_id = p_user_id;
END;
$$;

-- Save course progress
CREATE OR REPLACE FUNCTION save_course_progress(
  p_user_id UUID,
  p_completed_lessons TEXT[],
  p_unlocked_hints TEXT[]
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO user_course_progress (user_id, completed_lessons, unlocked_hints)
  VALUES (p_user_id, p_completed_lessons, p_unlocked_hints)
  ON CONFLICT (user_id)
  DO UPDATE SET
    completed_lessons = p_completed_lessons,
    unlocked_hints = p_unlocked_hints,
    updated_at = NOW();
END;
$$;
```

### 4.3 Frontend Progress Hook

```typescript
// Progress tracking in learning module
function useCourseProgress(courseId: string) {
  const { data: progress, refetch } = useQuery({
    queryKey: ['courseProgress', courseId, userId],
    queryFn: () => getCourseProgress(userId),
    enabled: !!userId,
  })

  const completeLesson = async (lessonId: string) => {
    const newCompleted = [...(progress?.completed_lessons || []), lessonId]
    await saveCourseProgress(userId, newCompleted, progress?.unlocked_hints || [])
    refetch()
  }

  const unlockHint = async (lessonId: string, hintIndex: number) => {
    const hintKey = `${lessonId}_hint_${hintIndex}`
    const newUnlocked = [...(progress?.unlocked_hints || []), hintKey]
    await saveCourseProgress(userId, progress?.completed_lessons || [], newUnlocked)
    refetch()
  }

  return {
    completedLessons: progress?.completed_lessons || [],
    unlockedHints: progress?.unlocked_hints || [],
    completeLesson,
    unlockHint,
    progressPercent: calculateProgress(progress, totalLessons),
  }
}
```

---

## 5. Certification System

### 5.1 Certification Catalog

#### Kibo Certified Python - Beginner (KCP-B01)

| Property | Value |
|----------|-------|
| Code | KCP-B01 |
| Level | Beginner |
| Duration | 90 minutes |
| Total Marks | 100 |
| Passing Score | 60% |
| Cooldown | 48 hours |
| Premium | No |

**Syllabus:**
- Variables, Data Types & Operators
- Control Flow (if/elif/else, loops)
- Functions & Scope
- Lists, Tuples, Sets & Dictionaries
- String Manipulation
- List Comprehensions
- Hash Maps & Prefix Sums
- Sorting & Interval Problems
- Mutable vs Immutable Objects
- Closures & Late Binding
- Time & Space Complexity Analysis
- Debugging & Code Tracing

**Exam Format:**
| Section | Type | Count | Marks | Weight |
|---------|------|-------|-------|--------|
| MCQ | Multiple Choice | 5 | 20 | 20% |
| Coding | Algorithm Problem | 1 | 40 | 40% |
| Debugging | Bug Fix | 1 | 30 | 30% |

---

#### Kibo Certified Python - Intermediate (KCP-I01)

| Property | Value |
|----------|-------|
| Code | KCP-I01 |
| Level | Intermediate |
| Duration | 120 minutes |
| Total Marks | 100 |
| Passing Score | 65% |
| Cooldown | 72 hours |
| Premium | Yes |

**Syllabus:**
- Advanced OOP (ABC, Metaclasses, Descriptors)
- Generators & Iterators
- Decorators & Context Managers
- Concurrency (Threading, Asyncio)
- Graph Algorithms (BFS, DFS, Dijkstra)
- Dynamic Programming
- System Design Basics
- Testing & Mocking

---

#### Kibo Certified Python - Advanced (KCP-A01)

| Property | Value |
|----------|-------|
| Code | KCP-A01 |
| Level | Advanced |
| Duration | 150 minutes |
| Total Marks | 100 |
| Passing Score | 70% |
| Cooldown | 96 hours |
| Premium | Yes |

**Syllabus:**
- Metaclasses & Descriptor Protocol
- Async/Await & Event Loop Internals
- Memory Management & Garbage Collection
- C Extensions & ctypes/cffi
- Advanced Decorators & functools
- Design Patterns (Strategy, Observer, Factory)
- Graph Algorithms (Topological Sort, Shortest Path)
- Dynamic Programming (Advanced)
- Concurrency (multiprocessing, GIL, threading)
- Type System (Protocol, TypeVar, Generic)
- Performance Profiling & Optimization
- Production Code Review & Refactoring

---

### 5.2 Certification Data Structure

```typescript
interface Certification {
  id: string;
  code: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  passing_score: number;
  cooldown_hours: number;
  is_premium: boolean;
  syllabus: string[];
  format: {
    sections: {
      type: 'mcq' | 'coding' | 'debugging';
      label: string;
      count: number;
      marks: number;
      weight: number;
      description: string;
    }[];
  };
  rules: string[];
  icon: string;
  image: string;
}
```

---

### 5.3 Exam Engine

#### Exam State Management
```typescript
interface ExamState {
  certificationId: string;
  attemptId: string;
  status: 'not_started' | 'in_progress' | 'submitted';
  startedAt: string | null;
  timeRemaining: number; // seconds
  currentSection: number;
  currentQuestion: number;
  answers: Record<number, string>;
  flaggedQuestions: number[];
}
```

#### Exam Timer
```typescript
// Timer countdown
useEffect(() => {
  if (status !== 'in_progress') return
  
  const interval = setInterval(() => {
    setTimeRemaining(prev => {
      if (prev <= 1) {
        // Auto-submit
        submitExam()
        return 0
      }
      return prev - 1
    })
  }, 1000)
  
  return () => clearInterval(interval)
}, [status])
```

#### Proctoring Features
```typescript
// Tab switch monitoring
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Log tab switch
      logTabSwitch(attemptId, Date.now())
      incrementTabSwitchCount()
    }
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
}, [attemptId])
```

---

### 5.4 Exam Database Schema

```sql
-- Certification attempts table
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
  tab_switch_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 5.5 Certificate Generation

#### Certificate Data Structure
```typescript
interface Certificate {
  id: string;
  recipientName: string;
  certificationCode: string;
  certificationTitle: string;
  issueDate: string;
  expiryDate: string | null;
  verificationUrl: string;
  qrCode: string;
  status: 'active' | 'expired' | 'revoked';
}
```

#### PDF Generation
```typescript
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

async function generateCertificate(certificate: Certificate): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([842, 595]) // A4 landscape
  
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  
  // Title
  page.drawText('Certificate of Achievement', {
    x: 150,
    y: 450,
    size: 36,
    font: helveticaBold,
    color: rgb(0, 0.37, 0.53),
  })
  
  // Recipient
  page.drawText(certificate.recipientName, {
    x: 200,
    y: 350,
    size: 24,
    font: helveticaBold,
  })
  
  // Certification
  page.drawText(certificate.certificationTitle, {
    x: 150,
    y: 280,
    size: 18,
    font: helvetica,
  })
  
  // Date
  page.drawText(`Issued: ${certificate.issueDate}`, {
    x: 50,
    y: 50,
    size: 12,
    font: helvetica,
  })
  
  return pdfDoc.save()
}
```

#### Certificate Verification
```typescript
// Verification page
// /verify/:certificateId

async function verifyCertificate(certificateId: string) {
  const { data: certificate, error } = await supabase
    .from('certification_attempts')
    .select(`
      *,
      profiles (full_name),
      certifications (code, title)
    `)
    .eq('id', certificateId)
    .eq('status', 'completed')
    .gte('score', passingScore)
    .single()
  
  return {
    valid: !!certificate,
    certificate
  }
}
```

---

## 6. Assessment System

### 6.1 Assessment Types

| Type | Description | Duration | Questions |
|------|-------------|----------|-----------|
| Practice | Untimed practice | No limit | 10-20 |
| Timed | Test environment | 30 min | 15-25 |
| Mock Interview | Real interview sim | 60 min | 3-5 problems |

### 6.2 Question Types

```typescript
interface Question {
  id: string;
  type: 'mcq' | 'coding' | 'fill_blank' | 'matching';
  content: string;
  options?: string[];       // For MCQ
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
}
```

### 6.3 Assessment Database

```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT UUID(),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  questions JSONB NOT NULL,
  passing_score INTEGER DEFAULT 60,
  created_at TIMESTAMP DEFAULT NOW()
);

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

---

## 7. Learning Features

### 7.1 Hint System

```typescript
// Progressive hint reveal
function HintSystem({ hints, lessonId, unlockedHints }) {
  const availableHints = hints.filter((_, i) => 
    unlockedHints.includes(`${lessonId}_hint_${i}`)
  )
  
  return (
    <div className="hints">
      {hints.map((hint, i) => (
        <HintButton
          key={i}
          index={i}
          unlocked={unlockedHints.includes(`${lessonId}_hint_${i}`)}
          onUnlock={() => unlockHint(lessonId, i)}
        >
          {availableHints[i] || `Hint ${i + 1}`}
        </HintButton>
      ))}
    </div>
  )
}
```

### 7.2 Code Examples

```typescript
// Interactive code playground in lessons
function LessonCodeExample({ code, language = 'python' }) {
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  
  const runCode = async () => {
    setRunning(true)
    const result = await executeCode(code, language, '')
    setOutput(result.output)
    setRunning(false)
  }
  
  return (
    <div className="code-example">
      <MonacoEditor value={code} language={language} readOnly />
      <Button onClick={runCode} disabled={running}>
        {running ? 'Running...' : 'Run Code'}
      </Button>
      {output && <pre>{output}</pre>}
    </div>
  )
}
```

---

## 8. Progress Visualization

### 8.1 Course Progress

```typescript
// Calculate progress percentage
function calculateProgress(completed: string[], total: number): number {
  return Math.round((completed.length / total) * 100)
}

// Progress bar component
function CourseProgressBar({ completed, total }) {
  const percent = calculateProgress(completed, total)
  
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percent}%` }} 
        />
      </div>
      <span>{percent}% Complete</span>
    </div>
  )
}
```

### 8.2 Lesson Navigation

```typescript
// Sidebar lesson list with completion status
function LessonList({ lessons, completedLessons }) {
  return (
    <nav className="lesson-nav">
      {lessons.map((lesson, index) => (
        <LessonItem
          key={lesson.id}
          index={index + 1}
          title={lesson.title}
          completed={completedLessons.includes(lesson.id)}
        />
      ))}
    </nav>
  )
}
```

---

## 9. Integration Points

### 9.1 XP Awards

| Action | XP |
|--------|-----|
| Complete lesson | 10 |
| Complete course | 100 |
| Pass certification | 100 |
| Perfect score | 50 bonus |

### 9.2 Achievement Triggers

- **Graduate**: Complete Python Beginner course
- **Certified**: Pass first certification
- **Perfect Score**: 100% on any assessment
- **Fast Learner**: Complete course in 7 days

---

*This learning and certification documentation covers the complete LMS architecture, course structure, progress tracking, exam engine, and certificate generation system for the Kibo platform.*
