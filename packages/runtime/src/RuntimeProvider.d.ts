import React from 'react';
import { LoginStatus, User } from './auth-sdk';
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
export declare function RuntimeProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useRuntime(): RuntimeContextState;
//# sourceMappingURL=RuntimeProvider.d.ts.map