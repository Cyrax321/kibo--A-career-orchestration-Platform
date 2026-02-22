import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Award,
    Shield,
    CheckCircle2,
    Calendar,
    User,
    ArrowLeft,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CertVerifyData {
    holder_name: string;
    certification_title: string;
    certification_code: string;
    score: number;
    issued_at: string;
    valid: boolean;
}

export default function VerifyCertificate() {
    const { certificateId } = useParams<{ certificateId: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = React.useState<"loading" | "found" | "not_found">(
        "loading"
    );
    const [certData, setCertData] = React.useState<CertVerifyData | null>(null);

    React.useEffect(() => {
        // Simulate verification (in production, this calls the cert-verify Edge Function)
        const timer = setTimeout(() => {
            if (certificateId) {
                // Check localStorage for any certificates
                const allKeys = Object.keys(localStorage).filter((k) =>
                    k.startsWith("cert_results_")
                );
                for (const key of allKeys) {
                    const results = JSON.parse(localStorage.getItem(key) || "[]");
                    const match = results.find(
                        (r: any) => r.certificate_id === certificateId // eslint-disable-line @typescript-eslint/no-explicit-any
                    );
                    if (match) {
                        setCertData({
                            holder_name: "Kibo User",
                            certification_title: match.certification_title,
                            certification_code: match.certification_code,
                            score: match.percentage,
                            issued_at: new Date().toISOString(),
                            valid: true,
                        });
                        setStatus("found");
                        return;
                    }
                }
            }
            setStatus("not_found");
        }, 1500);

        return () => clearTimeout(timer);
    }, [certificateId]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20 mb-4">
                        <Shield className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-xl font-bold">Certificate Verification</h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Kibo Professional Certifications
                    </p>
                </div>

                {/* Loading */}
                {status === "loading" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-2xl border border-border/50 bg-card/50 p-8 text-center"
                    >
                        <div className="inline-flex h-12 w-12 items-center justify-center animate-spin rounded-full border-2 border-amber-500 border-t-transparent mb-4" />
                        <p className="text-sm text-muted-foreground">
                            Verifying certificate...
                        </p>
                    </motion.div>
                )}

                {/* Found */}
                {status === "found" && certData && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Certificate Card */}
                        <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card/80 to-orange-500/5 p-8 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

                            <div className="relative">
                                {/* Verified Badge */}
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                    <span className="text-sm font-semibold text-emerald-400">
                                        VERIFIED AUTHENTIC
                                    </span>
                                </div>

                                {/* Title */}
                                <div className="text-center mb-6">
                                    <h2 className="text-lg font-bold mb-1">
                                        {certData.certification_title}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        {certData.certification_code}
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <span className="text-muted-foreground">Holder:</span>
                                        <span className="font-medium">{certData.holder_name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Award className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <span className="text-muted-foreground">Score:</span>
                                        <span className="font-medium">{certData.score}%</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <span className="text-muted-foreground">Issued:</span>
                                        <span className="font-medium">
                                            {new Date(certData.issued_at).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Certificate ID */}
                                <div className="rounded-xl bg-muted/30 border border-border/50 px-4 py-3 text-center">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                        Certificate ID
                                    </span>
                                    <p className="text-xs font-mono font-bold mt-0.5">
                                        {certificateId}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Back button */}
                        <div className="mt-4 text-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate("/certifications")}
                                className="text-xs gap-1"
                            >
                                <ArrowLeft className="h-3 w-3" />
                                Back to Kibo
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Not Found */}
                {status === "not_found" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center"
                    >
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 mb-4">
                            <Shield className="h-7 w-7 text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Certificate Not Found</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            The certificate ID{" "}
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                {certificateId}
                            </code>{" "}
                            could not be verified. It may be invalid or have been revoked.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/certifications")}
                        >
                            Back to Certifications
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
