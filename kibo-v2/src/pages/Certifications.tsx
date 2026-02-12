import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Award,
    Clock,
    Shield,
    ChevronRight,
    Lock,
    CheckCircle2,
    Star,
    BookOpen,
    Code2,
    Bug,
    Trophy,
    AlertTriangle,
    History,
    Crown,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCertifications } from "@/hooks/useCertifications";
import type { Certification, ExamResult } from "@/components/certifications/types";
import { cn } from "@/lib/utils";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
};

const levelColors: Record<string, string> = {
    beginner: "from-emerald-500 to-green-600",
    intermediate: "from-amber-500 to-orange-600",
    advanced: "from-red-500 to-rose-600",
};

const levelBadgeColors: Record<string, string> = {
    beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    advanced: "bg-red-500/15 text-red-400 border-red-500/30",
};

const sectionIcons: Record<string, React.ReactNode> = {
    mcq: <BookOpen className="h-4 w-4" />,
    coding: <Code2 className="h-4 w-4" />,
    debugging: <Bug className="h-4 w-4" />,
};

function Certifications() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { certifications, getBestResult } = useCertifications();
    const [expandedId, setExpandedId] = React.useState<string | null>(null);
    const [isPro, setIsPro] = React.useState(() => {
        return localStorage.getItem("kibo_pro_active") === "true";
    });

    const togglePro = () => {
        const next = !isPro;
        setIsPro(next);
        localStorage.setItem("kibo_pro_active", String(next));
        toast({
            title: next ? "⚡ Kibo Pro Activated" : "Pro Deactivated",
            description: next
                ? "You now have access to all premium certifications!"
                : "Premium certifications are now locked.",
        });
    };

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-background">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <SidebarTrigger />
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                                        <Award className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold">Certifications</h1>
                                        <p className="text-xs text-muted-foreground">
                                            Validate your skills with professional-grade exams
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={togglePro}
                                variant={isPro ? "default" : "outline"}
                                className={cn(
                                    "gap-2 transition-all",
                                    isPro
                                        ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/20"
                                        : "border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
                                )}
                            >
                                <Crown className={cn("h-4 w-4", isPro && "animate-pulse")} />
                                {isPro ? "Pro Active" : "Activate Pro"}
                                {isPro && <Sparkles className="h-3.5 w-3.5" />}
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-w-5xl mx-auto">
                        {/* Hero Banner */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 p-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-3xl shadow-lg">
                                    🏆
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold mb-1">
                                        Kibo Professional Certifications
                                    </h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Earn industry-recognized certifications calibrated to FAANG
                                        screening standards. Each exam tests real-world coding
                                        ability, debugging skills, and deep language knowledge.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Certification Cards */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            {certifications.map((cert) => {
                                const bestResult = getBestResult(cert.id);
                                const isExpanded = expandedId === cert.id;
                                const isPassed = bestResult?.passed === true;

                                return (
                                    <motion.div
                                        key={cert.id}
                                        variants={itemVariants}
                                        className={cn(
                                            "rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300",
                                            isExpanded
                                                ? "border-amber-500/40 shadow-lg shadow-amber-500/5"
                                                : "border-border/50 hover:border-amber-500/30 hover:shadow-md"
                                        )}
                                    >
                                        {/* Card Header */}
                                        <div
                                            className="p-6 cursor-pointer"
                                            onClick={() =>
                                                setExpandedId(isExpanded ? null : cert.id)
                                            }
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    {/* Icon */}
                                                    <div
                                                        className={cn(
                                                            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-lg overflow-hidden relative",
                                                            levelColors[cert.level]
                                                        )}
                                                    >
                                                        {cert.image ? (
                                                            <img
                                                                src={cert.image}
                                                                alt={cert.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            cert.icon || "📜"
                                                        )}
                                                    </div>
                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <h3 className="font-bold text-base">
                                                                {cert.title}
                                                            </h3>
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    "text-[10px] uppercase tracking-wider",
                                                                    levelBadgeColors[cert.level]
                                                                )}
                                                            >
                                                                {cert.level}
                                                            </Badge>
                                                            {cert.is_premium && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-[10px] bg-violet-500/15 text-violet-400 border-violet-500/30"
                                                                >
                                                                    <Lock className="h-2.5 w-2.5 mr-1" />
                                                                    PRO
                                                                </Badge>
                                                            )}
                                                            {isPassed && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                                                >
                                                                    <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                                                                    CERTIFIED
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                            {cert.description}
                                                        </p>
                                                        {/* Quick Stats */}
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                {cert.duration_minutes} min
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Star className="h-3.5 w-3.5" />
                                                                {cert.total_marks} marks
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Shield className="h-3.5 w-3.5" />
                                                                {cert.passing_score}% to pass
                                                            </span>
                                                            {bestResult && (
                                                                <span className="flex items-center gap-1">
                                                                    <Trophy className="h-3.5 w-3.5" />
                                                                    Best: {bestResult.percentage}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Expand Arrow */}
                                                <ChevronRight
                                                    className={cn(
                                                        "h-5 w-5 text-muted-foreground transition-transform duration-300 shrink-0 mt-1",
                                                        isExpanded && "rotate-90"
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="border-t border-border/50"
                                            >
                                                <div className="p-6 space-y-6">
                                                    {/* Exam Format */}
                                                    <div>
                                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4 text-amber-500" />
                                                            Exam Format
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                            {cert.format.sections.map((section) => (
                                                                <div
                                                                    key={section.type}
                                                                    className="rounded-xl border border-border/50 bg-muted/30 p-4"
                                                                >
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        {sectionIcons[section.type]}
                                                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                                                            {section.label}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-2xl font-black mb-1">
                                                                        {section.marks}
                                                                        <span className="text-xs font-normal text-muted-foreground ml-1">
                                                                            marks
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                                        {section.description}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Syllabus */}
                                                    <div>
                                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                            <Star className="h-4 w-4 text-amber-500" />
                                                            Skills Covered
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {cert.syllabus.map((skill) => (
                                                                <Badge
                                                                    key={skill}
                                                                    variant="outline"
                                                                    className="text-[11px] bg-muted/50"
                                                                >
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Rules */}
                                                    <div>
                                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                            Exam Rules
                                                        </h4>
                                                        <ul className="text-xs text-muted-foreground space-y-1.5">
                                                            {cert.rules.map((rule, i) => (
                                                                <li key={i} className="flex items-start gap-2">
                                                                    <span className="text-amber-500 mt-0.5">•</span>
                                                                    {rule}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-3 pt-2">
                                                        {cert.is_premium && !isPro ? (
                                                            <Button
                                                                onClick={togglePro}
                                                                className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/20"
                                                            >
                                                                <Crown className="h-4 w-4" />
                                                                Unlock with Kibo Pro
                                                            </Button>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/certifications/${cert.id}/exam`
                                                                        )
                                                                    }
                                                                    className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20"
                                                                >
                                                                    <Award className="h-4 w-4" />
                                                                    Start Exam
                                                                </Button>
                                                                {bestResult && (
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/certifications/${cert.id}/result/${bestResult.attempt_id}`
                                                                            )
                                                                        }
                                                                        className="gap-2"
                                                                    >
                                                                        <History className="h-4 w-4" />
                                                                        View Last Result
                                                                    </Button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}

export default Certifications;
