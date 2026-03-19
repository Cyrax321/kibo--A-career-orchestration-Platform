import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bold, Italic, Underline, Heading1, Heading2, Heading3,
    List, ListOrdered, ListTodo, Code2, Table, Quote,
    Check, Pin, PinOff, Trash2, Tag, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SlashCommandMenu } from "./SlashCommandMenu";
import { ShareNoteDialog } from "./ShareNoteDialog";
import { PremiumGate } from "./PremiumGate";
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
    const editorRef = React.useRef<HTMLDivElement>(null);
    const [title, setTitle] = React.useState(note.title);
    const [showSlashMenu, setShowSlashMenu] = React.useState(false);
    const [slashQuery, setSlashQuery] = React.useState("");
    const [slashPosition, setSlashPosition] = React.useState({ top: 0, left: 0 });
    const [showTagInput, setShowTagInput] = React.useState(false);
    const [tagInput, setTagInput] = React.useState("");
    const slashStartRef = React.useRef<number | null>(null);

    // Track active formatting states
    const [activeFormats, setActiveFormats] = React.useState<Record<string, boolean>>({});

    const updateActiveFormats = React.useCallback(() => {
        const formats: Record<string, boolean> = {};
        try {
            formats.bold = document.queryCommandState("bold");
            formats.italic = document.queryCommandState("italic");
            formats.underline = document.queryCommandState("underline");
            formats.insertUnorderedList = document.queryCommandState("insertUnorderedList");
            formats.insertOrderedList = document.queryCommandState("insertOrderedList");

            const blockType = document.queryCommandValue("formatBlock")?.toLowerCase() || "";
            formats.h1 = blockType === "h1";
            formats.h2 = blockType === "h2";
            formats.h3 = blockType === "h3";
            formats.blockquote = blockType === "blockquote";

            // Check if cursor is inside a pre/code block
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                let node: Node | null = sel.anchorNode;
                formats.code = false;
                while (node && node !== editorRef.current) {
                    if (node instanceof HTMLElement) {
                        const tag = node.tagName.toLowerCase();
                        if (tag === "pre" || tag === "code") { formats.code = true; break; }
                    }
                    node = node.parentNode;
                }
            }
        } catch {
            // queryCommandState can throw in some browsers
        }
        setActiveFormats(formats);
    }, []);

    // Sync content when note changes
    React.useEffect(() => {
        setTitle(note.title);
        if (editorRef.current && editorRef.current.innerHTML !== note.content) {
            editorRef.current.innerHTML = note.content;
        }
    }, [note.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Update toolbar active states when selection changes (cursor moves, text selected)
    React.useEffect(() => {
        const handler = () => {
            // Only update if the selection is within our editor
            const sel = window.getSelection();
            if (sel && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
                updateActiveFormats();
            }
        };
        document.addEventListener("selectionchange", handler);
        return () => document.removeEventListener("selectionchange", handler);
    }, [updateActiveFormats]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        onAutoSave(note.id, { title: newTitle });
    };

    const handleContentInput = () => {
        if (!editorRef.current) return;
        const content = editorRef.current.innerHTML;
        onAutoSave(note.id, { content });
        updateActiveFormats();
    };

    // Toolbar commands
    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleContentInput();
    };

    const insertBlock = (html: string) => {
        document.execCommand("insertHTML", false, html);
        editorRef.current?.focus();
        handleContentInput();
    };

    const handleSlashCommand = (commandId: string) => {
        // Remove the slash text
        if (editorRef.current && slashStartRef.current !== null) {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                const textNode = range.startContainer;
                if (textNode.nodeType === Node.TEXT_NODE) {
                    const text = textNode.textContent || "";
                    const slashIdx = text.lastIndexOf("/");
                    if (slashIdx >= 0) {
                        textNode.textContent = text.substring(0, slashIdx);
                        range.setStart(textNode, slashIdx);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            }
        }

        switch (commandId) {
            case "heading1":
                insertBlock("<h1 class='note-h1'>Heading 1</h1><p><br></p>");
                break;
            case "heading2":
                insertBlock("<h2 class='note-h2'>Heading 2</h2><p><br></p>");
                break;
            case "heading3":
                insertBlock("<h3 class='note-h3'>Heading 3</h3><p><br></p>");
                break;
            case "todo":
                insertBlock(
                    `<div class="note-checklist"><label class="note-check-item"><input type="checkbox" /><span>To-do item</span></label></div><p><br></p>`
                );
                break;
            case "bullet":
                document.execCommand("insertUnorderedList", false);
                break;
            case "numbered":
                document.execCommand("insertOrderedList", false);
                break;
            case "code":
                insertBlock(`<pre class="note-code-block"><code>// code here</code></pre><p><br></p>`);
                break;
            case "table":
                insertBlock(
                    `<table class="note-table"><thead><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr></thead><tbody><tr><td>Cell</td><td>Cell</td><td>Cell</td></tr><tr><td>Cell</td><td>Cell</td><td>Cell</td></tr></tbody></table><p><br></p>`
                );
                break;
            case "divider":
                insertBlock(`<hr class="note-divider" /><p><br></p>`);
                break;
            case "quote":
                insertBlock(`<blockquote class="note-quote">Quote text</blockquote><p><br></p>`);
                break;
        }

        setShowSlashMenu(false);
        setSlashQuery("");
        slashStartRef.current = null;
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Slash command trigger
        if (e.key === "/" && !showSlashMenu) {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                setSlashPosition({
                    top: rect.bottom + 8,
                    left: rect.left,
                });
                setShowSlashMenu(true);
                setSlashQuery("");
                slashStartRef.current = range.startOffset;
            }
        }

        // Close slash menu on escape
        if (e.key === "Escape" && showSlashMenu) {
            setShowSlashMenu(false);
            setSlashQuery("");
            slashStartRef.current = null;
        }

        // Keyboard shortcuts
        if (e.metaKey || e.ctrlKey) {
            if (e.key === "b") { e.preventDefault(); execCommand("bold"); }
            if (e.key === "i") { e.preventDefault(); execCommand("italic"); }
            if (e.key === "u") { e.preventDefault(); execCommand("underline"); }
        }
    };

    const handleInput = (e: React.FormEvent) => {
        handleContentInput();

        // Update slash query
        if (showSlashMenu && editorRef.current) {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                const text = range.startContainer.textContent || "";
                const slashIdx = text.lastIndexOf("/");
                if (slashIdx >= 0) {
                    setSlashQuery(text.substring(slashIdx + 1));
                } else {
                    setShowSlashMenu(false);
                    setSlashQuery("");
                }
            }
        }
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

    // Each toolbar button now has an `activeKey` to check against `activeFormats`
    const toolbarButtons = [
        { icon: Bold, command: () => execCommand("bold"), label: "Bold", activeKey: "bold" },
        { icon: Italic, command: () => execCommand("italic"), label: "Italic", activeKey: "italic" },
        { icon: Underline, command: () => execCommand("underline"), label: "Underline", activeKey: "underline" },
        "sep",
        { icon: Heading1, command: () => execCommand("formatBlock", "h1"), label: "H1", activeKey: "h1" },
        { icon: Heading2, command: () => execCommand("formatBlock", "h2"), label: "H2", activeKey: "h2" },
        { icon: Heading3, command: () => execCommand("formatBlock", "h3"), label: "H3", activeKey: "h3" },
        "sep",
        { icon: List, command: () => execCommand("insertUnorderedList"), label: "Bullet", activeKey: "insertUnorderedList" },
        { icon: ListOrdered, command: () => execCommand("insertOrderedList"), label: "Numbered", activeKey: "insertOrderedList" },
        { icon: ListTodo, command: () => handleSlashCommand("todo"), label: "Checklist" },
        "sep",
        { icon: Code2, command: () => handleSlashCommand("code"), label: "Code", activeKey: "code" },
        { icon: Quote, command: () => handleSlashCommand("quote"), label: "Quote", activeKey: "blockquote" },
        { icon: Table, command: () => handleSlashCommand("table"), label: "Table" },
    ];

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

            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-6 py-2 border-b border-border/30 overflow-x-auto">
                {toolbarButtons.map((btn, i) =>
                    btn === "sep" ? (
                        <Separator key={i} orientation="vertical" className="mx-1 h-5" />
                    ) : (() => {
                        const b = btn as { icon: any; command: () => void; label: string; activeKey?: string };
                        const isActive = b.activeKey ? activeFormats[b.activeKey] : false;
                        return (
                            <Button
                                key={i}
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-8 w-8 transition-all duration-150",
                                    isActive
                                        ? "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary ring-1 ring-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                )}
                                onClick={b.command}
                                title={b.label}
                            >
                                {React.createElement(b.icon, { className: "h-4 w-4" })}
                            </Button>
                        );
                    })()
                )}
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-12 lg:py-8">
                {/* Title */}
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Untitled"
                    className="w-full text-3xl font-bold text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40 mb-2"
                />

                {/* Tags */}
                <div className="flex items-center gap-1.5 mb-6 flex-wrap">
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
                    <div className="mb-4 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 text-xs text-primary flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        Linked to application
                    </div>
                )}

                {/* ContentEditable editor */}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="note-editor min-h-[60vh] outline-none text-foreground leading-relaxed"
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onClick={() => {
                        if (showSlashMenu) {
                            setShowSlashMenu(false);
                            setSlashQuery("");
                        }
                    }}
                    data-placeholder="Start writing, or type / for commands..."
                />

                {/* Slash command menu */}
                {showSlashMenu && (
                    <SlashCommandMenu
                        position={slashPosition}
                        query={slashQuery}
                        onSelect={handleSlashCommand}
                        onClose={() => {
                            setShowSlashMenu(false);
                            setSlashQuery("");
                            slashStartRef.current = null;
                        }}
                    />
                )}
            </div>

            {/* Bottom premium hints */}
            <div className="px-6 py-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground/60">
                <span>Type <kbd className="px-1 py-0.5 rounded border border-border/40 text-[10px] font-mono">/</kbd> for commands</span>
                <span>
                    {note.content ? `${note.content.replace(/<[^>]*>/g, "").length} characters` : "Empty note"}
                </span>
            </div>
        </div>
    );
};
