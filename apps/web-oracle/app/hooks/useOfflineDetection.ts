'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface OfflineDetectionHook {
  isOnline: boolean;
  isOffline: boolean;
  showOfflineBanner: boolean;
  dismissBanner: () => void;
}

export function useOfflineDetection(): OfflineDetectionHook {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Initial check
    setIsOnline(navigator.onLine);

    // Event listeners for online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connectivity check (every 30 seconds)
    const checkConnectivity = async () => {
      try {
        const response = await fetch('/api/health', {
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(5000)
        });
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
        setShowOfflineBanner(true);
      }
    };

    const intervalId = setInterval(checkConnectivity, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  const dismissBanner = () => {
    setShowOfflineBanner(false);
  };

  return {
    isOnline,
    isOffline: !isOnline,
    showOfflineBanner,
    dismissBanner
  };
}

/**
 * Offline Banner Component
 */
export function OfflineBanner({ show, onDismiss }: { show: boolean; onDismiss: () => void }) {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/95 backdrop-blur-sm border-b border-amber-600">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WifiOff className="w-5 h-5 text-white" />
          <div>
            <p className="text-white font-medium">You're offline</p>
            <p className="text-amber-100 text-sm">Some features may not be available</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

/**
 * Online Status Indicator Component
 */
export function OnlineStatusIndicator() {
  const { isOnline } = useOfflineDetection();

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
      {isOnline ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">Online</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <WifiOff className="w-4 h-4 text-red-400" />
          <span className="text-xs text-red-400 font-medium">Offline</span>
        </>
      )}
    </div>
  );
}
