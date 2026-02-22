import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Clock,
    AlertTriangle,
    Eye,
    EyeOff,
    Send,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Code2,
    Bug,
    ShieldAlert,
    CheckCircle2,
    Circle,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCertifications } from "@/hooks/useCertifications";
import type {
    ExamAnswer,
    MCQQuestion,
    CodingQuestion,
    DebuggingQuestion,
} from "@/components/certifications/types";
import type { ExamQuestionSet } from "@/data/certQuestionBank";
import { playSound } from "@/lib/sounds";

// ─── Section type definition ────────────────────────────────────────────────

type SectionKey = "mcq" | "coding" | "debugging";

interface SectionDef {
    key: SectionKey;
    label: string;
    icon: React.ReactNode;
    questionCount: number;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ExamEngine() {
    const { certId } = useParams<{ certId: string }>();
    const navigate = useNavigate();
    const {
        getCertification,
        startExam,
        saveAnswers,
        loadAnswers,
        recordTabSwitch,
        submitExam,
    } = useCertifications();

    const cert = getCertification(certId || "");

    // ── State ──
    const [showIntro, setShowIntro] = React.useState(true);
    const [showSubmitConfirm, setShowSubmitConfirm] = React.useState(false);
    const [showExitConfirm, setShowExitConfirm] = React.useState(false);
    const [examStarted, setExamStarted] = React.useState(false);
    const [questions, setQuestions] = React.useState<ExamQuestionSet | null>(null);
    const [attemptId, setAttemptId] = React.useState<string>("");
    const [expiresAt, setExpiresAt] = React.useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = React.useState(0);
    const [tabSwitchCount, setTabSwitchCount] = React.useState(0);
    const [currentSection, setCurrentSection] = React.useState<SectionKey>("mcq");
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const [answers, setAnswers] = React.useState<Map<string, ExamAnswer>>(new Map());
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const startTimeRef = React.useRef<number>(Date.now());

    // ── Derived data ──
    const sections: SectionDef[] = React.useMemo(() => {
        if (!questions) return [];
        return [
            {
                key: "mcq" as SectionKey,
                label: "MCQs",
                icon: <BookOpen className="h-4 w-4" />,
                questionCount: questions.mcqs.length,
            },
            {
                key: "coding" as SectionKey,
                label: "Coding",
                icon: <Code2 className="h-4 w-4" />,
                questionCount: questions.coding.length,
            },
            {
                key: "debugging" as SectionKey,
                label: "Debugging",
                icon: <Bug className="h-4 w-4" />,
                questionCount: questions.debugging.length,
            },
        ];
    }, [questions]);

    // ── Start exam ──
    const handleStartExam = React.useCallback(() => {
        if (!certId) return;
        const result = startExam(certId);
        if (!result) return;

        setQuestions(result.questions);
        setAttemptId(result.attempt.id);
        setExpiresAt(new Date(result.attempt.expires_at));
        setTabSwitchCount(result.attempt.tab_switch_count);
        startTimeRef.current = Date.now();

        // Load any saved answers
        const saved = loadAnswers(result.attempt.id);
        if (saved.length > 0) {
            setAnswers(new Map(saved.map((a) => [a.question_id, a])));
        }

        setShowIntro(false);
        setExamStarted(true);
        playSound("applicationAdded");
    }, [certId, startExam, loadAnswers]);

    // ── Timer ──
    React.useEffect(() => {
        if (!expiresAt || !examStarted) return;

        const interval = setInterval(() => {
            const remaining = Math.max(
                0,
                Math.floor((expiresAt.getTime() - Date.now()) / 1000)
            );
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                handleSubmit(true);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, examStarted]);

    // ── Tab switch detection ──
    React.useEffect(() => {
        if (!examStarted || !certId) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                const newCount = recordTabSwitch(certId);
                setTabSwitchCount(newCount);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () =>
            document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [examStarted, certId, recordTabSwitch]);

    // ── Beforeunload warning ──
    React.useEffect(() => {
        if (!examStarted) return;

        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [examStarted]);

    // ── Disable right-click ──
    React.useEffect(() => {
        if (!examStarted) return;

        const handler = (e: MouseEvent) => {
            e.preventDefault();
        };

        document.addEventListener("contextmenu", handler);
        return () => document.removeEventListener("contextmenu", handler);
    }, [examStarted]);

    // ── Disable copy / cut / paste ──
    React.useEffect(() => {
        if (!examStarted) return;

        const blockClipboard = (e: ClipboardEvent) => {
            e.preventDefault();
        };

        const blockShortcuts = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && ["c", "v", "x", "a"].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        };

        document.addEventListener("copy", blockClipboard);
        document.addEventListener("cut", blockClipboard);
        document.addEventListener("paste", blockClipboard);
        document.addEventListener("keydown", blockShortcuts);

        return () => {
            document.removeEventListener("copy", blockClipboard);
            document.removeEventListener("cut", blockClipboard);
            document.removeEventListener("paste", blockClipboard);
            document.removeEventListener("keydown", blockShortcuts);
        };
    }, [examStarted]);

    // ── Auto-save ──
    React.useEffect(() => {
        if (!examStarted || !attemptId) return;

        const timeout = setTimeout(() => {
            saveAnswers(attemptId, Array.from(answers.values()));
        }, 2000);

        return () => clearTimeout(timeout);
    }, [answers, attemptId, examStarted, saveAnswers]);

    // ── Answer handlers ──
    const updateAnswer = React.useCallback(
        (questionId: string, partial: Partial<ExamAnswer>) => {
            setAnswers((prev) => {
                const next = new Map(prev);
                const existing = next.get(questionId) || {
                    question_id: questionId,
                    type: partial.type || "mcq",
                };
                next.set(questionId, { ...existing, ...partial });
                return next;
            });
            // Subtle click sound for answering (only if not typing code)
            if (partial.code === undefined) {
                playSound("like", { volume: 0.3 });
            }
        },
        []
    );

    // ── Submit ──
    const handleSubmit = React.useCallback(
        (autoSubmit = false) => {
            if (!certId || !attemptId || isSubmitting) return;
            setIsSubmitting(true);

            const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
            const result = submitExam(
                certId,
                attemptId,
                Array.from(answers.values()),
                timeTaken,
                tabSwitchCount
            );

            if (result) {
                playSound("success");
                navigate(`/certifications/${certId}/result/${attemptId}`, {
                    state: { result },
                });
            }
        },
        [certId, attemptId, answers, tabSwitchCount, submitExam, navigate, isSubmitting]
    );

    // ── Format time ──
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // ── Get current questions for section ──
    const getCurrentQuestions = (): any[] => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!questions) return [];
        switch (currentSection) {
            case "mcq":
                return questions.mcqs;
            case "coding":
                return questions.coding;
            case "debugging":
                return questions.debugging;
        }
    };

    const currentQuestions = getCurrentQuestions();
    const currentQ = currentQuestions[currentQuestionIndex];

    // ── Render ──
    if (!cert) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Certification not found.</p>
            </div>
        );
    }

