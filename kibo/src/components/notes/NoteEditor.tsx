import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pin, PinOff, Trash2, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShareNoteDialog } from "./ShareNoteDialog";
import { PlateEditor } from "@/components/editor/plate-editor";
import type { Note } from "@/hooks/useNotes";

interface NoteEditorProps {
    note: Note;
    onUpdate: (id: string, updates: Partial<Note>) => void;
    onAutoSave: (id: string, updates: Partial<Note>) => void;
    onDelete: (id: string) => void;
    onTogglePin: (id: string, isPinned: boolean) => void;
    saveStatus: "idle" | "saving" | "saved";
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
    note,
    onUpdate,
    onAutoSave,
    onDelete,
    onTogglePin,
    saveStatus,
}) => {
    const [title, setTitle] = React.useState(note.title);
    const [showTagInput, setShowTagInput] = React.useState(false);
    const [tagInput, setTagInput] = React.useState("");

    // Sync title when note changes from outside
    React.useEffect(() => {
        setTitle(note.title);
    }, [note.id, note.title]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        onAutoSave(note.id, { title: newTitle });
    };

    const handleAddTag = () => {
        if (!tagInput.trim()) return;
        const newTags = [...(note.tags || [])];
        if (!newTags.includes(tagInput.trim())) {
            newTags.push(tagInput.trim());
            onUpdate(note.id, { tags: newTags });
        }
        setTagInput("");
        setShowTagInput(false);
    };

    const handleRemoveTag = (tag: string) => {
        const newTags = (note.tags || []).filter(t => t !== tag);
        onUpdate(note.id, { tags: newTags });
    };

    return (
        <div
            key={note.id}
            className="flex flex-col h-full animate-in fade-in slide-in-from-right-2 duration-200"
        >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                    {/* Save status */}
                    <AnimatePresence mode="wait">
                        {saveStatus === "saving" && (
                            <motion.div
                                key="saving"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground"
                            >
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Saving...
                            </motion.div>
                        )}
                        {saveStatus === "saved" && (
                            <motion.div
                                key="saved"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-1.5 text-xs text-success"
                            >
                                <Check className="h-3 w-3" />
                                Saved
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-muted-foreground hover:text-foreground"
                        onClick={() => onTogglePin(note.id, note.is_pinned)}
                    >
                        {note.is_pinned ? (
                            <PinOff className="h-4 w-4" />
                        ) : (
                            <Pin className="h-4 w-4" />
                        )}
                        {note.is_pinned ? "Unpin" : "Pin"}
                    </Button>

                    <ShareNoteDialog noteId={note.id} noteTitle={title} />

                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-destructive/70 hover:text-destructive"
                        onClick={() => onDelete(note.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Editor Container */}
            <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-12 lg:py-8 flex flex-col gap-4">
                {/* Title */}
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Untitled"
                    className="w-full text-3xl font-bold text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40"
                />

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {(note.tags || []).map(tag => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs gap-1 cursor-pointer hover:bg-destructive/10 transition-colors"
                            onClick={() => handleRemoveTag(tag)}
                        >
                            {tag}
                            <span className="text-muted-foreground/60">×</span>
                        </Badge>
                    ))}
                    {showTagInput ? (
                        <Input
                            autoFocus
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddTag();
                                if (e.key === "Escape") { setShowTagInput(false); setTagInput(""); }
                            }}
                            onBlur={handleAddTag}
                            placeholder="Tag name..."
                            className="h-6 w-24 text-xs px-2"
                        />
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-muted-foreground gap-1"
                            onClick={() => setShowTagInput(true)}
                        >
                            <Tag className="h-3 w-3" />
                            Add tag
                        </Button>
                    )}
                </div>

                {/* Application link indicator */}
                {note.application_id && (
                    <div className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 text-xs text-primary flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        Linked to application
                    </div>
                )}

                {/* PlateJS Editor */}
                <div className="flex-1 mt-4">
                    <PlateEditor
                        key={note.id}
                        content={note.content}
                        onChange={(content) => onAutoSave(note.id, { content })}
                    />
                </div>
            </div>
        </div>
    );
};
