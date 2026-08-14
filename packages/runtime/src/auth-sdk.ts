export type LoginStatus = 'Anonymous' | 'HalfLogin' | 'FullLogin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization?: string;
  accessTier?: string;
}

/**
 * @deprecated The AuthSDK interface and default mock implementation have been removed 
 * in favor of Clerk Next.js (`@clerk/nextjs`).
 * 
 * Please use the Clerk hooks (`useUser`, `useAuth`) or components 
 * (`<SignInButton>`, `<UserButton>`) directly in your application components.
 */
export interface AuthSDK {
  getLoginStatus(): Promise<LoginStatus>;
  getUserInfo(): Promise<User | null>;
  openLogin(user?: Partial<User>, status?: LoginStatus): Promise<void>;
  logout(): Promise<void>;
  on(event: 'signIn' | 'signOut', callback: (user?: User) => void): () => void;
}
