import * as React from "react";
import {
    Search, Plus, Pin, Tag, FileText, StickyNote,
    MoreHorizontal, Trash2, Archive,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Note } from "@/hooks/useNotes";

interface NotesSidebarProps {
    notes: Note[];
    activeNoteId: string | null;
    onSelectNote: (id: string) => void;
    onCreateNote: () => void;
    onDeleteNote: (id: string) => void;
    onSearch: (query: string) => void;
    loading: boolean;
}

const stripHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
};

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
    if (diffHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const NotesSidebar: React.FC<NotesSidebarProps> = ({
    notes,
    activeNoteId,
    onSelectNote,
    onCreateNote,
    onDeleteNote,
    onSearch,
    loading,
}) => {
    const [search, setSearch] = React.useState("");
    const [filterTag, setFilterTag] = React.useState<string | null>(null);

    const handleSearch = (value: string) => {
        setSearch(value);
        onSearch(value);
    };

    // Collect all unique tags
    const allTags = React.useMemo(() => {
        const tags = new Set<string>();
        notes.forEach(n => (n.tags || []).forEach(t => tags.add(t)));
        return Array.from(tags);
    }, [notes]);

    const filteredNotes = React.useMemo(() => {
        if (!filterTag) return notes;
        return notes.filter(n => (n.tags || []).includes(filterTag));
    }, [notes, filterTag]);

    const pinnedNotes = filteredNotes.filter(n => n.is_pinned);
    const unpinnedNotes = filteredNotes.filter(n => !n.is_pinned);

    return (
        <div className="w-full h-full flex flex-col border-r border-border/40 bg-background/50">
            {/* Header */}
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <StickyNote className="h-5 w-5 text-primary" />
                        <h2 className="font-semibold text-foreground">Notes</h2>
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                            {notes.length}
                        </Badge>
                    </div>
                    <Button
                        onClick={onCreateNote}
                        size="sm"
                        className="gap-1.5 h-8"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        New
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search notes..."
                        className="pl-9 h-9 text-sm bg-muted/40 border-border/40"
                    />
                </div>

                {/* Tag filters */}
                {allTags.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
                        <Badge
                            variant={filterTag === null ? "default" : "outline"}
                            className="text-[10px] cursor-pointer shrink-0 transition-colors"
                            onClick={() => setFilterTag(null)}
                        >
                            All
                        </Badge>
                        {allTags.map(tag => (
                            <Badge
                                key={tag}
                                variant={filterTag === tag ? "default" : "outline"}
                                className="text-[10px] cursor-pointer shrink-0 transition-colors"
                                onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Notes list */}
            <ScrollArea className="flex-1">
                <div className="px-2 pb-4 space-y-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                            <p className="text-xs text-muted-foreground">Loading notes...</p>
                        </div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-primary/40" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">No notes yet</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                    Create your first note to get started
                                </p>
                            </div>
                            <Button size="sm" variant="outline" onClick={onCreateNote} className="mt-2 gap-1.5">
                                <Plus className="h-3.5 w-3.5" />
                                New Note
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Pinned section */}
                            {pinnedNotes.length > 0 && (
                                <div className="mb-2">
                                    <p className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Pin className="h-3 w-3" />
                                        Pinned
                                    </p>
                                    {pinnedNotes.map((note) => (
                                        <NoteCard
                                            key={note.id}
                                            note={note}
                                            isActive={note.id === activeNoteId}
                                            onSelect={onSelectNote}
                                            onDelete={onDeleteNote}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* All notes */}
                            {unpinnedNotes.length > 0 && pinnedNotes.length > 0 && (
                                <p className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    All Notes
                                </p>
                            )}
                            {unpinnedNotes.map((note) => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    isActive={note.id === activeNoteId}
                                    onSelect={onSelectNote}
                                    onDelete={onDeleteNote}
                                />
                            ))}
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

// Note card sub-component
const NoteCard: React.FC<{
    note: Note;
    isActive: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}> = ({ note, isActive, onSelect, onDelete }) => {
    return (
        <div
            className={cn(
                "group relative px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                isActive
                    ? "bg-primary/8 border border-primary/15"
                    : "hover:bg-muted/50 border border-transparent"
            )}
            onClick={() => onSelect(note.id)}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className={cn(
                        "text-sm font-medium truncate",
                        isActive ? "text-foreground" : "text-foreground/80"
                    )}>
                        {note.title || "Untitled"}
                    </p>
                    <p className="text-xs text-muted-foreground/70 line-clamp-2 mt-0.5 leading-relaxed">
                        {stripHtml(note.content) || "Empty note"}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-muted-foreground/50">
                            {formatDate(note.updated_at)}
                        </span>
                        {(note.tags || []).slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-[9px] h-4 px-1 border-border/40">
                                {tag}
                            </Badge>
                        ))}
                        {(note.tags || []).length > 2 && (
                            <span className="text-[9px] text-muted-foreground/40">+{note.tags.length - 2}</span>
                        )}
                    </div>
                </div>

                {/* Context menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive gap-2 text-xs"
                            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Pin indicator */}
            {note.is_pinned && (
                <Pin className="absolute top-2 right-2 h-3 w-3 text-primary/40" />
            )}
        </div>
    );
};
