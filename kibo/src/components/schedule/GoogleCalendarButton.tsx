import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Check, Loader2, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GoogleCalendarButtonProps {
  connected: boolean;
  googleEmail: string | null;
  loading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  className?: string;
}

const GoogleCalendarButton: React.FC<GoogleCalendarButtonProps> = ({
  connected,
  googleEmail,
  loading,
  onConnect,
  onDisconnect,
  className,
}) => {
  const [showDisconnect, setShowDisconnect] = React.useState(false);

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled className={cn("gap-2", className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking...
      </Button>
    );
  }

  if (connected) {
    return (
      <div
        className={cn("relative", className)}
        onMouseEnter={() => setShowDisconnect(true)}
        onMouseLeave={() => setShowDisconnect(false)}
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-success/30 bg-success/5 text-success hover:bg-success/10 hover:text-success"
        >
          <Check className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            {googleEmail ? googleEmail : "Google Connected"}
          </span>
          <span className="sm:hidden">Connected</span>
        </Button>

        <AnimatePresence>
          {showDisconnect && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-1 z-50"
            >
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 shadow-lg whitespace-nowrap"
                onClick={onDisconnect}
              >
                <LogOut className="h-3.5 w-3.5" />
                Disconnect Google
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onConnect}
      className={cn(
        "gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5",
        className
      )}
    >
      <Calendar className="h-4 w-4" />
      <span className="hidden sm:inline">Connect Google Calendar</span>
      <span className="sm:hidden">Google</span>
      <ExternalLink className="h-3 w-3 opacity-50" />
    </Button>
  );
};

export { GoogleCalendarButton };
