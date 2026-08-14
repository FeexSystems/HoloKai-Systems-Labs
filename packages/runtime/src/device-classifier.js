/**
 * Planetary UI Device Classifier
 * Classifies user-agent & viewport capabilities to optimize micro-frontend bundles.
 */
export function classifyDevice(userAgent, width) {
    const ua = userAgent.toLowerCase();
    const isBot = /bot|googlebot|crawler|spider|slurp|bingbot/i.test(ua);
    if (isBot) {
        return { deviceClass: 'bot', isTouch: false, viewportWidth: width };
    }
    const isMobile = /iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua) || (width !== undefined && width < 768);
    const isTablet = /ipad|android(?!.*mobile)/i.test(ua) || (width !== undefined && width >= 768 && width < 1024);
    let deviceClass = 'desktop';
    if (isMobile)
        deviceClass = 'mobile';
    else if (isTablet)
        deviceClass = 'tablet';
    const isTouch = isMobile || isTablet || (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
    return {
        deviceClass,
        isTouch,
        viewportWidth: width,
    };
}
