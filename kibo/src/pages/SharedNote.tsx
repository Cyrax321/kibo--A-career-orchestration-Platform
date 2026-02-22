import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { StickyNote, ArrowLeft, Lock, Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/useNotes";
import type { Note, NoteShare } from "@/hooks/useNotes";
import { PlateEditor } from "@/components/editor/plate-editor";

const SharedNote = () => {
    const { shareToken } = useParams<{ shareToken: string }>();
    const { fetchSharedNote } = useNotes();
    const [note, setNote] = React.useState<Note | null>(null);
    const [share, setShare] = React.useState<NoteShare | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        const load = async () => {
            if (!shareToken) { setError(true); setLoading(false); return; }
            const result = await fetchSharedNote(shareToken);
            if (result) {
                setNote(result.note);
                setShare(result.share);
            } else {
                setError(true);
            }
            setLoading(false);
        };
        load();
    }, [shareToken, fetchSharedNote]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
                        <StickyNote className="h-6 w-6 text-primary/50" />
                    </div>
                    <p className="text-sm text-muted-foreground">Loading shared note...</p>
                </motion.div>
            </div>
        );
    }

    if (error || !note) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4 text-center px-8"
                >
                    <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
                        <Lock className="h-8 w-8 text-destructive/50" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Note Not Available</h2>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        This shared note may have been removed, or the link may have expired.
                    </p>
                    <Link to="/">
                        <Button variant="outline" className="gap-2 mt-2">
                            <ArrowLeft className="h-4 w-4" />
                            Go to Kibo
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
            {/* Header */}
            <header className="border-b border-border/40 bg-white/80 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                        <StickyNote className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-sm">Kibo</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="gap-1.5 text-xs">
                            {share?.access_level === "edit" ? (
                                <><Pencil className="h-3 w-3" /> Can Edit</>
                            ) : (
                                <><Eye className="h-3 w-3" /> View Only</>
                            )}
                        </Badge>
                    </div>
                </div>
            </header>

            {/* Note content */}
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-4xl mx-auto px-6 py-8 lg:py-12"
            >
                {/* Tags */}
                {(note.tags || []).length > 0 && (
                    <div className="flex items-center gap-1.5 mb-4">
                        {note.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">
                    {note.title || "Untitled"}
                </h1>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-8 pb-8 border-b border-border/30">
                    <span>
                        Last updated {new Date(note.updated_at).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                </div>

                {/* Rendered content */}
                <div className="note-editor mt-4">
                    <PlateEditor content={note.content} readOnly />
                </div>
            </motion.main>

            {/* Footer */}
            <footer className="border-t border-border/30 py-6 mt-12">
                <div className="max-w-4xl mx-auto px-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/50">
                    <StickyNote className="h-3.5 w-3.5" />
                    <span>Shared via Kibo</span>
                </div>
            </footer>
        </div>
    );
};

export default SharedNote;
