import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StickyNote } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { NotesSidebar } from "@/components/notes/NotesSidebar";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { useNotes } from "@/hooks/useNotes";

const Notes = () => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const {
        notes,
        loading,
        saveStatus,
        fetchNotes,
        createNote,
        updateNote,
        autoSave,
        deleteNote,
        togglePin,
        searchNotes,
    } = useNotes();

    const [activeNoteId, setActiveNoteId] = React.useState<string | null>(noteId || null);

    React.useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    // If noteId from URL, set it active
    React.useEffect(() => {
        if (noteId) {
            setActiveNoteId(noteId);
        }
    }, [noteId]);

    // Auto-select first note if none active and notes exist
    React.useEffect(() => {
        if (!activeNoteId && notes.length > 0 && !loading) {
            setActiveNoteId(notes[0].id);
        }
    }, [notes, activeNoteId, loading]);

    const activeNote = notes.find((n) => n.id === activeNoteId);

    const handleCreateNote = async () => {
        const newNote = await createNote();
        if (newNote) {
            setActiveNoteId(newNote.id);
            navigate(`/notes/${newNote.id}`, { replace: true });
        }
    };

    const handleSelectNote = (id: string) => {
        setActiveNoteId(id);
        navigate(`/notes/${id}`, { replace: true });
    };

    const handleDeleteNote = async (id: string) => {
        const success = await deleteNote(id);
        if (success && activeNoteId === id) {
            const remaining = notes.filter((n) => n.id !== id);
            if (remaining.length > 0) {
                setActiveNoteId(remaining[0].id);
                navigate(`/notes/${remaining[0].id}`, { replace: true });
            } else {
                setActiveNoteId(null);
                navigate("/notes", { replace: true });
            }
        }
    };

    return (
        <AppLayout>
            <div className="flex h-[calc(100vh-2rem)] overflow-hidden rounded-xl border border-border/40 bg-white/80 backdrop-blur-sm shadow-sm mx-2 my-2 lg:mx-4 lg:my-3 animate-in fade-in duration-300">
                {/* Notes sidebar list */}
                <div className="w-80 shrink-0 hidden md:block">
                    <NotesSidebar
                        notes={notes}
                        activeNoteId={activeNoteId}
                        onSelectNote={handleSelectNote}
                        onCreateNote={handleCreateNote}
                        onDeleteNote={handleDeleteNote}
                        onSearch={searchNotes}
                        loading={loading}
                    />
                </div>

                {/* Editor area */}
                <div className="flex-1 min-w-0">
                    {activeNote ? (
                        <NoteEditor
                            note={activeNote}
                            onUpdate={updateNote}
                            onAutoSave={autoSave}
                            onDelete={handleDeleteNote}
                            onTogglePin={togglePin}
                            saveStatus={saveStatus}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                            <div className="animate-in zoom-in-90 fade-in duration-300">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 mx-auto">
                                    <StickyNote className="h-8 w-8 text-primary/50" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    {notes.length === 0 ? "Welcome to Notes" : "Select a note"}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                                    {notes.length === 0
                                        ? "Create your first note to start organizing your career journey."
                                        : "Choose a note from the sidebar or create a new one."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile: notes list overlay - shown when no active note on mobile */}
            <div className="md:hidden">
                {!activeNote && (
                    <div className="fixed inset-0 z-40 bg-background pt-16">
                        <NotesSidebar
                            notes={notes}
                            activeNoteId={activeNoteId}
                            onSelectNote={handleSelectNote}
                            onCreateNote={handleCreateNote}
                            onDeleteNote={handleDeleteNote}
                            onSearch={searchNotes}
                            loading={loading}
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default Notes;
