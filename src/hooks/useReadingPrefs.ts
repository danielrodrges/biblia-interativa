import { useState, useEffect } from 'react';

export interface ReadingPreferences {
  dominantLanguage: string | null;
  bibleVersion: string | null;
  practiceLanguage: string | null;
  readerFontSize: 'S' | 'M' | 'L';
  subtitleEnabled: boolean;
  subtitleFontSize: 'S' | 'M' | 'L';
  speechLanguage: 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT' | 'fr-FR';
  textLanguage: 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT' | 'fr-FR';
  speechRate: number;
}

const STORAGE_KEY = 'reading-preferences';

const defaultPrefs: ReadingPreferences = {
  dominantLanguage: null,
  bibleVersion: null,
  practiceLanguage: null,
  readerFontSize: 'M',
  subtitleEnabled: true,
  subtitleFontSize: 'M',
  speechLanguage: 'pt-BR',
  textLanguage: 'pt-BR',
  speechRate: 1.0,
};

export function useReadingPrefs() {
  const [prefs, setPrefs] = useState<ReadingPreferences>(defaultPrefs);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const loadPrefs = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPrefs({ ...defaultPrefs, ...parsed });
        }
      } catch (error) {
        console.error('Error loading reading preferences:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadPrefs();
  }, []);

  const savePrefs = (updates: Partial<ReadingPreferences>) => {
    const newPrefs = { ...prefs, ...updates };
    setPrefs(newPrefs);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
      } catch (error) {
        console.error('Error saving reading preferences:', error);
      }
    }
  };

  const clearPrefs = () => {
    setPrefs(defaultPrefs);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const hasValidPrefs = () => {
    return !!(prefs.dominantLanguage && prefs.bibleVersion && prefs.practiceLanguage);
  };

  return {
    prefs,
    savePrefs,
    clearPrefs,
    hasValidPrefs,
    isLoaded,
  };
}
