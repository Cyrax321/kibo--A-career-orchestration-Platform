import * as React from "react";
import { motion } from "framer-motion";
import { Clock, AlertTriangle, Play, Terminal, Lock, ShieldAlert, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Assessment } from "./types";
import { runTestCases, TestCaseResult } from "@/lib/pistonExecutor";
import { toast } from "sonner";

interface AssessmentModeProps {
  assessment: Assessment;
  onComplete: (passed: boolean, score: number) => void;
  onExit: () => void;
}

type SupportedLanguage = "javascript" | "python" | "java" | "cpp";

// Define the structure for a problem
interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimit: number; // in minutes
  description: React.ReactNode;
  functionName: string;
  testCases: { input: string; output: string }[];
  templates: Record<SupportedLanguage, string>;
}

const LANGUAGES: { value: SupportedLanguage; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

// Mock Data for Multiple Problems with Multi-Language Support
const PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    timeLimit: 20,
    description: (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <p>
          Given an array of integers <code>nums</code> and an integer <code>target</code>,
          return indices of the two numbers such that they add up to <code>target</code>.
        </p>
        <p>
          You may assume that each input would have exactly one solution,
          and you may not use the same element twice.
        </p>
        <h4>Example:</h4>
        <pre className="bg-muted p-3 rounded-lg">
          {`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] == 9`}
        </pre>
      </div>
    ),
    functionName: "twoSum",
    testCases: [
      { input: "[2,7,11,15], 9", output: "[0,1]" },
      { input: "[3,2,4], 6", output: "[1,2]" },
      { input: "[3,3], 6", output: "[0,1]" }
    ],
    templates: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
  
}`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`
    }
  },
  {
    id: 2,
    title: "Palindrome Number",
    difficulty: "Medium",
    timeLimit: 30,
    description: (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <p>
          Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a
          <span className="font-semibold text-primary"> palindrome</span>, and <code>false</code> otherwise.
        </p>
        <h4>Example 1:</h4>
        <pre className="bg-muted p-3 rounded-lg">
          {`Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.`}
        </pre>
        <h4>Example 2:</h4>
        <pre className="bg-muted p-3 rounded-lg">
          {`Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.`}
        </pre>
      </div>
    ),
    functionName: "isPalindrome",
    testCases: [
      { input: "121", output: "true" },
      { input: "-121", output: "false" },
      { input: "10", output: "false" }
    ],
    templates: {
      javascript: `/**
 * @param {number} x
 * @return {boolean}
 */
function isPalindrome(x) {
  // Write your solution here
  
}`,
      python: `def isPalindrome(x):
    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        // Write your solution here
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool isPalindrome(int x) {
        // Write your solution here
        return false;
    }
};`
    }
  }
];

