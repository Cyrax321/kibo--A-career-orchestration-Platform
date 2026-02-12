import { useEffect, useState } from "react";
import { format, subDays, eachDayOfInterval, getDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ContributionGraphProps {
    userId: string;
}

interface DailyActivity {
    activity_date: string;
    problems_solved: number | null;
    applications_sent: number | null;
    assessments_completed: number | null;
}

export const ContributionGraph = ({ userId }: ContributionGraphProps) => {
    const [activity, setActivity] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            // Fetch from daily_activities table to match Dashboard data
            const endDate = new Date();
            const startDate = subDays(endDate, 365);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase as any)
                .from("daily_activities")
                .select("activity_date, problems_solved, applications_sent, assessments_completed")
                .eq("user_id", userId)
                .gte("activity_date", startDate.toISOString().split('T')[0])
                .returns();

            if (error) {
                console.error("Error fetching activity:", error);
            } else {
                const activityMap: Record<string, number> = {};
                (data as DailyActivity[])?.forEach((item) => {
                    const date = item.activity_date;
                    // Aggregate different activity types
                    const count = (item.problems_solved || 0) +
                        (item.applications_sent || 0) +
                        (item.assessments_completed || 0);

                    if (date && count > 0) {
                        activityMap[date] = count;
                    }
                });
                setActivity(activityMap);
            }
            setLoading(false);
        };

        fetchActivity();
    }, [userId]);

    // Calculate total contributions
    const totalContributions = Object.values(activity).reduce((a, b) => a + b, 0);

    // Generate last 365 days
    const today = new Date();
    const startDate = subDays(today, 365); // Full year
    const days = eachDayOfInterval({
        start: startDate,
        end: today,
    });

    // Group by weeks for the grid
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Pad the first week to align with Sunday start
    const startDay = getDay(startDate);
    for (let i = 0; i < startDay; i++) {
        currentWeek.push(null as unknown as Date);
    }

    days.forEach((day) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    // Push remaining days
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null as unknown as Date);
        }
        weeks.push(currentWeek);
    }

    // Generate Month Labels
    const monthLabels: { label: string; index: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, index) => {
        const firstDay = week.find(d => d !== null);
        if (firstDay) {
            const month = firstDay.getMonth();
            if (month !== lastMonth) {
                // Approximate alignment
                monthLabels.push({ label: format(firstDay, "MMM"), index });
                lastMonth = month;
            }
        }
    });

    const getColor = (count: number) => {
        if (count === 0) return "bg-gray-100 dark:bg-zinc-800"; // Lighter gray for empty
        if (count <= 2) return "bg-[#9be9a8]"; // GitHub Light Green
        if (count <= 5) return "bg-[#40c463]"; // Medium Green
        if (count <= 8) return "bg-[#30a14e]"; // Dark Green
        return "bg-[#216e39]"; // Darkest Green
    };

    if (loading) {
        return (
            <Card className="p-6 mb-6">
                <div className="h-32 animate-pulse bg-muted rounded" />
            </Card>
        );
    }

    return (
        <Card className="p-6 mb-6 overflow-hidden border shadow-sm">
            <h3 className="font-semibold mb-6 text-base">
                {totalContributions} contributions in the last year
            </h3>

            <div className="flex gap-2 text-xs text-muted-foreground w-full overflow-x-auto pb-4">
                {/* Day Labels Column */}
                <div className="flex flex-col gap-[3px] mt-[20px] pr-2">
                    <div className="h-[10px]" /> {/* Mon placeholder */}
                    <div className="h-[10px] leading-[10px]">Mon</div>
                    <div className="h-[10px]" /> {/* Tue placeholder */}
                    <div className="h-[10px] leading-[10px]">Wed</div>
                    <div className="h-[10px]" /> {/* Thu placeholder */}
                    <div className="h-[10px] leading-[10px]">Fri</div>
                    <div className="h-[10px]" /> {/* Sat placeholder */}
                </div>

                {/* Heatmap Grid */}
                <div className="flex flex-col gap-1">
                    {/* Month Labels Row */}
                    <div className="flex relative h-4 mb-1 select-none">
                        {monthLabels.map((m, i) => (
                            <div
                                key={i}
                                className="absolute text-[10px]"
                                style={{ left: `${m.index * 13}px` }} // Approx width of column + gap
                            >
                                {m.label}
                            </div>
                        ))}
                    </div>

                    <TooltipProvider delayDuration={0}>
                        <div className="flex gap-[3px]">
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-[3px]">
                                    {week.map((date, dayIndex) => {
                                        if (!date) {
                                            return <div key={dayIndex} className="w-[10px] h-[10px]" />;
                                        }
                                        const dateStr = format(date, "yyyy-MM-dd");
                                        const count = activity[dateStr] || 0;

                                        return (
                                            <Tooltip key={dateStr}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={cn(
                                                            "w-[10px] h-[10px] rounded-[2px] transition-colors cursor-pointer",
                                                            getColor(count),
                                                            count > 0 && "hover:opacity-80"
                                                        )}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-gray-900 text-white border-0 text-xs py-2 px-3">
                                                    <div>
                                                        <span className="font-semibold">
                                                            {count === 0 ? "No" : count} contributions
                                                        </span>{" "}
                                                        on <span className="text-gray-300">{format(date, "MMMM d, yyyy")}</span>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </TooltipProvider>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-muted-foreground mr-4">
                <span>Less</span>
                <div className="flex gap-[3px]">
                    <div className="w-[10px] h-[10px] bg-gray-100 dark:bg-zinc-800 rounded-[2px]" />
                    <div className="w-[10px] h-[10px] bg-[#9be9a8] rounded-[2px]" />
                    <div className="w-[10px] h-[10px] bg-[#40c463] rounded-[2px]" />
                    <div className="w-[10px] h-[10px] bg-[#30a14e] rounded-[2px]" />
                    <div className="w-[10px] h-[10px] bg-[#216e39] rounded-[2px]" />
                </div>
                <span>More</span>
            </div>
        </Card>
    );
};
