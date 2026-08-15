import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAnalytics, isSupported as isAnalyticsSupported, logEvent } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
  projectId: "gen-lang-client-0948281794",
  appId: "1:69779680245:web:97c736b2418b1a25528ebc",
  apiKey: "AIzaSyAY5G-jrg4FQjYt7WZdXSCmK4lSj6ZsuxE",
  authDomain: "gen-lang-client-0948281794.firebaseapp.com",
  firestoreDatabaseId: "(default)",
  storageBucket: "gen-lang-client-0948281794.firebasestorage.app",
  messagingSenderId: "69779680245",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const functions = getFunctions(app);

// Initialize Analytics & Performance in browser environments safely
let analyticsInstance = null;
let perfInstance = null;

if (typeof window !== 'undefined') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  });
  try {
    perfInstance = getPerformance(app);
  } catch (e) {
    // SSR or unsupported environment guard
  }
}

export const analytics = analyticsInstance;
export const perf = perfInstance;

let dbInstance;
try {
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
} catch (err) {
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  httpsCallable,
  logEvent
};

