/**
 * HoloKai Google Analytics & Conversion Telemetry Client
 * Handles structured event tracking for public archive engagement and progressive auth conversion funnels.
 */

export function trackEvent(eventName, eventParams = {}) {
  if (typeof window === 'undefined') return;

  // Google Analytics (gtag.js)
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }

  // Debug logging in development mode
  if (import.meta.env.DEV) {
    console.log(`[HoloKai Telemetry] Event: ${eventName}`, eventParams);
  }
}

export function trackCodexView(codexId, civilization, era) {
  trackEvent('view_codex', {
    codex_id: codexId,
    civilization: civilization || 'Pan-African',
    era: era || 'Ancient',
  });
}

export function trackArchiveSearch(query, activeFilter, resultCount) {
  trackEvent('archive_search', {
    search_term: query,
    civilization_filter: activeFilter || 'all',
    result_count: resultCount || 0,
  });
}

export function trackSimulationRun(simulationType, preset) {
  trackEvent('run_simulation', {
    simulation_type: simulationType || 'quantum_modeling',
    preset: preset || 'default',
  });
}

export function trackAuthConversionPrompt(triggerSource) {
  trackEvent('auth_conversion_prompt', {
    trigger_source: triggerSource || 'progressive_softwall',
  });
}

export function trackSignUp(method) {
  trackEvent('completed_sign_up', {
    method: method || 'google',
  });
}
