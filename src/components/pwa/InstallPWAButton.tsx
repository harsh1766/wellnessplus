import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show banner for iOS after a delay
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt on Android/Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSInstructions(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
        {showIOSInstructions ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-foreground">Install Wellness+</h3>
              <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li>1. Tap the <strong>Share</strong> button in Safari</li>
              <li>2. Scroll down and tap <strong>"Add to Home Screen"</strong></li>
              <li>3. Tap <strong>"Add"</strong> to install</li>
            </ol>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-sm">Install Wellness+</h3>
              <p className="text-xs text-muted-foreground">Add to home screen for quick access</p>
            </div>
            <Button size="sm" onClick={handleInstall} className="gap-2">
              <Download className="h-4 w-4" />
              Install
            </Button>
            <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
