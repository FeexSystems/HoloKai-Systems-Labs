class DefaultAnalyticsSDK {
    track(event) {
        if (typeof window !== 'undefined') {
            console.log('[Analytics Track]', event);
        }
    }
    page(path) {
        if (typeof window !== 'undefined') {
            console.log('[Analytics Page]', path);
        }
    }
    identify(userId) {
        if (typeof window !== 'undefined') {
            console.log('[Analytics Identify]', userId);
        }
    }
}
export const analyticsSDK = new DefaultAnalyticsSDK();
// DOM tracking listener setup helper
export function initDOMAnalyticsTracking() {
    if (typeof window === 'undefined')
        return () => { };
    const handleClick = (e) => {
        const target = e.target?.closest('[data-track-el]');
        if (target) {
            const el = target.getAttribute('data-track-el') || 'unknown';
            const ec = target.getAttribute('data-track-ec') || 'interaction';
            const ea = target.getAttribute('data-track-ea') || 'click';
            analyticsSDK.track({ category: ec, action: ea, label: el });
        }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
}