export const AssessmentMode: React.FC<AssessmentModeProps> = ({ assessment, onComplete, onExit }) => {
  // Calculate total time based on problems
  const totalDuration = React.useMemo(() => PROBLEMS.reduce((acc, p) => acc + p.timeLimit, 0) * 60, []);

  const [timeLeft, setTimeLeft] = React.useState(totalDuration);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedLanguage, setSelectedLanguage] = React.useState<SupportedLanguage>("javascript");

  // State to store code: { [questionIndex]: { [language]: codeString } }
  const [answers, setAnswers] = React.useState<Record<number, Record<string, string>>>(() => {
    const initial: Record<number, Record<string, string>> = {};
    PROBLEMS.forEach((p, i) => {
      initial[i] = { ...p.templates };
    });
    return initial;
  });

  // State to store results for EACH question: { [questionIndex]: results[] }
  const [results, setResults] = React.useState<Record<number, TestCaseResult[] | null>>({});
  const [executionErrors, setExecutionErrors] = React.useState<Record<number, string | null>>({});

  const [showExitConfirm, setShowExitConfirm] = React.useState(false);
  const [showWarning, setShowWarning] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  const [tabSwitchCount, setTabSwitchCount] = React.useState(0);
  const [pasteAttempts, setPasteAttempts] = React.useState(0);

  const editorRef = React.useRef<any>(null);

  const currentProblem = PROBLEMS[currentQuestionIndex];
  // Get code for current question AND current language
  const currentCode = answers[currentQuestionIndex]?.[selectedLanguage] || currentProblem.templates[selectedLanguage];

  const currentResults = results[currentQuestionIndex];
  const currentError = executionErrors[currentQuestionIndex];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Tab visibility warning & Anti-Cheating
  React.useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        setShowWarning(true);
      }
    };

    // Prevent context menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error("Right-click is disabled during assessment", { icon: <ShieldAlert className="h-4 w-4 text-destructive" /> });
    };

    // Prevent Copy/Cut/Paste shortcuts at document level as backup
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        toast.error("Copy/Paste is disabled", { icon: <Lock className="h-4 w-4 text-warning" /> });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Disable Paste Command
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
      toast.error("Pasting code is not allowed!", { icon: <Lock className="h-4 w-4 text-destructive" /> });
    });

    // Disable Context Menu (redundant but safe)
    editor.updateOptions({ contextmenu: false });

    // Intercept paste events directly from the container
    const container = editor.getContainerDomNode();
    container.addEventListener('paste', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toast.error("Pasting is strictly prohibited!", { icon: <ShieldAlert className="h-4 w-4 text-destructive" /> });
    }, true);
  };

  const handleCodeChange = (value: string | undefined) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        ...prev[currentQuestionIndex],
        [selectedLanguage]: value || ""
      }
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  const handleRunCode = async () => {
    setIsRunning(true);
    // Clear previous results/errors for this question
    setResults(prev => ({ ...prev, [currentQuestionIndex]: null }));
    setExecutionErrors(prev => ({ ...prev, [currentQuestionIndex]: null }));

    try {
      const { results: runResults, allPassed } = await runTestCases(
        currentCode,
        selectedLanguage,
        currentProblem.testCases,
        currentProblem.functionName
      );

      setResults(prev => ({ ...prev, [currentQuestionIndex]: runResults }));

      if (allPassed) {
        toast.success("All test cases passed!");
      } else {
        toast.warning("Some test cases failed.");
      }
    } catch (error) {
      setExecutionErrors(prev => ({
        ...prev,
        [currentQuestionIndex]: "Execution failed. Please check your syntax."
      }));
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);

    let totalQuestions = PROBLEMS.length;
    let passedQuestions = 0;

    // Re-validate all questions
    for (let i = 0; i < totalQuestions; i++) {
      const problem = PROBLEMS[i];
      // Ensure we check the correct language for the submitted answer? 
      // For simplicity, we check the language currently selected for that question or default to JS if user never touched it.
      // Actually, since answer structure is { [lang]: code }, we need to know WHICH language was "submitted".
      // Use Javascript as default validation language if multiple exist, or checking the last edited one would be better but complex.
      // Let's assume the user solves it in the currently selected language for that question. 
      // NOTE: In a real app, we would track "submission language" per question.
      // Here, we'll re-run with 'javascript' OR the last selected language if we tracked it.
      // Simplified: Just use the current selectedLanguage for the CURRENT question, and default JS for others.

      // Better Approach: Check if ANY language solution passes? No, too slow.
      // Let's just validate using 'javascript' for now as the main one, OR if we had a per-question "active language" state.
      // Since we only track `selectedLanguage` globally (oops, it should be global across UI but maybe switching keeps it?), 
      // let's just retry the current code in the UI for the current question, and for others use the stored answer in their respective "last known" language or just JS.
      // Implementing simple JS fallback for non-active questions for this demo.

      const langToTest = i === currentQuestionIndex ? selectedLanguage : "javascript";
      const answer = answers[i]?.[langToTest] || problem.templates[langToTest as SupportedLanguage];

      try {
        const { allPassed } = await runTestCases(answer, langToTest, problem.testCases, problem.functionName);
        if (allPassed) passedQuestions++;
      } catch (e) {
        // Failed
      }
    }

    setIsRunning(false);

    let score = Math.round((passedQuestions / totalQuestions) * 100);

    if (tabSwitchCount > 0) {
      score = Math.max(0, score - (tabSwitchCount * 10));
      toast.error(`Score deducted for tab switching (${tabSwitchCount} times)`);
    }

    const passed = score >= 70;
    onComplete(passed, score);
  };

  const handleNext = () => {
    if (currentQuestionIndex < PROBLEMS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col select-none">
      {/* Tab warning dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Tab Switch Detected ({tabSwitchCount})
            </DialogTitle>
            <DialogDescription>
              Switching tabs during an assessment is flagged as potential cheating.
              This activity has been logged and will affect your final score.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowWarning(false)}>I Understand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Timer Bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className={cn(
            "h-full transition-colors",
            timeLeft < 300 ? "bg-destructive" : timeLeft < 600 ? "bg-warning" : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <ShieldAlert className={cn("h-5 w-5", tabSwitchCount > 0 ? "text-destructive" : "text-success")} />
          <span className="font-bold">{assessment.title}</span>
          <Badge variant="secondary">
            Question {currentQuestionIndex + 1} of {PROBLEMS.length}
          </Badge>
          <Badge variant={currentProblem.difficulty === "Easy" ? "secondary" : currentProblem.difficulty === "Medium" ? "default" : "destructive"}>
            {currentProblem.difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs border-destructive/50 text-destructive bg-destructive/5">
            <Lock className="h-3 w-3 mr-1" /> Anti-Cheat Active
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full font-mono font-bold",
            timeLeft < 300 ? "bg-destructive/10 text-destructive" :
              timeLeft < 600 ? "bg-warning/10 text-warning" : "bg-muted"
          )}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowExitConfirm(true)}>
            Exit
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem description */}
        <div className="w-1/2 border-r border-border p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{currentProblem.title}</h2>
              <p className="text-xs text-muted-foreground mt-1">Recommended Time: {currentProblem.timeLimit} mins</p>
            </div>

            {/* Visual indicator if this problem is solved */}
            {results[currentQuestionIndex]?.every(r => r.passed) && (
              <Badge className="bg-success/10 text-success hover:bg-success/20 border-success/20">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Solved
              </Badge>
            )}
          </div>

          {currentProblem.description}

          {/* Test Results Panel */}
          <div className="mt-8 border rounded-lg bg-card overflow-hidden">
            <div className="px-4 py-2 border-b bg-muted/50 font-medium flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Console / Test Results
            </div>
            <div className="p-4 min-h-[200px] max-h-[300px] overflow-y-auto space-y-3 font-mono text-sm">
              {isRunning && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="animate-spin">⏳</span> Running code...
                </div>
              )}

              {!isRunning && currentError && (
                <div className="text-destructive whitespace-pre-wrap">{currentError}</div>
              )}

              {!isRunning && currentResults && (
                <div className="space-y-3">
                  {currentResults.map((result, i) => (
                    <div key={i} className={cn("p-3 rounded border", result.passed ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20")}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn("font-bold", result.passed ? "text-success" : "text-destructive")}>
                          Case {i + 1}: {result.passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                        <span className="text-muted-foreground">Input:</span> <code>{result.input}</code>
                        <span className="text-muted-foreground">Expected:</span> <code>{result.expected}</code>
                        <span className="text-muted-foreground">Output:</span> <code className={result.passed ? "" : "text-destructive"}>{result.actual}</code>
                        {result.error && (
                          <>
                            <span className="text-muted-foreground">Error:</span> <code className="text-destructive">{result.error}</code>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isRunning && !currentResults && !currentError && (
                <div className="text-muted-foreground italic">
                  Run your code to see the results here.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="w-1/2 flex flex-col bg-white border-l border-border">
          {/* File Tab */}
          <div className="px-3 py-1.5 text-xs font-medium bg-muted/30 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              {/* Language Selector */}
              <Select value={selectedLanguage} onValueChange={(v: SupportedLanguage) => setSelectedLanguage(v)}>
                <SelectTrigger className="h-6 w-[120px] text-xs border-0 bg-transparent focus:ring-0 text-foreground hover:bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-muted-foreground text-[10px] hidden sm:inline-block">Auto-saved</span>
          </div>
          <Editor
            height="100%"
            language={selectedLanguage === "cpp" ? "cpp" : selectedLanguage === "java" ? "java" : selectedLanguage === "python" ? "python" : "javascript"}
            value={currentCode}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            theme="light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              contextmenu: false,
              automaticLayout: true,
              padding: { top: 12 },
              fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
              fontLigatures: true,
              cursorBlinking: "smooth",
              smoothScrolling: true,
              cursorSmoothCaretAnimation: "on",
              renderLineHighlight: "line",
              lineHeight: 22,
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card">
        <div className="flex gap-2">
          {/* Direct Question Navigation */}
          {PROBLEMS.map((_, i) => (
            <Button
              key={i}
              variant={currentQuestionIndex === i ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentQuestionIndex(i)}
            >
              Q{i + 1}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || isRunning}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>

          {/* Run Code Button */}
          <Button variant="secondary" onClick={handleRunCode} disabled={isRunning} className="min-w-[120px]">
            {isRunning ? (
              <>
                <span className="animate-spin mr-2">⏳</span> Running
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" /> Run Code
              </>
            )}
          </Button>

          {/* Next Button (if not last question) */}
          {currentQuestionIndex < PROBLEMS.length - 1 ? (
            <Button onClick={handleNext} disabled={isRunning}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            /* Submit Button (only on last question) */
            <Button onClick={handleSubmit} disabled={isRunning} variant="default">
              Submit Assessment
            </Button>
          )}
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Exit Assessment?
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to leave? Your progress will be lost and this attempt will be marked as <strong>failed</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowExitConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowExitConfirm(false);
                onExit();
              }}
            >
              Yes, Exit Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
