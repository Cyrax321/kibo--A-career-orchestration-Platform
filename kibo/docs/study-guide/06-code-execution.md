# 06 – Code Execution Engine (Deep Dive)

## Overview
Kibo's Arena (Code Lab) lets users solve coding problems in 16 languages with real-time execution and test case validation, powered by Judge0 CE.

**Key Files:**
- `src/lib/codeExecutor.ts` (5,843 bytes) – Core execution engine
- `src/pages/Arena.tsx` (57,297 bytes) – Main code lab UI (largest file)
- `src/pages/Playground.tsx` (19,123 bytes) – Free-form playground

## Judge0 CE (Community Edition)

- **What:** Open-source online code compilation and execution system
- **URL:** `https://ce.judge0.com`
- **Auth:** None required (public instance)
- **Sandbox:** Code runs in Docker containers with resource limits
- **Limits:** Time limit (~5s), Memory limit (~256MB), Network disabled

### Why Judge0 CE?
- Free and open-source
- Supports 60+ languages (we use 16)
- Sandboxed execution (safe from malicious code)
- REST API (easy to integrate)
- No API key needed for CE instance

## 16 Supported Languages

| Language | Judge0 ID | Runtime | Version |
|----------|-----------|---------|---------|
| JavaScript | 63 | Node.js | 12.14.0 |
| Python 3 | 71 | CPython | 3.8.1 |
| C++ | 54 | GCC | 9.2.0 |
| C | 50 | GCC | 9.2.0 |
| Java | 62 | OpenJDK | 13.0.1 |
| TypeScript | 74 | TS Compiler | 3.7.4 |
| C# | 51 | Mono | 6.6.0.161 |
| Go | 60 | Go | 1.13.5 |
| Rust | 73 | Rust | 1.40.0 |
| Kotlin | 78 | Kotlin | 1.3.70 |
| Swift | 83 | Swift | 5.2.3 |
| Ruby | 72 | Ruby | 2.7.0 |
| PHP | 68 | PHP | 7.4.1 |
| R | 80 | R | 4.0.0 |
| Perl | 85 | Perl | 5.28.1 |
| Bash | 46 | Bash | 5.0.0 |

## Core Functions in codeExecutor.ts

### 1. `executeCode(code, language, stdin)`
```typescript
export async function executeCode(
  code: string, language: string, stdin: string = ""
): Promise<ExecutionResult>
```
- Encodes code + stdin to Base64
- POSTs to `ce.judge0.com/submissions/?base64_encoded=true&wait=true`
- Decodes Base64 response (stdout, stderr, compile_output)
- Returns: `{ output, error, status, time, memory }`

### 2. `runTestCases(code, language, testCases, functionName)`
```typescript
export async function runTestCases(
  code: string, language: string,
  testCases: { input: string; output: string }[],
  functionName?: string
): Promise<{ results: TestCaseResult[]; allPassed: boolean; runtime: number }>
```
- Iterates through each test case
- Calls `executeCode()` for each with the test input as stdin
- Compares output with expected (after normalization)
- Returns array of pass/fail results

### 3. `normalizeOutput(output)`
- Trims whitespace
- Removes trailing newlines
- Normalizes line endings
- Used for comparing expected vs actual output

### 4. `b64Encode(str)` / `b64Decode(str)`
- Encode/decode strings for Judge0 Base64 requirement

## Execution Flow (Step by Step)

```
1. User writes code in Monaco Editor on Arena page
2. User clicks "Run" button
3. Frontend calls executeCode(code, selectedLanguage, stdin)
4. codeExecutor.ts:
   a. Maps language name → Judge0 language_id
   b. Base64-encodes source_code and stdin
   c. Sends POST to Judge0 CE API:
      POST https://ce.judge0.com/submissions/?base64_encoded=true&wait=true
      Body: { source_code, language_id, stdin }
   d. Waits for response (synchronous with ?wait=true)
   e. Decodes Base64 stdout/stderr from response
5. Results displayed in output panel:
   - Green = Accepted (status 3)
   - Red = Wrong Answer / Error
   - Yellow = Time Limit Exceeded
6. If "Submit" (not just "Run"):
   a. runTestCases() runs ALL test cases
   b. If allPassed:
      - XP awarded via recordProblemSolved(difficulty)
      - Confetti celebration
      - Sound effect plays
   c. If not all passed:
      - Show which test cases failed
      - Show expected vs actual output
```

## Monaco Editor Integration

- **Package:** `@monaco-editor/react` 4.7.0
- **What it is:** VS Code's editor engine running in the browser
- **Features used:**
  - Syntax highlighting for 16 languages
  - IntelliSense autocomplete
  - Minimap
  - Line numbers
  - Error highlighting
  - Dark/light theme support
  - Code folding
  - Find & replace

## Problem Structure (Database)

```typescript
interface CodingProblem {
  id: string;
  title: string;
  description: string;        // Markdown formatted
  difficulty: 'easy' | 'medium' | 'hard';
  test_cases: TestCase[];      // JSONB array
  company_tags: string[];      // e.g., ['Google', 'Amazon']
  topic_tags: string[];        // e.g., ['arrays', 'dp']
  starter_code: Record<string, string>; // Per-language templates
}

interface TestCase {
  input: string;
  output: string;
  is_hidden: boolean;         // Hidden test cases not shown to user
}
```

## Error Handling

| Status | Handling | User Sees |
|--------|----------|-----------|
| Status 3 (Accepted) | Green checkmark | "All test cases passed!" |
| Status 4 (Wrong Answer) | Red X | Expected vs Actual diff |
| Status 5 (TLE) | Yellow clock | "Time Limit Exceeded - optimize" |
| Status 6 (Compile Error) | Red warning | Compiler error output |
| Status 7-12 (Runtime) | Red warning | Runtime error details |
| Network Error | Toast | "Network error, try again" |
| Rate Limited (429) | Toast | "Too many requests, wait" |

## Migration from Piston API to Judge0

Originally, Kibo used the Piston API for code execution. This was migrated to Judge0 CE for:
- Better language support
- More reliable public instance
- Simpler API (single POST vs create + poll)
- No API key requirement
