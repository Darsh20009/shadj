import { useEffect } from "react";
import { useLocation } from "wouter";
import { useTrackEvent } from "@workspace/api-client-react";

export function getSessionId() {
  let sessionId = localStorage.getItem("shadj_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("shadj_session_id", sessionId);
  }
  return sessionId;
}

export function useSessionTracker() {
  const [location] = useLocation();
  const trackEvent = useTrackEvent();

  useEffect(() => {
    const sessionId = getSessionId();
    trackEvent.mutate({
      data: {
        sessionId,
        page: location,
        event: "page_view",
      }
    });
  }, [location, trackEvent.mutate]);
}
