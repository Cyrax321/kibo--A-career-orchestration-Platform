import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Share2, Copy, Globe, Lock, Check, Link2, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useNotes, type NoteShare } from "@/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";

interface ShareNoteDialogProps {
    noteId: string;
    noteTitle: string;
}

export const ShareNoteDialog: React.FC<ShareNoteDialogProps> = ({ noteId, noteTitle }) => {
    const { shareNote, getShareForNote, disableShare } = useNotes();
    const { toast } = useToast();
    const [share, setShare] = React.useState<NoteShare | null>(null);
    const [isPublic, setIsPublic] = React.useState(false);
    const [accessLevel, setAccessLevel] = React.useState<"view" | "edit">("view");
    const [copied, setCopied] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const shareUrl = share ? `${window.location.origin}/shared/${share.share_token}` : "";

    const loadShare = React.useCallback(async () => {
        const existing = await getShareForNote(noteId);
        if (existing) {
            setShare(existing);
            setIsPublic(true);
            setAccessLevel(existing.access_level as "view" | "edit");
        }
    }, [noteId, getShareForNote]);

    React.useEffect(() => {
        if (open) loadShare();
    }, [open, loadShare]);

    const handleTogglePublic = async (enabled: boolean) => {
        setLoading(true);
        if (enabled) {
            const newShare = await shareNote(noteId, accessLevel);
            if (newShare) {
                setShare(newShare);
                setIsPublic(true);
                toast({ title: "Note shared!", description: "Anyone with the link can view this note." });
            }
        } else {
            if (share) {
                await disableShare(share.id);
                setShare(null);
                setIsPublic(false);
                toast({ title: "Sharing disabled" });
            }
        }
        setLoading(false);
    };

    const handleCopyLink = async () => {
        if (!shareUrl) return;
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast({ title: "Link copied!" });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAccessChange = async (level: "view" | "edit") => {
        setAccessLevel(level);
        if (isPublic) {
            const updated = await shareNote(noteId, level);
            if (updated) setShare(updated);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-primary" />
                        Share Note
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-5 py-2">
                    {/* Note info */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Link2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{noteTitle || "Untitled Note"}</p>
                            <p className="text-xs text-muted-foreground">Share via link</p>
                        </div>
                    </div>

                    {/* Public toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isPublic ? (
                                <Globe className="h-4 w-4 text-success" />
                            ) : (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div>
                                <p className="text-sm font-medium">{isPublic ? "Public" : "Private"}</p>
                                <p className="text-xs text-muted-foreground">
                                    {isPublic ? "Anyone with the link can access" : "Only you can access this note"}
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={isPublic}
                            onCheckedChange={handleTogglePublic}
                            disabled={loading}
                        />
                    </div>

                    {/* Access level */}
                    <AnimatePresence>
                        {isPublic && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3"
                            >
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Access Level</p>
                                <div className="flex gap-2">
                                    <Button
                                        variant={accessLevel === "view" ? "default" : "outline"}
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleAccessChange("view")}
                                    >
                                        View only
                                    </Button>
                                    <Button
                                        variant={accessLevel === "edit" ? "default" : "outline"}
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleAccessChange("edit")}
                                    >
                                        Can edit
                                    </Button>
                                </div>

                                {/* Share link */}
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-2.5 rounded-lg bg-muted/50 border border-border/50 text-xs font-mono text-muted-foreground truncate">
                                        {shareUrl}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="shrink-0 gap-1.5"
                                        onClick={handleCopyLink}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-3.5 w-3.5 text-success" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3.5 w-3.5" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full gap-2 text-muted-foreground"
                                    onClick={() => window.open(shareUrl, "_blank")}
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Open shared page
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
};
