import * as React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Award,
    CheckCircle2,
    XCircle,
    Clock,
    BookOpen,
    Code2,
    Bug,
    Trophy,
    ArrowLeft,
    Eye,
    EyeOff,
    Download,
    Share2,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ExamResult, MCQFeedback } from "@/components/certifications/types";

const sectionIcons: Record<string, React.ReactNode> = {
    mcq: <BookOpen className="h-4 w-4" />,
    coding: <Code2 className="h-4 w-4" />,
    debugging: <Bug className="h-4 w-4" />,
};

export default function ResultBreakdown() {
    const { certId, attemptId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [showMCQDetails, setShowMCQDetails] = React.useState(false);

    // Get result from navigation state or localStorage
    const result: ExamResult | null = React.useMemo(() => {
        if (location.state?.result) return location.state.result;
        // Try localStorage
        const stored = localStorage.getItem(`cert_results_${certId}`);
        if (stored) {
            const results: ExamResult[] = JSON.parse(stored);
            return results.find((r) => r.attempt_id === attemptId) || null;
        }
        return null;
    }, [location.state, certId, attemptId]);

    if (!result) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Result not found.</p>
                    <Button onClick={() => navigate("/certifications")}>
                        Back to Certifications
                    </Button>
                </div>
            </div>
        );
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border/50 bg-card/80 backdrop-blur-xl px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/certifications")}
                        className="gap-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-lg font-bold">Exam Results</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-6 space-y-6">
                {/* Result Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                        "rounded-2xl p-8 text-center border",
                        result.passed
                            ? "bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-emerald-500/10 border-emerald-500/30"
                            : "bg-gradient-to-br from-red-500/10 via-rose-500/5 to-red-500/10 border-red-500/30"
                    )}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mb-4"
                    >
                        {result.passed ? (
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-500/40">
                                <Trophy className="h-10 w-10 text-emerald-400" />
                            </div>
                        ) : (
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 border-2 border-red-500/40">
                                <XCircle className="h-10 w-10 text-red-400" />
                            </div>
                        )}
                    </motion.div>

                    <h2 className="text-2xl font-black mb-1">
                        {result.passed ? "Congratulations! 🎉" : "Better Luck Next Time"}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        {result.certification_title} ({result.certification_code})
                    </p>

                    {/* Score */}
                    <div className="inline-flex items-baseline gap-1">
                        <span
                            className={cn(
                                "text-5xl font-black",
                                result.passed ? "text-emerald-400" : "text-red-400"
                            )}
                        >
                            {result.percentage}%
                        </span>
                        <span className="text-lg text-muted-foreground font-medium">
                            ({result.score}/{result.total_marks})
                        </span>
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTime(result.time_taken_seconds)}
                        </span>
                        {result.tab_switch_count > 0 && (
                            <span className="flex items-center gap-1 text-amber-400">
                                <EyeOff className="h-3.5 w-3.5" />
                                {result.tab_switch_count} tab switch
                                {result.tab_switch_count !== 1 ? "es" : ""}
                            </span>
                        )}
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-[10px]",
                                result.passed
                                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                    : "bg-red-500/15 text-red-400 border-red-500/30"
                            )}
                        >
                            {result.passed ? "PASSED" : "FAILED"} (needed{" "}
                            {result.passing_score}%)
                        </Badge>
                    </div>
                </motion.div>

                {/* Section Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl border border-border/50 bg-card/50 p-6"
                >
                    <h3 className="text-sm font-bold mb-4">Score Breakdown</h3>
                    <div className="space-y-4">
                        {result.section_scores.map((section) => {
                            const pct =
                                section.total > 0
                                    ? Math.round((section.earned / section.total) * 100)
                                    : 0;
                            return (
                                <div key={section.type}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2 text-sm">
                                            {sectionIcons[section.type]}
                                            <span className="font-medium">{section.label}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({section.weight}% weight)
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold">
                                            {section.earned}/{section.total}
                                        </span>
                                    </div>
                                    <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ delay: 0.5, duration: 0.8 }}
                                            className={cn(
                                                "h-full rounded-full",
                                                pct >= 80
                                                    ? "bg-gradient-to-r from-emerald-500 to-green-500"
                                                    : pct >= 50
                                                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                                        : "bg-gradient-to-r from-red-500 to-rose-500"
                                            )}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* MCQ Feedback */}
                {result.mcq_feedback && result.mcq_feedback.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden"
                    >
                        <button
                            onClick={() => setShowMCQDetails((v) => !v)}
                            className="w-full flex items-center justify-between p-6 hover:bg-muted/20 transition-colors"
                        >
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-amber-500" />
                                MCQ Details ({result.mcq_feedback.filter((f) => f.is_correct).length}/
                                {result.mcq_feedback.length} correct)
                            </h3>
                            {showMCQDetails ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </button>

                        {showMCQDetails && (
                            <div className="border-t border-border/50 p-6 space-y-4">
                                {result.mcq_feedback.map((fb, i) => (
                                    <div
                                        key={fb.question_id}
                                        className={cn(
                                            "rounded-xl border p-4",
                                            fb.is_correct
                                                ? "border-emerald-500/30 bg-emerald-500/5"
                                                : "border-red-500/30 bg-red-500/5"
                                        )}
                                    >
                                        <div className="flex items-start gap-2 mb-2">
                                            {fb.is_correct ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                                            )}
                                            <span className="text-sm font-medium">
                                                Q{i + 1}: {fb.question_text}
                                            </span>
                                        </div>
                                        {!fb.is_correct && (
                                            <p className="text-xs text-muted-foreground ml-6">
                                                {fb.explanation}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Coding Feedback */}
                {result.coding_feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="rounded-2xl border border-border/50 bg-card/50 p-6"
                    >
                        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-amber-500" />
                            Coding Problem: {result.coding_feedback.question_title}
                        </h3>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-sm">
                                Test Cases:{" "}
                                <strong>
                                    {result.coding_feedback.test_cases_passed}/
                                    {result.coding_feedback.test_cases_total}
                                </strong>
                            </span>
                            <span className="text-sm">
                                Score:{" "}
                                <strong>
                                    {result.coding_feedback.score}/
                                    {result.coding_feedback.max_score}
                                </strong>
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {result.coding_feedback.details}
                        </p>
                    </motion.div>
                )}

                {/* Debugging Feedback */}
                {result.debugging_feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="rounded-2xl border border-border/50 bg-card/50 p-6"
                    >
                        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                            <Bug className="h-4 w-4 text-amber-500" />
                            Debugging: {result.debugging_feedback.question_title}
                        </h3>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-sm">
                                Bugs Fixed:{" "}
                                <strong>
                                    {result.debugging_feedback.bugs_identified}/
                                    {result.debugging_feedback.bugs_total}
                                </strong>
                            </span>
                            <span className="text-sm">
                                Score:{" "}
                                <strong>
                                    {result.debugging_feedback.score}/
                                    {result.debugging_feedback.max_score}
                                </strong>
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {result.debugging_feedback.details}
                        </p>
                    </motion.div>
                )}

                {/* Certificate / Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-3"
                >
                    <Button
                        variant="outline"
                        onClick={() => navigate("/certifications")}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Certifications
                    </Button>
                    {result.passed && result.certificate_id && (
                        <Button
                            onClick={() =>
                                navigate(`/verify/${result.certificate_id}`)
                            }
                            className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                        >
                            <Award className="h-4 w-4" />
                            View Certificate
                        </Button>
                    )}
                    {!result.passed && (
                        <Button
                            onClick={() =>
                                navigate(`/certifications/${certId}/exam`)
                            }
                            className="gap-2"
                        >
                            Retake Exam
                        </Button>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
