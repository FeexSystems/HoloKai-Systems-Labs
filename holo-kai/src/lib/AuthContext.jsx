import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';
import { auth, googleProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

const hasValidToken = (token) => {
  return Boolean(token && token !== 'null' && token !== 'undefined' && String(token).trim() !== '');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const mappedUser = {
          id: fbUser.uid,
          uid: fbUser.uid,
          email: fbUser.email,
          full_name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          displayName: fbUser.displayName,
          avatar: fbUser.photoURL,
          photoURL: fbUser.photoURL,
          provider: 'google'
        };
        setUser(mappedUser);
        setIsAuthenticated(true);

        // Sync user to Firestore
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              id: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || '',
              photoURL: fbUser.photoURL || '',
              createdAt: new Date().toISOString()
            });
          }
        } catch (e) {
          console.warn('Firestore user sync notice:', e);
        }
      } else {
        setFirebaseUser(null);
      }
    });

    checkAppState();
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setAuthError(null);
      const res = await signInWithPopup(auth, googleProvider);
      return res.user;
    } catch (err) {
      console.error('Google sign-in error:', err);
      setAuthError(err.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  const logoutFirebase = async () => {
    try {
      await firebaseSignOut(auth);
      setFirebaseUser(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      // In standalone / preview mode or when no valid app configuration/token exists, operate locally
      if (
        !appParams.appId ||
        appParams.appId === 'null' ||
        appParams.appId === 'undefined' ||
        !appParams.appBaseUrl ||
        typeof window === 'undefined' ||
        !hasValidToken(appParams.token)
      ) {
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
        setAuthChecked(true);
        return;
      }
      
      try {
        const appClient = createAxiosClient({
          baseURL: `/api/apps/public`,
          headers: {
            'X-App-Id': appParams.appId
          },
          token: hasValidToken(appParams.token) ? appParams.token : undefined,
          interceptResponses: false
        });
        
        const publicSettings = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        setAppPublicSettings(publicSettings);
        
        // Check user authentication only if valid token is provided
        if (hasValidToken(appParams.token)) {
          await checkUserAuth();
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
          setAuthChecked(true);
        }
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        // Fallback gracefully to standalone mode without network error alerts
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
        setAuthChecked(true);
      }
    } catch (error) {
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
    }
  };

  const checkUserAuth = async () => {
    if (!hasValidToken(appParams.token)) {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
      setUser(null);
      return;
    }

    try {
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
      
      if (error?.status === 401 || error?.status === 403) {
        // Token expired or invalid -> clear local storage token so future calls skip it
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('base44_access_token');
            localStorage.removeItem('token');
          }
        } catch (e) {}
        setUser(null);
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    
    if (shouldRedirect) {
      // Use the SDK's logout method which handles token cleanup and redirect
      base44.auth.logout(window.location.href);
    } else {
      // Just remove the token without redirect
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    // Use the SDK's redirectToLogin method
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser,
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      loginWithGoogle,
      logoutFirebase,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
