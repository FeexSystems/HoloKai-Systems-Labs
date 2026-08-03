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

const firebaseConfig = {
  projectId: "third-glazing-k7c1c",
  appId: "1:427877407103:web:6ade611fbf8ce429e4e24a",
  apiKey: "AIzaSyAY5G-jrg4FQjYt7WZdXSCmK4lSj6ZsuxE",
  authDomain: "third-glazing-k7c1c.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-holokaioraclepor-d4cc5ca3-a018-4df2-9476-1d43f6f14cf1",
  storageBucket: "third-glazing-k7c1c.firebasestorage.app",
  messagingSenderId: "427877407103",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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
  onAuthStateChanged
};

