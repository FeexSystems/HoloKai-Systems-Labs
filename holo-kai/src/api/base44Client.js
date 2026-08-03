import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

const hasValidToken = (t) => Boolean(t && t !== 'null' && t !== 'undefined' && String(t).trim() !== '');

// Suppress unauthenticated Base44 SDK error logs from polluting console error stream
if (typeof window !== 'undefined') {
  const origConsoleError = console.error;
  console.error = (...args) => {
    const fullText = args
      .map((a) => {
        if (typeof a === 'string') return a;
        try {
          return JSON.stringify(a);
        } catch (e) {
          return String(a);
        }
      })
      .join(' ');

    if (
      fullText.includes('[Base44 SDK Error]') ||
      fullText.includes('Authentication required to view users') ||
      fullText.includes('You must be logged in to perform this operation') ||
      fullText.includes('Unauthorized') ||
      fullText.includes('Missing Authorization header') ||
      fullText.includes('Network Error') ||
      fullText.includes('/api/apps/null') ||
      fullText.includes('Not Found')
    ) {
      // Intentionally ignore expected unauthenticated or unconfigured Base44 SDK errors
      return;
    }
    origConsoleError.apply(console, args);
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = typeof reason === 'string' ? reason : (reason?.message || JSON.stringify(reason || {}));
    if (
      msg.includes('Unauthorized') ||
      msg.includes('Missing Authorization header') ||
      msg.includes('Authentication required') ||
      msg.includes('Base44 SDK Error') ||
      msg.includes('You must be logged in')
    ) {
      event.preventDefault();
    }
  });
}

export const base44 = createClient({
  appId: appId || "6a5f9e40f0bb0b07b47ebf06",
  token: hasValidToken(token) ? token : undefined,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl,
  headers: {
    "api_key": "e49c3aecc9864f7eb9560aeaab9a666c"
  }
});

// Guard auth.me when no valid token exists so SDK analytics initialization won't trigger 401 requests
const origMe = base44.auth.me.bind(base44.auth);
base44.auth.me = async () => {
  const currentToken = typeof window !== 'undefined' 
    ? (localStorage.getItem('base44_access_token') || localStorage.getItem('token') || appParams.token)
    : appParams.token;
  if (!hasValidToken(currentToken)) {
    const err = new Error('Authentication required to view users');
    err.status = 401;
    return Promise.reject(err);
  }
  return origMe();
};

