export type LoginStatus = 'Anonymous' | 'HalfLogin' | 'FullLogin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthSDK {
  getLoginStatus(): Promise<LoginStatus>;
  getUserInfo(): Promise<User | null>;
  openLogin(): Promise<void>;
  logout(): Promise<void>;
  on(event: 'signIn' | 'signOut', callback: (user?: User) => void): () => void;
}

class DefaultAuthSDK implements AuthSDK {
  private status: LoginStatus = 'FullLogin';
  private currentUser: User = {
    id: 'usr_scholar_01',
    name: 'Dr. Amara Diallo',
    email: 'amara.diallo@holokai.org',
    role: 'Senior Epigrapher',
  };
  private listeners: Map<string, Set<(user?: User) => void>> = new Map();

  async getLoginStatus(): Promise<LoginStatus> {
    return this.status;
  }

  async getUserInfo(): Promise<User | null> {
    return this.currentUser;
  }

  async openLogin(): Promise<void> {
    this.status = 'FullLogin';
    this.emit('signIn', this.currentUser);
  }

  async logout(): Promise<void> {
    this.status = 'Anonymous';
    this.emit('signOut');
  }

  on(event: 'signIn' | 'signOut', callback: (user?: User) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  private emit(event: 'signIn' | 'signOut', user?: User) {
    this.listeners.get(event)?.forEach((cb) => cb(user));
  }
}

export const authSDK = new DefaultAuthSDK();
