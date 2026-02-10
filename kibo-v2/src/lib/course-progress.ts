import { supabase } from "@/integrations/supabase/client";

export interface CourseProgress {
    user_id: string;
    course_id: string;
    completed_lessons: string[];
    unlocked_hints: Record<string, number>;
    last_accessed_at: string;
}

export async function getCourseProgress(userId: string, courseId: string): Promise<CourseProgress | null> {
    const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error('Error fetching course progress:', error);
        }
        return null;
    }

    // Parse unlocked_hints from JSONB if necessary (Supabase client usually handles this, but type assertion helps)
    return data as unknown as CourseProgress;
}

export async function saveCourseProgress(
    userId: string,
    courseId: string,
    completedLessons: string[],
    unlockedHints: Record<string, number>
) {
    const { error } = await supabase
        .from('user_course_progress')
        .upsert({
            user_id: userId,
            course_id: courseId,
            completed_lessons: completedLessons,
            unlocked_hints: unlockedHints,
            last_accessed_at: new Date().toISOString()
        }, {
            onConflict: 'user_id, course_id'
        });

    if (error) {
        console.error('Error saving course progress:', error);
        throw error;
    }
}
