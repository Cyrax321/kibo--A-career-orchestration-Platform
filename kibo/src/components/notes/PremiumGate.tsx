import * as React from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumGateProps {
    feature: string;
    children: React.ReactNode;
    isPremium?: boolean; // For now, always false (free tier). Flip when billing is added.
}

export const PremiumGate: React.FC<PremiumGateProps> = ({
    feature,
    children,
    isPremium = false,
}) => {
    if (isPremium) {
        return <>{children}</>;
    }

    return (
        <div className="relative group">
            <div className="opacity-40 pointer-events-none select-none blur-[1px]">
                {children}
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl"
            >
                <div className="flex flex-col items-center gap-3 text-center p-6">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">{feature}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Upgrade to Premium to unlock this feature
                        </p>
                    </div>
                    <Button size="sm" className="gap-2 mt-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        Upgrade
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
