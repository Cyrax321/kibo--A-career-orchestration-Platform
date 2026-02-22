import * as React from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { NotificationBell } from "../notifications/NotificationBell";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useAppNotifications } from "@/hooks/useAppNotifications";

interface AppLayoutProps {
  children: React.ReactNode;
}

const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { state } = useSidebar();

  // Only use the base route segment for transitions (e.g. /notes, /dashboard)
  // This prevents sub-route changes like /notes → /notes/uuid from triggering re-mounts
  const baseRoute = "/" + (location.pathname.split("/")[1] || "");

  return (
    <div className="flex min-h-screen flex-1 min-w-0 flex-col overflow-hidden">
      {/* Header with sidebar trigger and notifications */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-white/20 bg-white/40 px-4 backdrop-blur-xl lg:px-6">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="flex-1" />
        <NotificationBell />
      </header>

      {/* Main content area */}
      <main className="flex-1">
        <div key={baseRoute} className="h-full animate-in fade-in duration-300">
          {children}
        </div>
      </main>
    </div>
  );
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  // Initialize app-wide notifications listener
  useAppNotifications();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden">
        <AppSidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
};

export { AppLayout };
