// Judge0 CE code execution utility
// Uses the public Judge0 CE instance (ce.judge0.com) — no API key required

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  runtime?: number;
}

export interface TestCaseResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
}

// Public Judge0 CE instance — no authentication required
const JUDGE0_API_URL = "https://ce.judge0.com/submissions?base64_encoded=true&wait=true&fields=stdout,stderr,status,time,memory,compile_output";

// Judge0 CE language IDs
const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,  // JavaScript (Node.js 12.14.0)
  python: 71,      // Python (3.8.1)
  cpp: 54,         // C++ (GCC 9.2.0)
  c: 50,           // C (GCC 9.2.0)
  java: 62,        // Java (OpenJDK 13.0.1)
  typescript: 74,  // TypeScript (3.7.4)
  csharp: 51,      // C# (Mono 6.6.0.161)
  go: 60,          // Go (1.13.5)
  rust: 73,        // Rust (1.40.0)
  kotlin: 78,      // Kotlin (1.3.70)
  swift: 83,       // Swift (5.2.3)
  ruby: 72,        // Ruby (2.7.0)
  php: 68,         // PHP (7.4.1)
  r: 80,           // R (4.0.0)
  perl: 85,        // Perl (5.28.1)
  bash: 46,        // Bash (5.0.0)
};

// Helper: base64 encode (handles unicode)
function b64Encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

// Helper: base64 decode (handles unicode)
function b64Decode(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return atob(str);
  }
}

// Execute code using Judge0 CE public instance
export async function executeCode(
  code: string,
  language: string,
  stdin: string = ""
): Promise<ExecutionResult> {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    return { success: false, output: "", error: `Unsupported language: ${language}` };
  }

  const startTime = Date.now();

  try {
    const response = await fetch(JUDGE0_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: b64Encode(code),
        stdin: stdin ? b64Encode(stdin) : "",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        output: "",
        error: `API Error (${response.status}): ${errorText}`,
      };
    }

    const result = await response.json();
    const runtime = Date.now() - startTime;

    // Judge0 status IDs: 1=In Queue, 2=Processing, 3=Accepted, 4=Wrong Answer,
    // 5=Time Limit, 6=Compilation Error, 7-12=Runtime Errors, 13=Internal Error
    const statusId = result.status?.id;
    const stdout = result.stdout ? b64Decode(result.stdout).trim() : "";
    const stderr = result.stderr ? b64Decode(result.stderr).trim() : "";
    const compileOutput = result.compile_output ? b64Decode(result.compile_output).trim() : "";

    // Status 3 = Accepted (ran successfully)
    if (statusId === 3) {
      return {
        success: true,
        output: stdout || "Program finished with no output.",
        runtime,
      };
    }

    // Status 6 = Compilation Error
    if (statusId === 6) {
      return {
        success: false,
        output: compileOutput || "Compilation error",
        error: compileOutput || "Compilation error",
        runtime,
      };
    }

    // Status 5 = Time Limit Exceeded
    if (statusId === 5) {
      return {
        success: false,
        output: "Time Limit Exceeded",
        error: "Time Limit Exceeded",
        runtime,
      };
    }

    // Runtime errors (statuses 7-12) or other failures
    const errorOutput = stderr || compileOutput || stdout || result.status?.description || "Execution failed";
    return {
      success: false,
      output: errorOutput,
      error: errorOutput,
      runtime,
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// Run code against multiple test cases
export async function runTestCases(
  code: string,
  language: string,
  testCases: { input: string; output: string }[],
  functionName?: string
): Promise<{ results: TestCaseResult[]; allPassed: boolean; runtime: number }> {
  const results: TestCaseResult[] = [];
  let allPassed = true;
  const startTime = Date.now();

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];

    // Use stdin approach: user code reads from stdin and prints to stdout
    const result = await executeCode(code, language, testCase.input);

    const actualOutput = result.output.trim();
    const expectedOutput = testCase.output.trim();

    // Normalize outputs for comparison
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    const passed = normalizedActual === normalizedExpected;

    if (!passed) allPassed = false;

    results.push({
      passed,
      input: testCase.input,
      expected: expectedOutput,
      actual: actualOutput,
      error: result.error,
    });
  }

  return {
    results,
    allPassed,
    runtime: Date.now() - startTime,
  };
}

// Normalize output for comparison
function normalizeOutput(output: string): string {
  let normalized = output.trim().toLowerCase();

  // Try to parse as JSON and re-stringify for consistent formatting
  try {
    const parsed = JSON.parse(normalized);
    normalized = JSON.stringify(parsed);
  } catch {
    // Not JSON, keep as-is
  }

  // Remove spaces around brackets and commas
  normalized = normalized.replace(/\s*,\s*/g, ",");
  normalized = normalized.replace(/\[\s+/g, "[");
  normalized = normalized.replace(/\s+\]/g, "]");

  return normalized;
}
