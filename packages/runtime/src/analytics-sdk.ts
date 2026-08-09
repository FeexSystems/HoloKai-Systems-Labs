export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export interface AnalyticsSDK {
  track(event: AnalyticsEvent): void;
  page(path: string): void;
  identify(userId: string): void;
}

class DefaultAnalyticsSDK implements AnalyticsSDK {
  track(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined') {
      console.log('[Analytics Track]', event);
    }
  }

  page(path: string): void {
    if (typeof window !== 'undefined') {
      console.log('[Analytics Page]', path);
    }
  }

  identify(userId: string): void {
    if (typeof window !== 'undefined') {
      console.log('[Analytics Identify]', userId);
    }
  }
}

export const analyticsSDK = new DefaultAnalyticsSDK();

// DOM tracking listener setup helper
export function initDOMAnalyticsTracking(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleClick = (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest('[data-track-el]');
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
