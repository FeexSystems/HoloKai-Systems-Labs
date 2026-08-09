'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authSDK, LoginStatus, User } from './auth-sdk';
import { analyticsSDK, initDOMAnalyticsTracking } from './analytics-sdk';

export interface RuntimeContextState {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  locale: string;
  setLocale: (locale: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  loginStatus: LoginStatus;
  user: User | null;
  featureFlags: Record<string, boolean>;
}

const RuntimeContext = createContext<RuntimeContextState | null>(null);

export function RuntimeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [locale, setLocale] = useState<string>('EN');
  const [currency, setCurrency] = useState<string>('USD');
  const [loginStatus, setLoginStatus] = useState<LoginStatus>('FullLogin');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    authSDK.getUserInfo().then(setUser);
    authSDK.getLoginStatus().then(setLoginStatus);
    const cleanupAnalytics = initDOMAnalyticsTracking();
    return () => cleanupAnalytics();
  }, []);

  const featureFlags = {
    spatial3DCanvas: true,
    beastModeDomainSearch: true,
    oracleMultiAgent: true,
    epistemicBadgeTooltip: true,
  };

  return (
    <RuntimeContext.Provider
      value={{
        theme,
        setTheme,
        locale,
        setLocale,
        currency,
        setCurrency,
        loginStatus,
        user,
        featureFlags,
      }}
    >
      <div data-theme={theme} className="min-h-screen bg-[#05050a] text-white">
        {children}
      </div>
    </RuntimeContext.Provider>
  );
}

export function useRuntime() {
  const context = useContext(RuntimeContext);
  if (!context) {
    throw new Error('useRuntime must be used within a RuntimeProvider');
  }
  return context;
}
