import { useEffect, useCallback } from "react";

export function usePushNotifications() {
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }, []);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (Notification.permission === "granted") {
        // Try using service worker for persistent notifications
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, {
              icon: "/pwa-192x192.svg",
              badge: "/pwa-192x192.svg",
              ...options,
            });
          });
        } else {
          // Fallback to regular notification
          new Notification(title, {
            icon: "/pwa-192x192.svg",
            ...options,
          });
        }
      }
    },
    []
  );

  const showMessageNotification = useCallback(
    (senderName: string, messagePreview: string, conversationId?: string) => {
      showNotification(`New message from ${senderName}`, {
        body: messagePreview.length > 100 ? `${messagePreview.slice(0, 100)}...` : messagePreview,
        tag: `message-${conversationId || "new"}`,
        data: { type: "message", conversationId },
      });
    },
    [showNotification]
  );

  // Request permission on mount if not already granted
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      // Don't auto-request, let user action trigger it
    }
  }, []);

  return {
    isSupported: "Notification" in window,
    permission: "Notification" in window ? Notification.permission : "denied",
    requestPermission,
    showNotification,
    showMessageNotification,
  };
}
