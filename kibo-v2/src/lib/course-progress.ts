import { supabase } from "@/integrations/supabase/client";

export interface CourseProgress {
    user_id: string;
    completed_lessons: string[];
    unlocked_hints: string[];
    updated_at: string;
}

export async function getCourseProgress(userId: string): Promise<CourseProgress | null> {
    const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error('Error fetching course progress:', error);
        }
        return null;
    }

    return data as CourseProgress;
}

export async function saveCourseProgress(
    userId: string,
    completedLessons: string[],
    unlockedHints: string[]
) {
    const { error } = await supabase
        .from('user_course_progress')
        .upsert({
            user_id: userId,
            completed_lessons: completedLessons,
            unlocked_hints: unlockedHints,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id'
        });

    if (error) {
        console.error('Error saving course progress:', error);
        throw error;
    }
}

