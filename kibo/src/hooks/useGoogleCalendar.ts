import * as React from "react";
import { supabase } from "@/integrations/supabase/client";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// Scopes needed for Calendar read/write
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
].join(" ");

interface GoogleCalendarState {
  connected: boolean;
  googleEmail: string | null;
  loading: boolean;
  syncing: boolean;
}

interface UseGoogleCalendarReturn extends GoogleCalendarState {
  connect: () => void;
  disconnect: () => Promise<void>;
  syncEvent: (event: {
    event_id: string;
    title: string;
    description?: string | null;
    event_date: string;
    event_time?: string | null;
    event_type: string;
  }) => Promise<{ synced: boolean; error?: string }>;
  deleteGoogleEvent: (googleEventId: string) => Promise<boolean>;
  updateGoogleEvent: (event: {
    google_event_id: string;
    title: string;
    description?: string | null;
    event_date: string;
    event_time?: string | null;
    event_type: string;
  }) => Promise<{ synced: boolean }>;
  checkStatus: () => Promise<void>;
}

export function useGoogleCalendar(): UseGoogleCalendarReturn {
  const [state, setState] = React.useState<GoogleCalendarState>({
    connected: false,
    googleEmail: null,
    loading: true,
    syncing: false,
  });

  // Call the edge function with proper error handling
  const callEdgeFunction = React.useCallback(async (body: Record<string, unknown>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const resp = await supabase.functions.invoke("google-calendar", {
      body,
    });

    // supabase.functions.invoke doesn't throw on non-2xx, so check manually
    if (resp.error) {
      console.error("[useGoogleCalendar] Edge function error:", resp.error);
      throw resp.error;
    }
    return resp.data;
  }, []);

  // Check connection status
  const checkStatus = React.useCallback(async () => {
    try {
      const data = await callEdgeFunction({ action: "check_status" });
      setState((prev) => ({
        ...prev,
        connected: data.connected,
        googleEmail: data.google_email || null,
        loading: false,
      }));
    } catch (err) {
      console.error("[useGoogleCalendar] Status check failed:", err);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [callEdgeFunction]);

  // On mount: check for OAuth callback code first, then check status
  React.useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const stateParam = params.get("state");

      if (code && stateParam === "google_calendar_connect") {
        // Clean URL immediately
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("code");
        cleanUrl.searchParams.delete("state");
        cleanUrl.searchParams.delete("scope");
        window.history.replaceState({}, "", cleanUrl.pathname);

        setState((prev) => ({ ...prev, loading: true }));

        try {
          console.log("[useGoogleCalendar] Exchanging OAuth code...");
          const data = await callEdgeFunction({
            action: "exchange_token",
            code,
            redirect_uri: `${window.location.origin}/schedule`,
          });
          console.log("[useGoogleCalendar] Exchange result:", data);

          setState({
            connected: data.connected,
            googleEmail: data.google_email || null,
            loading: false,
            syncing: false,
          });
        } catch (err) {
          console.error("[useGoogleCalendar] Token exchange failed:", err);
          setState((prev) => ({ ...prev, loading: false }));
        }
      } else {
        // No OAuth callback, just check connection status
        await checkStatus();
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open Google OAuth consent screen
  const connect = React.useCallback(() => {
    const redirectUri = `${window.location.origin}/schedule`;
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: GOOGLE_SCOPES,
      access_type: "offline",
      prompt: "consent",
      state: "google_calendar_connect",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }, []);

  // Disconnect Google account
  const disconnect = React.useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await callEdgeFunction({ action: "disconnect" });
      setState({ connected: false, googleEmail: null, loading: false, syncing: false });
    } catch (err) {
      console.error("[useGoogleCalendar] Disconnect failed:", err);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [callEdgeFunction]);

  // Sync an event to Google Calendar
  const syncEvent = React.useCallback(async (event: {
    event_id: string;
    title: string;
    description?: string | null;
    event_date: string;
    event_time?: string | null;
    event_type: string;
  }): Promise<{ synced: boolean; error?: string }> => {
    setState((prev) => ({ ...prev, syncing: true }));
    try {
      const data = await callEdgeFunction({
        action: "create_event",
        ...event,
      });
      setState((prev) => ({ ...prev, syncing: false }));
      return { synced: data.synced, error: data.error };
    } catch (err) {
      console.error("[useGoogleCalendar] Sync failed:", err);
      setState((prev) => ({ ...prev, syncing: false }));
      return { synced: false, error: String(err) };
    }
  }, [callEdgeFunction]);

  // Delete an event from Google Calendar
  const deleteGoogleEvent = React.useCallback(async (googleEventId: string): Promise<boolean> => {
    try {
      const data = await callEdgeFunction({
        action: "delete_event",
        google_event_id: googleEventId,
      });
      return data.deleted;
    } catch (err) {
      console.error("[useGoogleCalendar] Delete failed:", err);
      return false;
    }
  }, [callEdgeFunction]);

  // Update an event in Google Calendar
  const updateGoogleEvent = React.useCallback(async (event: {
    google_event_id: string;
    title: string;
    description?: string | null;
    event_date: string;
    event_time?: string | null;
    event_type: string;
  }): Promise<{ synced: boolean }> => {
    try {
      const data = await callEdgeFunction({
        action: "update_event",
        ...event,
      });
      return { synced: data.synced };
    } catch (err) {
      console.error("[useGoogleCalendar] Update failed:", err);
      return { synced: false };
    }
  }, [callEdgeFunction]);

  return {
    ...state,
    connect,
    disconnect,
    syncEvent,
    deleteGoogleEvent,
    updateGoogleEvent,
    checkStatus,
  };
}
