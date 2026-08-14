export type LoginStatus = 'Anonymous' | 'HalfLogin' | 'FullLogin';
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    organization?: string;
    accessTier?: string;
}
export interface AuthSDK {
    getLoginStatus(): Promise<LoginStatus>;
    getUserInfo(): Promise<User | null>;
    openLogin(user?: Partial<User>, status?: LoginStatus): Promise<void>;
    logout(): Promise<void>;
    on(event: 'signIn' | 'signOut', callback: (user?: User) => void): () => void;
}
declare class DefaultAuthSDK implements AuthSDK {
    private status;
    private currentUser;
    private listeners;
    constructor();
    getLoginStatus(): Promise<LoginStatus>;
    getUserInfo(): Promise<User | null>;
    openLogin(userPartial?: Partial<User>, status?: LoginStatus): Promise<void>;
    logout(): Promise<void>;
    on(event: 'signIn' | 'signOut', callback: (user?: User) => void): () => void;
    private emit;
}
export declare const authSDK: DefaultAuthSDK;
export {};
//# sourceMappingURL=auth-sdk.d.ts.map