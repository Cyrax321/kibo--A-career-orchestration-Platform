import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heading1, Heading2, Heading3, ListTodo, Code2, Table,
    Minus, Quote, List, ListOrdered, Image as ImageIcon,
} from "lucide-react";

interface SlashCommandMenuProps {
    position: { top: number; left: number };
    query: string;
    onSelect: (command: string) => void;
    onClose: () => void;
}

const COMMANDS = [
    { id: "heading1", label: "Heading 1", description: "Large section heading", icon: Heading1, shortcut: "/h1" },
    { id: "heading2", label: "Heading 2", description: "Medium section heading", icon: Heading2, shortcut: "/h2" },
    { id: "heading3", label: "Heading 3", description: "Small section heading", icon: Heading3, shortcut: "/h3" },
    { id: "todo", label: "To-do List", description: "Track tasks with checkboxes", icon: ListTodo, shortcut: "/todo" },
    { id: "bullet", label: "Bullet List", description: "Simple bullet list", icon: List, shortcut: "/list" },
    { id: "numbered", label: "Numbered List", description: "Numbered list", icon: ListOrdered, shortcut: "/num" },
    { id: "code", label: "Code Block", description: "Capture a code snippet", icon: Code2, shortcut: "/code" },
    { id: "table", label: "Table", description: "Add a simple table", icon: Table, shortcut: "/table" },
    { id: "divider", label: "Divider", description: "Visual divider line", icon: Minus, shortcut: "/divider" },
    { id: "quote", label: "Quote", description: "Capture a quote", icon: Quote, shortcut: "/quote" },
];

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
    position,
    query,
    onSelect,
    onClose,
}) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const menuRef = React.useRef<HTMLDivElement>(null);

    const filteredCommands = COMMANDS.filter(
        (cmd) =>
            cmd.label.toLowerCase().includes(query.toLowerCase()) ||
            cmd.shortcut.includes(query.toLowerCase())
    );

    React.useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    onSelect(filteredCommands[selectedIndex].id);
                }
            } else if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [filteredCommands, selectedIndex, onSelect, onClose]);

    // Scroll selected item into view
    React.useEffect(() => {
        const selected = menuRef.current?.children[selectedIndex] as HTMLElement;
        selected?.scrollIntoView({ block: "nearest" });
    }, [selectedIndex]);

    if (filteredCommands.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="fixed z-50 w-72 max-h-80 overflow-y-auto rounded-xl border border-border/60 bg-white/95 backdrop-blur-xl shadow-xl shadow-black/5"
                style={{ top: position.top, left: position.left }}
            >
                <div className="p-1.5">
                    <p className="px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Commands
                    </p>
                    {filteredCommands.map((cmd, index) => (
                        <button
                            key={cmd.id}
                            className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${index === selectedIndex
                                    ? "bg-primary/8 text-foreground"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                }`}
                            onClick={() => onSelect(cmd.id)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${index === selectedIndex ? "bg-primary/10" : "bg-muted"
                                }`}>
                                <cmd.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{cmd.label}</p>
                                <p className="text-[11px] text-muted-foreground truncate">{cmd.description}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground/60 font-mono">{cmd.shortcut}</span>
                        </button>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
