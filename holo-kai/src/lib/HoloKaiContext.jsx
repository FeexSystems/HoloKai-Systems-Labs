import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_GUARDIAN, getGuardianById } from '@/lib/guardians';

const HoloKaiContext = createContext(null);

const STORAGE_KEY = 'holokai_session';

/** @typedef {'idle' | 'retrieving' | 'reasoning' | 'speaking'} AiState */

export function HoloKaiProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [portalActive, setPortalActive] = useState(false);
  /** Global AI activity state — drives DockedGuardian from ResearchChat lifecycle */
  const [aiState, setAiState] = useState(/** @type {AiState} */ ('idle'));
  
  // Locked to dark theme ('midnight')
  const [theme, setTheme] = useState('midnight');

  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('holokai_language');
      return (saved === 'sw' || saved === 'am') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('holokai_theme', 'midnight');
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('holokai_language', language);
    } catch {}
  }, [language]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }, [session]);

  const selectGuardian = (guardianId, context = {}) => {
    const guardian = getGuardianById(guardianId);
    setSession({
      guardianId: guardian.id,
      guardianName: guardian.name,
      guardianRole: guardian.role,
      accentColor: guardian.accentColor,
      topic: context.topic || guardian.focus[0],
      language: context.language || 'English',
      journey: context.journey || 'African Civilizations',
      createdAt: new Date().toISOString(),
    });
  };

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  const activeGuardian = session ? getGuardianById(session.guardianId) : DEFAULT_GUARDIAN;

  return (
    <HoloKaiContext.Provider
      value={{
        session,
        activeGuardian,
        portalActive,
        setPortalActive,
        selectGuardian,
        clearSession,
        aiState,
        setAiState,
        theme,
        setTheme,
        language,
        setLanguage,
      }}
    >
      {children}
    </HoloKaiContext.Provider>
  );
}

export function useHoloKai() {
  const ctx = useContext(HoloKaiContext);
  if (!ctx) throw new Error('useHoloKai must be used within HoloKaiProvider');
  return ctx;
}
