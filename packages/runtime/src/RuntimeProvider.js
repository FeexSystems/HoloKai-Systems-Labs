'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { authSDK } from './auth-sdk';
import { initDOMAnalyticsTracking } from './analytics-sdk';
const RuntimeContext = createContext(null);
export function RuntimeProvider({ children }) {
    const [theme, setTheme] = useState('dark');
    const [locale, setLocale] = useState('EN');
    const [currency, setCurrency] = useState('USD');
    const [loginStatus, setLoginStatus] = useState('FullLogin');
    const [user, setUser] = useState(null);
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
    return (_jsx(RuntimeContext.Provider, { value: {
            theme,
            setTheme,
            locale,
            setLocale,
            currency,
            setCurrency,
            loginStatus,
            user,
            featureFlags,
        }, children: _jsx("div", { "data-theme": theme, className: "min-h-screen bg-[#05050a] text-white", children: children }) }));
}
export function useRuntime() {
    const context = useContext(RuntimeContext);
    if (!context) {
        throw new Error('useRuntime must be used within a RuntimeProvider');
    }
    return context;
}
