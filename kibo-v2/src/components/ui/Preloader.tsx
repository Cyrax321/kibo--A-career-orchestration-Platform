import * as React from "react";
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import kiboLogo from "@/assets/kibo-logo.png";

export const Preloader: React.FC = () => {
    const { progress } = useProgress();
    const [complete, setComplete] = React.useState(false);
    const [minTimeElapsed, setMinTimeElapsed] = React.useState(false);

    // Minimum "premium" load time to ensure smooth reveal (1.5s)
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setMinTimeElapsed(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // When both conditions are met (loaded + min time), trigger exit
    React.useEffect(() => {
        if (progress === 100 && minTimeElapsed) {
            setComplete(true);
        }
    }, [progress, minTimeElapsed]);

    return (
        <AnimatePresence mode="wait">
            {!complete && (
                <motion.div
                    initial={{ opacity: 1, backdropFilter: "blur(100px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(100px)" }}
                    exit={{
                        opacity: 0,
                        backdropFilter: "blur(0px)",
                        transition: { duration: 1.5, ease: "easeInOut" }
                    }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/60 backdrop-blur-[100px]"
                >
                    {/* Subtle pulsing logo in the center of the blur */}
                    <motion.div
                        animate={{
                            scale: [0.95, 1.05, 0.95],
                            opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="flex flex-col items-center gap-4"
                    >
                        <img src={kiboLogo} alt="Kibo" className="w-20 h-20 object-contain opacity-50 grayscale" />

                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-medium tracking-[0.3em] text-foreground/40 uppercase">
                                Loading Experience
                            </span>
                            {/* Minimal progress line */}
                            <div className="w-24 h-[1px] bg-foreground/10 overflow-hidden">
                                <motion.div
                                    className="h-full bg-foreground/40"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
