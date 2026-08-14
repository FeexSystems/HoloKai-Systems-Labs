const DEFAULT_SCHOLAR = {
    id: 'usr_scholar_01',
    name: 'Dr. Amara Diallo',
    email: 'amara.diallo@holokai.org',
    role: 'Senior Epigrapher & Archaeoastronomer',
    organization: 'HoloKai Pan-African Research Council',
    accessTier: 'Tier 1 · Full Civilizational Access',
};
class DefaultAuthSDK {
    status = 'FullLogin';
    currentUser = DEFAULT_SCHOLAR;
    listeners = new Map();
    constructor() {
        if (typeof window !== 'undefined') {
            const savedStatus = localStorage.getItem('holokai_auth_status');
            const savedUser = localStorage.getItem('holokai_auth_user');
            if (savedStatus) {
                this.status = savedStatus;
            }
            if (savedUser) {
                try {
                    this.currentUser = JSON.parse(savedUser);
                }
                catch { }
            }
        }
    }
    async getLoginStatus() {
        return this.status;
    }
    async getUserInfo() {
        return this.status === 'Anonymous' ? null : this.currentUser;
    }
    async openLogin(userPartial, status = 'FullLogin') {
        this.status = status;
        this.currentUser = {
            ...DEFAULT_SCHOLAR,
            ...userPartial,
        };
        if (typeof window !== 'undefined') {
            localStorage.setItem('holokai_auth_status', this.status);
            localStorage.setItem('holokai_auth_user', JSON.stringify(this.currentUser));
        }
        this.emit('signIn', this.currentUser);
    }
    async logout() {
        this.status = 'Anonymous';
        if (typeof window !== 'undefined') {
            localStorage.setItem('holokai_auth_status', 'Anonymous');
            localStorage.removeItem('holokai_auth_user');
        }
        this.emit('signOut');
    }
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
        return () => this.listeners.get(event)?.delete(callback);
    }
    emit(event, user) {
        this.listeners.get(event)?.forEach((cb) => cb(user));
    }
}
export const authSDK = new DefaultAuthSDK();