    // ── Intro Dialog ──
    if (showIntro) {
        const totalQuestionCount = cert.format.sections.reduce((s, sec) => s + sec.count, 0);

        return (
            <div className="flex h-screen items-center justify-center bg-background p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className={cn(
                            "flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-3xl mb-4 shadow-lg overflow-hidden relative",
                            cert.image ? "p-0" : ""
                        )}>
                            {cert.image ? (
                                <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                            ) : (
                                cert.icon || "📜"
                            )}
                        </div>
                        <h2 className="text-xl font-bold">{cert.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{cert.code} • {cert.level.charAt(0).toUpperCase() + cert.level.slice(1)} Level</p>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="rounded-xl bg-muted/30 border border-border/50 p-3 text-center">
                            <Clock className="h-4 w-4 mx-auto text-amber-500 mb-1" />
                            <div className="text-lg font-bold">{cert.duration_minutes}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Minutes</div>
                        </div>
                        <div className="rounded-xl bg-muted/30 border border-border/50 p-3 text-center">
                            <BookOpen className="h-4 w-4 mx-auto text-amber-500 mb-1" />
                            <div className="text-lg font-bold">{totalQuestionCount}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Questions</div>
                        </div>
                        <div className="rounded-xl bg-muted/30 border border-border/50 p-3 text-center">
                            <ShieldAlert className="h-4 w-4 mx-auto text-amber-500 mb-1" />
                            <div className="text-lg font-bold">{cert.passing_score}%</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">To Pass</div>
                        </div>
                    </div>

                    {/* Exam Format Breakdown */}
                    <div className="rounded-xl bg-muted/30 border border-border/50 p-4 mb-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                            <BookOpen className="h-3.5 w-3.5" />
                            Exam Format
                        </h4>
                        <div className="space-y-2.5">
                            {cert.format.sections.map((section, i) => (
                                <div key={i} className="flex items-center justify-between rounded-lg bg-background/50 border border-border/30 px-3 py-2.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-500">
                                            {section.type === "mcq" ? <BookOpen className="h-3.5 w-3.5" /> : section.type === "coding" ? <Code2 className="h-3.5 w-3.5" /> : <Bug className="h-3.5 w-3.5" />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold">{section.label}</div>
                                            <div className="text-[10px] text-muted-foreground">{section.description}</div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-3">
                                        <div className="text-sm font-bold">{section.count} {section.count === 1 ? 'Q' : "Q's"}</div>
                                        <div className="text-[10px] text-muted-foreground">{section.marks} marks</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Anti-Cheat & Security Warnings */}
                    <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4 mb-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Anti-Cheat & Proctoring
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-2">
                            <li className="flex items-start gap-2">
                                <EyeOff className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                                <span><strong className="text-foreground">Tab Switch Detection:</strong> Every time you leave this tab, it is recorded. Excessive tab switches may flag your exam for review.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Eye className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                                <span><strong className="text-foreground">Right-Click Disabled:</strong> Context menus are disabled during the exam to prevent copy-paste.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                                <span><strong className="text-foreground">Navigation Locked:</strong> Closing or refreshing the browser will trigger a warning. Your progress is auto-saved.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ShieldAlert className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                                <span><strong className="text-foreground">Plagiarism Detection:</strong> Submissions are checked against known solutions and other candidates.</span>
                            </li>
                        </ul>
                    </div>

                    {/* All Exam Rules */}
                    <div className="rounded-xl bg-muted/30 border border-border/50 p-4 mb-6">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Exam Rules
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1.5">
                            {cert.rules.map((rule, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-amber-500 mt-0.5">
                                        <CheckCircle2 className="h-3 w-3" />
                                    </span>
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Agreement & Actions */}
                    <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 mb-5">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            By clicking <strong className="text-foreground">"I Agree & Start Exam"</strong>, you confirm that you have read and understood all rules above. You agree that your actions during this exam — including tab switches, time spent, and submitted code — will be monitored and recorded. The timer will begin immediately.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/certifications")}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStartExam}
                            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20"
                        >
                            I Agree & Start Exam
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ── Exam Interface ──
    return (
        <div className="flex h-screen flex-col bg-background select-none">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur-xl px-4 py-2.5 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-bold">{cert.code}</h2>
                    <div className="flex gap-1">
                        {sections.map((s) => (
                            <button
                                key={s.key}
                                onClick={() => {
                                    setCurrentSection(s.key);
                                    setCurrentQuestionIndex(0);
                                    playSound("messageSent", { volume: 0.2 });
                                }}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                                    currentSection === s.key
                                        ? "bg-amber-500/15 text-amber-500"
                                        : "text-muted-foreground hover:bg-muted/50"
                                )}
                            >
                                {s.icon}
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Tab switch indicator */}
                    {tabSwitchCount > 0 && (
                        <Badge
                            variant="outline"
                            className="text-[10px] bg-red-500/15 text-red-400 border-red-500/30 gap-1"
                        >
                            <EyeOff className="h-3 w-3" />
                            {tabSwitchCount} tab switch{tabSwitchCount > 1 ? "es" : ""}
                        </Badge>
                    )}

                    {/* Timer */}
                    <div
                        className={cn(
                            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-mono font-bold",
                            timeLeft <= 60
                                ? "bg-red-500/15 text-red-400 animate-pulse"
                                : timeLeft <= 300
                                    ? "bg-amber-500/15 text-amber-400"
                                    : "bg-muted/50 text-foreground"
                        )}
                    >
                        <Clock className="h-4 w-4" />
                        {formatTime(timeLeft)}
                    </div>

                    {/* Submit */}
                    <Button
                        size="sm"
                        onClick={() => setShowSubmitConfirm(true)}
                        className="gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs"
                    >
                        <Send className="h-3.5 w-3.5" />
                        Submit
                    </Button>
                </div>
            </div>

            {/* Question Navigator (sidebar dots) */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left sidebar - question nav */}
                <div className="w-14 border-r border-border/50 bg-muted/20 flex flex-col items-center py-3 gap-2 overflow-y-auto shrink-0">
                    {currentQuestions.map((q: any, idx: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                        const answered = answers.has(q.id);
                        return (
                            <button
                                key={q.id}
                                onClick={() => {
                                    setCurrentQuestionIndex(idx);
                                    playSound("messageSent", { volume: 0.1 });
                                }}
                                className={cn(
                                    "w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all",
                                    idx === currentQuestionIndex
                                        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                                        : answered
                                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                )}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>

                {/* Main content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {currentSection === "mcq" && currentQ && (
                        <MCQRenderer
                            question={currentQ as MCQQuestion}
                            answer={answers.get(currentQ.id)}
                            questionIndex={currentQuestionIndex}
                            totalQuestions={currentQuestions.length}
                            onAnswer={(selectedOption) =>
                                updateAnswer(currentQ.id, {
                                    type: "mcq",
                                    selected_option: selectedOption,
                                })
                            }
                        />
                    )}
                    {currentSection === "coding" && currentQ && (
                        <CodingRenderer
                            question={currentQ as CodingQuestion}
                            answer={answers.get(currentQ.id)}
                            onAnswer={(code) =>
                                updateAnswer(currentQ.id, {
                                    type: "coding",
                                    code,
                                    language: "python",
                                })
                            }
                        />
                    )}
                    {currentSection === "debugging" && currentQ && (
                        <DebuggingRenderer
                            question={currentQ as DebuggingQuestion}
                            answer={answers.get(currentQ.id)}
                            onAnswer={(code) =>
                                updateAnswer(currentQ.id, { type: "debugging", code })
                            }
                        />
                    )}
                </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between border-t border-border/50 bg-card/80 backdrop-blur-xl px-6 py-3 shrink-0">
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentQuestionIndex === 0 && currentSection === "mcq"}
                    onClick={() => {
                        if (currentQuestionIndex > 0) {
                            setCurrentQuestionIndex((i) => i - 1);
                            playSound("messageSent", { volume: 0.2 });
                        } else {
                            // Go to previous section
                            const sectionIdx = sections.findIndex(
                                (s) => s.key === currentSection
                            );
                            if (sectionIdx > 0) {
                                const prevSection = sections[sectionIdx - 1];
                                setCurrentSection(prevSection.key);
                                setCurrentQuestionIndex(prevSection.questionCount - 1);
                            }
                        }
                    }}
                    className="gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                <span className="text-xs text-muted-foreground">
                    {answers.size} / {(questions?.mcqs.length || 0) + (questions?.coding.length || 0) + (questions?.debugging.length || 0)} answered
                </span>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        if (currentQuestionIndex < currentQuestions.length - 1) {
                            setCurrentQuestionIndex((i) => i + 1);
                            playSound("messageSent", { volume: 0.2 });
                        } else {
                            // Go to next section
                            const sectionIdx = sections.findIndex(
                                (s) => s.key === currentSection
                            );
                            if (sectionIdx < sections.length - 1) {
                                setCurrentSection(sections[sectionIdx + 1].key);
                                setCurrentQuestionIndex(0);
                            }
                        }
                    }}
                    className="gap-1"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Submit Confirmation Dialog */}
            <Dialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Exam?</DialogTitle>
                        <DialogDescription>
                            You have answered{" "}
                            <strong>{answers.size}</strong> out of{" "}
                            <strong>
                                {(questions?.mcqs.length || 0) +
                                    (questions?.coding.length || 0) +
                                    (questions?.debugging.length || 0)}
                            </strong>{" "}
                            questions. Time remaining:{" "}
                            <strong>{formatTime(timeLeft)}</strong>.
                            <br />
                            <br />
                            Once submitted, you cannot return to this exam.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowSubmitConfirm(false)}
                        >
                            Continue Exam
                        </Button>
                        <Button
                            onClick={() => handleSubmit(false)}
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                        >
                            {isSubmitting ? "Submitting..." : "Confirm Submit"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}

// ─── MCQ Renderer ───────────────────────────────────────────────────────────

function MCQRenderer({
    question,
    answer,
    questionIndex,
    totalQuestions,
    onAnswer,
}: {
    question: MCQQuestion;
    answer?: ExamAnswer;
    questionIndex: number;
    totalQuestions: number;
    onAnswer: (selectedOption: number) => void;
}) {
    const isSelected = (idx: number) => answer?.selected_option === idx;

    return (
        <div className="h-full flex flex-col">
            {/* Question Panel - takes available space */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-[860px] mx-auto py-2">
                    {/* Question number bar */}
                    <div className="flex items-center justify-between mb-5">
                        <span className="text-xs font-medium text-muted-foreground">
                            Question {questionIndex + 1} of {totalQuestions}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">
                            {question.marks} marks
                        </span>
                    </div>

                    {/* Question text */}
                    <div className="mb-6">
                        <h3 className="text-[15px] font-semibold leading-relaxed mb-3">
                            {question.title}
                        </h3>
                        <p className="text-[13px] text-muted-foreground leading-[1.7] whitespace-pre-wrap">
                            {question.question_text}
                        </p>
                    </div>

                    {/* Code Snippet */}
                    {question.code_snippet && (
                        <div className="mb-8 rounded-lg overflow-hidden border border-border/40">
                            <div className="bg-[#252526] flex items-center px-4 py-2 border-b border-[#3c3c3c]">
                                <div className="flex gap-1.5 mr-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                                </div>
                                <span className="text-[11px] text-[#858585] font-mono">snippet.py</span>
                            </div>
                            <pre className="bg-[#1e1e1e] text-[#d4d4d4] px-5 py-4 text-[13px] overflow-x-auto font-mono leading-[1.65]">
                                {question.code_snippet}</pre>
                        </div>
                    )}

                    {/* Answer Options */}
                    <div className="space-y-2.5">
                        {question.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => onAnswer(idx)}
                                className={cn(
                                    "w-full text-left rounded-lg border px-4 py-3.5 transition-all duration-150 flex items-center gap-3.5 group",
                                    isSelected(idx)
                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                        : "border-border/60 hover:border-primary/30 hover:bg-muted/30"
                                )}
                            >
                                {/* Radio indicator */}
                                <div
                                    className={cn(
                                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                                        isSelected(idx)
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground/30 group-hover:border-muted-foreground/50"
                                    )}
                                >
                                    {isSelected(idx) && (
                                        <div className="h-2 w-2 rounded-full bg-white" />
                                    )}
                                </div>

                                {/* Label */}
                                <span className="text-xs font-semibold text-muted-foreground w-5 shrink-0">
                                    {String.fromCharCode(65 + idx)}.
                                </span>

                                {/* Option text */}
                                <pre className="text-[13px] whitespace-pre-wrap font-mono flex-1 leading-relaxed">
                                    {option}</pre>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Coding Renderer ────────────────────────────────────────────────────────

function CodingRenderer({
    question,
    answer,
    onAnswer,
}: {
    question: CodingQuestion;
    answer?: ExamAnswer;
    onAnswer: (code: string) => void;
}) {
    const [code, setCode] = React.useState(
        answer?.code || question.starter_code
    );

    const handleCodeChange = React.useCallback(
        (value: string | undefined) => {
            const newCode = value || "";
            setCode(newCode);
            onAnswer(newCode);
        },
        [onAnswer]
    );

    return (
        <div className="flex gap-6 h-[calc(100vh-180px)]">
            {/* Problem Description */}
            <div className="w-1/2 overflow-y-auto pr-4">
                <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px]">
                        {question.marks} marks
                    </Badge>
                    <Badge
                        variant="outline"
                        className="text-[10px] bg-amber-500/15 text-amber-400 border-amber-500/30"
                    >
                        Python 3.x
                    </Badge>
                </div>
                <h3 className="text-lg font-bold mb-4">{question.title}</h3>

                <div className="prose prose-sm max-w-none dark:prose-invert text-sm">
                    {question.problem_statement.split("\n").map((line, i) => {
                        if (line.startsWith("### "))
                            return (
                                <h4 key={i} className="text-sm font-bold mt-4 mb-2">
                                    {line.slice(4)}
                                </h4>
                            );
                        if (line.startsWith("> "))
                            return (
                                <blockquote
                                    key={i}
                                    className="border-l-2 border-amber-500 pl-3 text-amber-300/80 text-xs"
                                >
                                    {line.slice(2)}
                                </blockquote>
                            );
                        if (line.startsWith("- "))
                            return (
                                <li key={i} className="text-xs text-muted-foreground">
                                    {line.slice(2)}
                                </li>
                            );
                        if (line.trim() === "") return <br key={i} />;
                        return (
                            <p key={i} className="text-muted-foreground text-xs mb-1">
                                {line}
                            </p>
                        );
                    })}
                </div>

                {/* Examples */}
                <div className="mt-6 space-y-4">
                    {question.examples.map((ex, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-border/50 bg-muted/20 p-4"
                        >
                            <h5 className="text-xs font-semibold mb-2">Example {i + 1}</h5>
                            <pre className="text-xs font-mono bg-[#1e1e1e] text-[#d4d4d4] rounded-lg p-3">
                                <span className="text-emerald-400">Input:</span>{" "}
                                {ex.input}
                                {"\n"}
                                <span className="text-amber-400">Output:</span>{" "}
                                {ex.output}
                            </pre>
                            {ex.explanation && (
                                <p className="text-[11px] text-muted-foreground mt-2">
                                    {ex.explanation}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Code Editor */}
            <div className="w-1/2 flex flex-col rounded-xl border border-border/50 overflow-hidden">
                <div className="flex items-center justify-between bg-[#1e1e1e] px-4 py-2 border-b border-border/30">
                    <span className="text-xs text-muted-foreground font-mono">
                        solution.py
                    </span>
                </div>
                <div className="flex-1">
                    <Editor
                        height="100%"
                        language="python"
                        theme="vs-dark"
                        value={code}
                        onChange={handleCodeChange}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            wordWrap: "on",
                            tabSize: 4,
                            padding: { top: 12 },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

// ─── Debugging Renderer ─────────────────────────────────────────────────────

function DebuggingRenderer({
    question,
    answer,
    onAnswer,
}: {
    question: DebuggingQuestion;
    answer?: ExamAnswer;
    onAnswer: (code: string) => void;
}) {
    const [fixedCode, setFixedCode] = React.useState(
        answer?.code || question.buggy_code
    );

    const handleCodeChange = React.useCallback(
        (value: string | undefined) => {
            const newCode = value || "";
            setFixedCode(newCode);
            onAnswer(newCode);
        },
        [onAnswer]
    );

    return (
        <div className="flex gap-6 h-[calc(100vh-180px)]">
            {/* Problem Description + Buggy Code (read-only) */}
            <div className="w-1/2 overflow-y-auto pr-4 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px]">
                        {question.marks} marks
                    </Badge>
                    <Badge
                        variant="outline"
                        className="text-[10px] bg-red-500/15 text-red-400 border-red-500/30"
                    >
                        Find & Fix Bugs
                    </Badge>
                </div>
                <h3 className="text-lg font-bold">{question.title}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {question.description}
                </p>

                {question.hints && question.hints.length > 0 && (
                    <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
                        <h4 className="text-xs font-semibold text-amber-500 mb-2">
                            💡 Hints
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                            {question.hints.map((hint, i) => (
                                <li key={i}>
                                    {i + 1}. {hint}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Original Buggy Code (Read Only)
                    </h4>
                    <pre className="rounded-xl bg-[#1e1e1e] text-[#d4d4d4] p-4 text-xs font-mono overflow-x-auto">
                        {question.buggy_code}
                    </pre>
                </div>
            </div>

            {/* Fix Editor */}
            <div className="w-1/2 flex flex-col rounded-xl border border-border/50 overflow-hidden">
                <div className="flex items-center justify-between bg-[#1e1e1e] px-4 py-2 border-b border-border/30">
                    <span className="text-xs text-muted-foreground font-mono">
                        fixed_solution.py
                    </span>
                    <Badge
                        variant="outline"
                        className="text-[9px] bg-amber-500/15 text-amber-400"
                    >
                        YOUR FIX
                    </Badge>
                </div>
                <div className="flex-1">
                    <Editor
                        height="100%"
                        language="python"
                        theme="vs-dark"
                        value={fixedCode}
                        onChange={handleCodeChange}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            wordWrap: "on",
                            tabSize: 4,
                            padding: { top: 12 },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
