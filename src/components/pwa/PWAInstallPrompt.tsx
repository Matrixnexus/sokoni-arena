import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Download, X } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuth } from "@/contexts/AuthContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const { user } = useAuth();
  const { isSupported, permission, requestPermission } = usePushNotifications();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user has dismissed the banner before
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  // Show notification permission banner for logged-in users
  useEffect(() => {
    if (user && isSupported && permission === "default") {
      const dismissed = localStorage.getItem("notification-prompt-dismissed");
      if (!dismissed) {
        // Delay showing to not overwhelm user
        const timer = setTimeout(() => {
          setShowNotificationBanner(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [user, isSupported, permission]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismissInstall = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowNotificationBanner(false);
    }
  };

  const handleDismissNotifications = () => {
    setShowNotificationBanner(false);
    localStorage.setItem("notification-prompt-dismissed", "true");
  };

  return (
    <>
      {/* Install App Banner */}
      {showBanner && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom">
          <div className="bg-card border shadow-lg rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Download className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">Install SokoniArena</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add to your home screen for the best experience
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mt-1 -mr-2"
                onClick={handleDismissInstall}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleDismissInstall}
              >
                Not Now
              </Button>
              <Button size="sm" className="flex-1" onClick={handleInstall}>
                Install
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Permission Banner */}
      {showNotificationBanner && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom">
          <div className="bg-card border shadow-lg rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">Enable Notifications</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Get notified when you receive new messages
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mt-1 -mr-2"
                onClick={handleDismissNotifications}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleDismissNotifications}
              >
                <BellOff className="h-4 w-4" />
                Not Now
              </Button>
              <Button size="sm" className="flex-1" onClick={handleEnableNotifications}>
                <Bell className="h-4 w-4" />
                Enable
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
