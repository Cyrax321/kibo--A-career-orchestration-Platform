import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Note {
    id: string;
    user_id: string;
    application_id: string | null;
    title: string;
    content: string;
    tags: string[];
    color: string;
    is_pinned: boolean;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export interface NoteShare {
    id: string;
    note_id: string;
    user_id: string;
    share_token: string;
    access_level: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export function useNotes() {
    const { toast } = useToast();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchNotes = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", session.user.id)
            .eq("is_archived", false)
            .order("is_pinned", { ascending: false })
            .order("updated_at", { ascending: false });

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            setNotes((data as Note[]) || []);
        }
        setLoading(false);
    }, [toast]);

    const createNote = useCallback(async (applicationId?: string): Promise<Note | null> => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        const { data, error } = await supabase
            .from("notes")
            .insert({
                user_id: session.user.id,
                title: "",
                content: "",
                application_id: applicationId || null,
            })
            .select()
            .single();

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return null;
        }

        const newNote = data as Note;
        setNotes(prev => [newNote, ...prev]);
        return newNote;
    }, [toast]);

    const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
        const { error } = await supabase
            .from("notes")
            .update(updates)
            .eq("id", id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return false;
        }

        setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n));
        return true;
    }, [toast]);

    const autoSave = useCallback((id: string, updates: Partial<Note>) => {
        // Clear previous timer
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);

        setSaveStatus("saving");

        saveTimeoutRef.current = setTimeout(async () => {
            setSaving(true);
            const success = await updateNote(id, updates);
            setSaving(false);
            if (success) {
                setSaveStatus("saved");
                statusTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
            }
        }, 1500);
    }, [updateNote]);

    const deleteNote = useCallback(async (id: string) => {
        const { error } = await supabase
            .from("notes")
            .delete()
            .eq("id", id);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return false;
        }

        setNotes(prev => prev.filter(n => n.id !== id));
        toast({ title: "Note deleted" });
        return true;
    }, [toast]);

    const togglePin = useCallback(async (id: string, isPinned: boolean) => {
        return updateNote(id, { is_pinned: !isPinned });
    }, [updateNote]);

    const searchNotes = useCallback(async (query: string) => {
        if (!query.trim()) {
            fetchNotes();
            return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", session.user.id)
            .eq("is_archived", false)
            .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
            .order("updated_at", { ascending: false });

        if (!error) {
            setNotes((data as Note[]) || []);
        }
    }, [fetchNotes]);

    // Share note
    const shareNote = useCallback(async (noteId: string, accessLevel: string = "view"): Promise<NoteShare | null> => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        // Check if share already exists
        const { data: existing } = await supabase
            .from("note_shares")
            .select("*")
            .eq("note_id", noteId)
            .eq("user_id", session.user.id)
            .maybeSingle();

        if (existing) {
            // Update existing share
            const { data, error } = await supabase
                .from("note_shares")
                .update({ access_level: accessLevel, is_active: true })
                .eq("id", (existing as NoteShare).id)
                .select()
                .single();

            if (error) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
                return null;
            }
            return data as NoteShare;
        }

        // Create new share
        const { data, error } = await supabase
            .from("note_shares")
            .insert({
                note_id: noteId,
                user_id: session.user.id,
                access_level: accessLevel,
            })
            .select()
            .single();

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            return null;
        }
        return data as NoteShare;
    }, [toast]);

    const getShareForNote = useCallback(async (noteId: string): Promise<NoteShare | null> => {
        const { data } = await supabase
            .from("note_shares")
            .select("*")
            .eq("note_id", noteId)
            .eq("is_active", true)
            .maybeSingle();

        return (data as NoteShare) || null;
    }, []);

    const disableShare = useCallback(async (shareId: string) => {
        const { error } = await supabase
            .from("note_shares")
            .update({ is_active: false })
            .eq("id", shareId);

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    }, [toast]);

    // Fetch shared note (public - no auth required)
    const fetchSharedNote = useCallback(async (shareToken: string): Promise<{ note: Note; share: NoteShare } | null> => {
        const { data: shareData, error: shareError } = await supabase
            .from("note_shares")
            .select("*")
            .eq("share_token", shareToken)
            .eq("is_active", true)
            .single();

        if (shareError || !shareData) return null;

        const share = shareData as NoteShare;

        const { data: noteData, error: noteError } = await supabase
            .from("notes")
            .select("*")
            .eq("id", share.note_id)
            .single();

        if (noteError || !noteData) return null;

        return { note: noteData as Note, share };
    }, []);

    // Fetch notes linked to a specific application
    const fetchApplicationNotes = useCallback(async (applicationId: string): Promise<Note[]> => {
        const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("application_id", applicationId)
            .order("updated_at", { ascending: false });

        if (error) return [];
        return (data as Note[]) || [];
    }, []);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
        };
    }, []);

    return {
        notes,
        loading,
        saving,
        saveStatus,
        fetchNotes,
        createNote,
        updateNote,
        autoSave,
        deleteNote,
        togglePin,
        searchNotes,
        shareNote,
        getShareForNote,
        disableShare,
        fetchSharedNote,
        fetchApplicationNotes,
    };
}
