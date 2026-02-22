import * as React from "react";
import { motion } from "framer-motion";
import { Flame, Award, Zap, TrendingUp, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LevelThreshold {
  level: number;
  xp_required: number;
  title: string;
}

interface LevelProgress {
  current: number;
  next: number;
  progress: number;
  title: string;
}

interface UserStats {
  totalXP: number;
  level: number;
  streak: number;
  problemsSolved: number;
  applicationsCount: number;
  achievementsCount: number;
}

interface StatsHUDProps {
  profile: {
    streak: number;
    level: number;
    xp: number;
  } | null;
  userStats?: UserStats | null;
  levelProgress?: LevelProgress;
  levelThresholds?: LevelThreshold[];
}

export const StatsHUD: React.FC<StatsHUDProps> = ({
  profile,
  userStats,
  levelProgress,
  levelThresholds = []
}) => {
  // Use userStats if available, fallback to profile
  const streak = userStats?.streak ?? profile?.streak ?? 0;
  const level = userStats?.level ?? profile?.level ?? 1;
  const xp = userStats?.totalXP ?? profile?.xp ?? 0;
  const problemsSolved = userStats?.problemsSolved ?? 0;
  const applicationsCount = userStats?.applicationsCount ?? 0;
  const achievementsCount = userStats?.achievementsCount ?? 0;

  // Calculate level progress
  const currentThreshold = levelThresholds.find(t => t.level === level);
  const nextThreshold = levelThresholds.find(t => t.level === level + 1);
  const levelName = currentThreshold?.title || levelProgress?.title || "Novice";

  const xpInLevel = levelProgress?.current ?? (xp - (currentThreshold?.xp_required ?? 0));
  const xpNeeded = levelProgress?.next ?? ((nextThreshold?.xp_required ?? xp) - (currentThreshold?.xp_required ?? 0));
  const progressPercent = levelProgress?.progress ?? (xpNeeded > 0 ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 100);

  const stats = [
    {
      icon: Flame,
      image: "/assets/icons/flame-3d.png",
      label: "Day Streak",
      value: streak,
      suffix: streak === 1 ? "Day" : "Days",
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20",
      tooltip: streak > 0 ? `${streak} day streak active` : "Start your streak today",
    },
    {
      icon: Award,
      image: "/assets/icons/medal-3d.png",
      label: "Level",
      value: `Lvl ${level}`,
      suffix: levelName,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      tooltip: `Level ${level} - ${levelName}`,
    },
    {
      icon: Zap,
      image: "/assets/icons/lightning-3d.png",
      label: "Experience",
      value: xp.toLocaleString(),
      suffix: "XP",
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
      showProgress: true,
      progress: progressPercent,
      xpInLevel,
      xpNeeded,
      tooltip: `${xpNeeded - xpInLevel} XP to level ${level + 1}`,
    },
  ];

  const secondaryStats = [
    {
      icon: Target,
      image: "/assets/icons/target-3d.png",
      label: "Problems",
      value: problemsSolved,
      color: "text-blue-500",
    },
    {
      icon: TrendingUp,
      image: "/assets/icons/chart-3d.png",
      label: "Applications",
      value: applicationsCount,
      color: "text-purple-500",
    },
    {
      icon: Trophy,
      image: "/assets/icons/trophy-3d.png",
      label: "Achievements",
      value: achievementsCount,
      color: "text-amber-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-4"
    >
      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <TooltipProvider key={stat.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border-2 p-5 shadow-lg transition-all duration-300 group",
                    // Dynamic border and background based on stat type
                    stat.label === "Day Streak" && "border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent hover:border-orange-500/40 hover:shadow-orange-500/10",
                    stat.label === "Level" && "border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent hover:border-violet-500/40 hover:shadow-violet-500/10",
                    stat.label === "Experience" && "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent hover:border-emerald-500/40 hover:shadow-emerald-500/10"
                  )}
                >
                  {/* Glassy Overlay / Shine Effect */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Decorative Background Blob */}
                  <div
                    className={cn(
                      "absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-20",
                      stat.label === "Day Streak" && "bg-orange-500",
                      stat.label === "Level" && "bg-violet-500",
                      stat.label === "Experience" && "bg-emerald-500"
                    )}
                  />

                  <div className="relative flex items-center justify-between z-10">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-widest opacity-60">
                        {stat.label}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className={cn(
                          "text-3xl font-black tracking-tight",
                          stat.label === "Day Streak" && "text-orange-500",
                          stat.label === "Level" && "text-violet-500",
                          stat.label === "Experience" && "text-emerald-500"
                        )}>
                          {stat.value}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground/80">{stat.suffix}</span>
                      </div>
                    </div>

                    {/* Icon Container */}
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl shadow-inner ring-1 ring-inset",
                      stat.label === "Day Streak" && "bg-orange-500/10 ring-orange-500/20",
                      stat.label === "Level" && "bg-violet-500/10 ring-violet-500/20",
                      stat.label === "Experience" && "bg-emerald-500/10 ring-emerald-500/20"
                    )}>
                      {stat.image ? (
                        <img
                          src={stat.image}
                          alt={stat.label}
                          className="h-8 w-8 object-contain drop-shadow-md transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <stat.icon className={cn(
                          "h-6 w-6 transition-transform group-hover:scale-110",
                          stat.label === "Day Streak" && "text-orange-500",
                          stat.label === "Level" && "text-violet-500",
                          stat.label === "Experience" && "text-emerald-500"
                        )} />
                      )}
                    </div>
                  </div>

                  {stat.showProgress && (
                    <div className="mt-4 space-y-2">
                      <div className="h-2 rounded-full bg-black/10 dark:bg-white/5 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(stat.progress || 0, 100)}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 relative overflow-hidden"
                        >
                          {/* Animated sheen on progress bar */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
                        </motion.div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-medium text-muted-foreground">
                        <span>Level Progress</span>
                        <span>{stat.xpInLevel?.toLocaleString()} / {stat.xpNeeded?.toLocaleString()} XP</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs font-semibold">
                <p>{stat.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Secondary Stats Row */}
      <div className="flex items-center justify-center gap-6 py-2">
        {secondaryStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="flex items-center gap-2 text-sm"
          >
            {/* Render 3D icon if available, else fallback to Lucide */}
            {stat.image ? (
              <img
                src={stat.image}
                alt={stat.label}
                className="h-5 w-5 object-contain"
              />
            ) : (
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            )}
            <span className="text-muted-foreground">{stat.label}:</span>
            <span className="font-semibold">{stat.value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
