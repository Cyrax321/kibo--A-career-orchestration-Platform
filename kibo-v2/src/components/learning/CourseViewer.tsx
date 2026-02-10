import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, GraduationCap, Menu, Play, Terminal, RotateCcw, Award, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { CourseData } from "@/data/pythonCourse";
import Editor from "@monaco-editor/react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { playSound } from "@/lib/sounds";

// Pyodide Type Definition (Simplified)
declare global {
    interface Window {
        loadPyodide: (config: { indexURL: string }) => Promise<any>;
        pyodide: any;
    }
}

interface CourseViewerProps {
    course: CourseData;
}

const MarkdownRenderer = ({ content }: { content: string }) => {
    const parts = content.split(/(\`\`\`python[\s\S]*?\`\`\`)/g);

    const renderInline = (text: string) => {
        // Split by **bold** first, then map to handle `code` inside non-bold parts (or vice versa, but usually they don't nest in this simple parser)
        // Actually, simple regex split for both:
        const segments = text.split(/(\*\*.*?\*\*|\`.*?\`)/g);
        return segments.map((segment, i) => {
            if (segment.startsWith("**") && segment.endsWith("**")) {
                return <strong key={i} className="font-bold text-foreground">{segment.slice(2, -2)}</strong>;
            }
            if (segment.startsWith("`") && segment.endsWith("`")) {
                return <code key={i} className="bg-muted px-1.5 py-0.5 rounded text-primary font-mono text-sm border border-primary/10">{segment.slice(1, -1)}</code>;
            }
            return segment;
        });
    };

    return (
        <div className="space-y-4 text-foreground/90 leading-relaxed">
            {parts.map((part, index) => {
                if (part.startsWith('```python')) {
                    const code = part.replace(/^```python\n/, "").replace(/\n```$/, "");
                    return (
                        <div key={index} className="my-6 rounded-lg border border-primary/20 bg-muted/30 overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-primary/10 bg-primary/5">
                                <span className="text-xs font-bold text-primary tracking-wider uppercase">Example</span>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <pre className="text-sm font-mono text-foreground font-medium">
                                    {code}
                                </pre>
                            </div>
                        </div>
                    );
                }

                const lines = part.split("\n");
                return (
                    <div key={index} className="space-y-3">
                        {lines.map((line, i) => {
                            if (line.startsWith("# ")) {
                                return (
                                    <div key={i} className="mb-6 mt-10 pb-2 border-b border-border">
                                        <h1 className="text-4xl font-black tracking-tight text-primary">{line.replace("# ", "")}</h1>
                                    </div>
                                );
                            }
                            if (line.startsWith("### ")) {
                                return <h3 key={i} className="text-xl font-bold tracking-tight mb-2 mt-8 text-foreground">{line.replace("### ", "")}</h3>;
                            }
                            if (line.trim().startsWith("* ")) {
                                return (
                                    <div key={i} className="flex items-start gap-3 ml-2 group">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0 group-hover:scale-125 transition-transform" />
                                        <span className="group-hover:text-primary/90 transition-colors leading-relaxed">
                                            {renderInline(line.replace("* ", ""))}
                                        </span>
                                    </div>
                                );
                            }
                            if (line.trim() === "") return <div key={i} className="h-0" />;

                            return (
                                <p key={i} className="text-muted-foreground leading-7">
                                    {renderInline(line)}
                                </p>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

import { useGamification } from "@/hooks/useGamification";
import { getCourseProgress, saveCourseProgress } from "@/lib/course-progress";
import { supabase } from "@/integrations/supabase/client";

export const CourseViewer: React.FC<CourseViewerProps> = ({ course }) => {
    // --- STATE ---
    const [currentLessonId, setCurrentLessonId] = React.useState(course.lessons[0].id);
    const [completedLessons, setCompletedLessons] = React.useState<string[]>(() => {
        const saved = localStorage.getItem("kibo_completed_lessons");
        return saved ? JSON.parse(saved) : [];
    });

    // Global Gamification Hook
    const { awardXP, userStats } = useGamification();

    // Premium State (Mock)
    const [isPremium, setIsPremium] = React.useState(false);

    const [unlockedHints, setUnlockedHints] = React.useState<Record<string, number>>(() => {
        const saved = localStorage.getItem("kibo_unlocked_hints");
        return saved ? JSON.parse(saved) : {};
    });

    const [userId, setUserId] = React.useState<string | null>(null);

    // Fetch User ID
    React.useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null);
        });
    }, []);

    // Sync from Supabase on Load
    React.useEffect(() => {
        if (!userId) return;

        const loadProgress = async () => {
            const data = await getCourseProgress(userId, course.id);
            if (data) {
                // Merge or overwrite? Let's overwrite local with server if server has data
                // But if local has MORE progress, maybe we should sync up?
                // For simplicity, let's assume server is truth source if it exists.
                // Or better: union of local and server for completed lessons?

                // Let's just trust valid server data.
                if (data.completed_lessons && data.completed_lessons.length > 0) {
                    setCompletedLessons(prev => {
                        const merged = Array.from(new Set([...prev, ...data.completed_lessons]));
                        return merged;
                    });
                }

                if (data.unlocked_hints) {
                    setUnlockedHints(prev => ({ ...prev, ...data.unlocked_hints }));
                }
            }
        };
        loadProgress();
    }, [userId, course.id]);

    const [output, setOutput] = React.useState<string[]>([]);
    const [isRunning, setIsRunning] = React.useState(false);
    const [isPyodideLoading, setIsPyodideLoading] = React.useState(true);
    const [pyodideError, setPyodideError] = React.useState<string | null>(null);

    const currentLessonIndex = course.lessons.findIndex(l => l.id === currentLessonId);
    const currentLesson = course.lessons[currentLessonIndex];

    // Independent editor states
    const [exampleCode, setExampleCode] = React.useState(currentLesson.exampleCode || "");
    const [examCode, setExamCode] = React.useState("");

    // Exam State
    const [isExamMode, setIsExamMode] = React.useState(false);
    const [examStatus, setExamStatus] = React.useState<"idle" | "correct" | "incorrect">("idle");
    const [showConfetti, setShowConfetti] = React.useState(false);

    // Calculate Course Specific XP
    const courseXP = completedLessons.length * 10;

    // --- EFFECTS ---

    // Anti-Cheating: Disable Copy/Paste/Context Menu
    React.useEffect(() => {
        if (!isExamMode) return;

        const handlePrevent = (e: Event) => {
            e.preventDefault();
            toast.error("Action disabled in Exam Mode!");
        };

        const preventKeys = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'p', 's'].includes(e.key.toLowerCase())) {
                e.preventDefault();
                toast.error("Shortcuts disabled in Exam Mode!");
            }
        };

        document.addEventListener('copy', handlePrevent);
        document.addEventListener('cut', handlePrevent);
        document.addEventListener('paste', handlePrevent);
        document.addEventListener('contextmenu', handlePrevent);
        document.addEventListener('keydown', preventKeys);

        return () => {
            document.removeEventListener('copy', handlePrevent);
            document.removeEventListener('cut', handlePrevent);
            document.removeEventListener('paste', handlePrevent);
            document.removeEventListener('contextmenu', handlePrevent);
            document.removeEventListener('keydown', preventKeys);
        };
    }, [isExamMode]);

    // Persistence for local progress only
    React.useEffect(() => {
        localStorage.setItem("kibo_completed_lessons", JSON.stringify(completedLessons));
        if (userId) {
            saveCourseProgress(userId, course.id, completedLessons, unlockedHints);
        }
    }, [completedLessons, userId, course.id]);

    React.useEffect(() => {
        localStorage.setItem("kibo_unlocked_hints", JSON.stringify(unlockedHints));
        if (userId) {
            saveCourseProgress(userId, course.id, completedLessons, unlockedHints);
        }
    }, [unlockedHints, userId, course.id]);

    // Reset state on lesson change
    React.useEffect(() => {
        setExampleCode(currentLesson.exampleCode || "");
        // Pre-fill exam code with placeholder if available
        setExamCode(currentLesson.exercise?.placeholder || "");
        setExamStatus("idle");
        setOutput([]);
        setIsExamMode(false);
    }, [currentLessonId, currentLesson]);

    // Load Pyodide (Existing logic)
    React.useEffect(() => {
        const loadScript = async () => {
            if (window.pyodide) {
                setIsPyodideLoading(false);
                return;
            }
            try {
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
                script.onload = async () => {
                    try {
                        window.pyodide = await window.loadPyodide({
                            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
                        });
                        setIsPyodideLoading(false);
                    } catch (e) {
                        console.error("Pyodide Init Error:", e);
                        setPyodideError("Failed to initialize Python engine.");
                        setIsPyodideLoading(false);
                    }
                };
                document.body.appendChild(script);
            } catch (e) {
                console.error("Script Load Error:", e);
                setIsPyodideLoading(false);
            }
        };
        loadScript();
    }, []);

    // --- HANDLERS ---

    const runPythonCode = async (codeToRun: string) => {
        if (!window.pyodide) return;
        setIsRunning(true);
        setOutput([]);

        try {
            window.pyodide.setStdout({ batched: (msg: string) => setOutput(prev => [...prev, msg]) });
            await window.pyodide.runPythonAsync(codeToRun);
        } catch (error: any) {
            setOutput(prev => [...prev, `Error: ${error.message}`]);
        } finally {
            setIsRunning(false);
        }
    };

    const handleLessonChange = (lessonId: string) => {
        // Logic to prevent jumping to locked lessons
        const targetIndex = course.lessons.findIndex(l => l.id === lessonId);
        const prevLessonId = course.lessons[targetIndex - 1]?.id;

        // Allow if it's the first lesson OR previous lesson is completed OR lesson is already completed
        if (targetIndex === 0 || completedLessons.includes(prevLessonId) || completedLessons.includes(lessonId)) {
            setCurrentLessonId(lessonId);
            window.scrollTo(0, 0);
        } else {
            toast.error("Complete the previous module to unlock this one!");
        }
    };

    const handleNext = () => {
        if (currentLessonIndex < course.lessons.length - 1) {
            handleLessonChange(course.lessons[currentLessonIndex + 1].id);
        }
    };

    const handlePrev = () => {
        if (currentLessonIndex > 0) {
            handleLessonChange(course.lessons[currentLessonIndex - 1].id);
        }
    };

    const checkExamAnswer = () => {
        if (!currentLesson.exercise) return;

        // Simple validation: Check if solution string exists in the code
        // OR if the code matches the solution exactly (trimmed)
        // This assumes the user replaces "___" with the answer.

        const userAnswer = examCode.trim();
        const solution = currentLesson.exercise.solution.trim();

        // Loose check: does the user code contain the solution keyword?
        // And ensure the placeholder "___" is gone.
        const isCorrect = userAnswer.includes(solution) && !userAnswer.includes("___");

        if (isCorrect) {
            setExamStatus("correct");
            toast.success("Correct! +10 XP");

            if (!completedLessons.includes(currentLessonId)) {
                setCompletedLessons(prev => [...prev, currentLessonId]);
                playSound("offer");
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ["#8b5cf6", "#10b981", "#f97316"],
                });
                awardXP("Module Completed", 10);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            }
        } else {
            setExamStatus("incorrect");
            toast.error("Incorrect. Try again!");
        }
    };

    const unlockHint = () => {
        const hintsUnlocked = unlockedHints[currentLessonId] || 0;
        const totalHints = currentLesson.exercise?.hints?.length || 0;

        if (hintsUnlocked >= totalHints) return;

        if (isPremium) {
            setUnlockedHints(prev => ({
                ...prev,
                [currentLessonId]: hintsUnlocked + 1
            }));
            toast.success("Hint Unlocked!");
        } else {
            toast.error("Unlock Premium to access hints!", {
                action: {
                    label: "Upgrade",
                    onClick: () => {
                        toast.success("Upgraded to Premium! (Mock)");
                        setIsPremium(true);
                    }
                }
            });
        }
    };

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-card/30 backdrop-blur-sm border-r border-border/50">
            <div className="p-6 border-b border-border/50 bg-background/50">
                <h2 className="font-bold flex items-center gap-3 text-lg tracking-tight">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {course.title}
                    </span>
                </h2>
                <div className="mt-4 flex items-center justify-between text-xs font-medium text-muted-foreground bg-muted/50 p-2 rounded-md">
                    <span>XP: <span className="text-primary">{courseXP}</span></span>
                    <span>Progress: {Math.round((completedLessons.length / course.lessons.length) * 100)}%</span>
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-3 space-y-1">
                    {course.lessons.map((lesson, index) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        const isLocked = index > 0 && !completedLessons.includes(course.lessons[index - 1].id);
                        const isActive = currentLessonId === lesson.id;

                        return (
                            <Button
                                key={lesson.id}
                                variant="ghost"
                                disabled={isLocked && !isCompleted} // Allow strictly navigation if completed, but 'Locked' logic usually prevents jump-ahead
                                className={cn(
                                    "w-full justify-start font-medium text-sm h-auto py-2.5 px-3 transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 scale-[1.02]"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                                )}
                                onClick={() => handleLessonChange(lesson.id)}
                            >
                                <div className="flex items-center w-full">
                                    <span className={cn(
                                        "mr-3 h-5 w-5 flex items-center justify-center text-[10px] border rounded transition-colors shrink-0",
                                        isActive ? "border-primary-foreground/30 bg-primary-foreground/10" : "border-border",
                                        isCompleted && "bg-green-500/20 text-green-500 border-green-500/50"
                                    )}>
                                        {isCompleted ? "✓" : index + 1}
                                    </span>
                                    <span className="truncate flex-1 text-left">{lesson.title.replace(/Module \d+: /, "")}</span>
                                    {isLocked && <div className="ml-2 text-xs opacity-70">🔒</div>}
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <div className="h-[calc(100vh-4rem)] bg-background relative">
            {/* Confetti / Celebration Overlay could go here */}

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center p-4 border-b bg-background/95 backdrop-blur z-20 sticky top-0">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="mr-2">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-80 border-r border-border/50">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
                <div className="flex flex-col">
                    <h1 className="font-semibold truncate pr-4 text-sm">{currentLesson.title}</h1>
                    <span className="text-xs text-muted-foreground">XP: {courseXP}</span>
                </div>
            </div>

            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize={20}
                    minSize={18}
                    maxSize={25}
                    className="hidden lg:block border-r border-border/50 bg-muted/10"
                >
                    <SidebarContent />
                </ResizablePanel>

                <ResizableHandle className="hidden lg:flex bg-border/50 hover:bg-primary/50 transition-colors w-[1px]" />

                <ResizablePanel defaultSize={80}>
                    <ScrollArea className="h-full">
                        <div className="max-w-5xl mx-auto p-6 md:p-10 pb-20">

                            {/* Breadcrumb */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 w-fit px-3 py-1 rounded-full border border-border/50">
                                    <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setCurrentLessonId(course.lessons[0].id)}>Course</span>
                                    <ChevronRight className="h-3 w-3" />
                                    <span className="text-foreground font-medium">{currentLesson.title}</span>
                                </div>

                                {completedLessons.includes(currentLessonId) && (
                                    <span className="text-sm font-medium text-green-500 flex items-center gap-1 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                        <Award className="h-4 w-4" /> Completed
                                    </span>
                                )}
                            </div>

                            {/* Lesson Content */}
                            <div className="prose prose-neutral dark:prose-invert max-w-none relative">
                                <MarkdownRenderer content={currentLesson.content} />
                            </div>

                            {/* Tabs for Runner vs Exam */}
                            <div className="mt-12 space-y-4">
                                <div className="flex items-center gap-4 border-b border-border pb-2">
                                    <button
                                        onClick={() => setIsExamMode(false)}
                                        className={cn("pb-2 text-sm font-medium transition-colors", !isExamMode ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        Example Runner
                                    </button>
                                    <button
                                        onClick={() => setIsExamMode(true)}
                                        disabled={!currentLesson.exercise}
                                        className={cn("pb-2 text-sm font-medium transition-colors", isExamMode ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        Exam & Exercise {completedLessons.includes(currentLessonId) && "✓"}
                                    </button>
                                </div>

                                {!isExamMode ? (
                                    /* --- RUNNER MODE --- */
                                    <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden ring-1 ring-border/50">
                                        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
                                            <h3 className="text-base font-bold flex items-center gap-2">
                                                <Terminal className="h-4 w-4 text-primary" />
                                                Kibo Runner
                                            </h3>
                                            <Button
                                                size="sm"
                                                variant="default"
                                                className="bg-green-600 hover:bg-green-700 text-white gap-2 h-8 font-semibold shadow-sm"
                                                onClick={() => runPythonCode(exampleCode)}
                                                disabled={isRunning || isPyodideLoading || !!pyodideError}
                                            >
                                                {isRunning ? <span className="animate-spin">⏳</span> : <Play className="h-3.5 w-3.5 fill-current" />}
                                                Run Code
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 h-[400px] divide-y md:divide-y-0 md:divide-x divide-border">
                                            <div className="flex flex-col bg-[#1e1e1e]">
                                                <Editor
                                                    height="100%"
                                                    language="python"
                                                    value={exampleCode}
                                                    onChange={(val) => setExampleCode(val || "")}
                                                    theme="vs-dark"
                                                    options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: "on", padding: { top: 16 } }}
                                                />
                                            </div>
                                            <div className="flex flex-col bg-black text-green-500 font-mono text-sm p-4 overflow-y-auto">
                                                <div className="mb-2 text-xs text-green-700 border-b border-green-900/30 pb-2">kibo-terminal ~$ python3 main.py</div>
                                                {output.map((line, i) => <div key={i}><span className="text-green-700 mr-2">&gt;</span>{line}</div>)}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* --- EXAM MODE --- */
                                    <div className="grid gap-6">
                                        <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden ring-1 ring-border/50">
                                            <div className="p-6 border-b border-border bg-muted/20">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                                        <Target className="h-5 w-5 text-primary" />
                                                        Module Exam
                                                    </h3>
                                                    <div className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                                                        XP Prize: 10
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground">{currentLesson.exercise?.question}</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 h-[400px] divide-y md:divide-y-0 md:divide-x divide-border">
                                                <div className="flex flex-col bg-[#1e1e1e] relative">
                                                    <Editor
                                                        height="100%"
                                                        language="python"
                                                        value={examCode}
                                                        onChange={(val) => setExamCode(val || "")}
                                                        theme="vs-dark"
                                                        options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: "on", padding: { top: 16 } }}
                                                    />
                                                    {/* Status Overlay */}
                                                    {examStatus !== "idle" && (
                                                        <div className={cn(
                                                            "absolute bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-bold shadow-lg animate-in fade-in slide-in-from-bottom-2",
                                                            examStatus === "correct" ? "bg-green-500 text-white" : "bg-destructive text-white"
                                                        )}>
                                                            {examStatus === "correct" ? "Correct! Lesson Completed." : "Incorrect. Check your syntax."}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col bg-black text-green-500 font-mono text-sm p-4 overflow-y-auto">
                                                    <div className="mb-2 text-xs text-green-700 border-b border-green-900/30 pb-2">kibo-exam ~$ python3 check.py</div>
                                                    {output.length > 0 && output.map((line, i) => <div key={i}><span className="text-green-700 mr-2">&gt;</span>{line}</div>)}
                                                </div>
                                            </div>
                                            <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => runPythonCode(examCode)}
                                                >
                                                    Test Logic
                                                </Button>
                                                <Button
                                                    onClick={checkExamAnswer}
                                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                                    disabled={examStatus === "correct"}
                                                >
                                                    Submit Answer
                                                </Button>
                                            </div>
                                        </div>

                                        {/* --- HINT SYSTEM --- */}
                                        {currentLesson.exercise?.hints && currentLesson.exercise.hints.length > 0 && (
                                            <div className="rounded-xl border border-border bg-card shadow-sm p-6">
                                                <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                                                    <span className="bg-yellow-500/10 text-yellow-600 p-1 rounded">💡</span>
                                                    Need a Hint?
                                                </h3>
                                                <div className="space-y-3">
                                                    {currentLesson.exercise.hints.map((hint, idx) => {
                                                        const isUnlocked = (unlockedHints[currentLessonId] || 0) > idx;
                                                        const isNextToUnlock = (unlockedHints[currentLessonId] || 0) === idx;
                                                        const cost = 50 * (idx + 1);

                                                        return (
                                                            <div key={idx} className={cn(
                                                                "p-3 rounded-lg border text-sm transition-all",
                                                                isUnlocked
                                                                    ? "bg-yellow-50/50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-100"
                                                                    : "bg-muted/50 border-transparent text-muted-foreground flex items-center justify-between"
                                                            )}>
                                                                {isUnlocked ? (
                                                                    <span>{hint}</span>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Hint {idx + 1}</span>
                                                                            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                                                                            <span className="italic">Locked</span>
                                                                        </div>
                                                                        {isNextToUnlock && (
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="h-7 text-xs gap-1 hover:bg-yellow-500/10 hover:text-yellow-600 hover:border-yellow-500/50"
                                                                                onClick={unlockHint}
                                                                            >
                                                                                Unlock for <span className="font-bold">{cost} XP</span>
                                                                            </Button>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Navigation Footer */}
                            <div className="flex items-center justify-between mt-16 pt-8 border-t border-border">
                                <Button
                                    variant="outline" size="lg" onClick={handlePrev} disabled={currentLessonIndex === 0}
                                    className="gap-2 pl-3"
                                >
                                    <ChevronLeft className="h-5 w-5" /> Previous Module
                                </Button>

                                <Button
                                    size="lg" onClick={handleNext}
                                    disabled={currentLessonIndex === course.lessons.length - 1 || !completedLessons.includes(currentLessonId)}
                                    className={cn("gap-2 pr-3", !completedLessons.includes(currentLessonId) ? "opacity-50 cursor-not-allowed" : "bg-primary hover:bg-primary/90")}
                                >
                                    {completedLessons.includes(currentLessonId) ? "Next Module" : "Complete Exam to Unlock"} <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </ScrollArea>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};
