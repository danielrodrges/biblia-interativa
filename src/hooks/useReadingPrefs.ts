import { useState, useEffect } from 'react';

export interface ReadingPreferences {
  dominantLanguage: string | null;
  bibleVersion: string | null;
  practiceLanguage: string | null;
  readerFontSize: 'S' | 'M' | 'L';
  subtitleEnabled: boolean;
  subtitleFontSize: 'S' | 'M' | 'L';
}

const STORAGE_KEY = 'reading-preferences';

const defaultPrefs: ReadingPreferences = {
  dominantLanguage: null,
  bibleVersion: null,
  practiceLanguage: null,
  readerFontSize: 'M',
  subtitleEnabled: true,
  subtitleFontSize: 'M',
};

export function useReadingPrefs() {
  const [prefs, setPrefs] = useState<ReadingPreferences>(defaultPrefs);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPrefs({ ...defaultPrefs, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading reading preferences:', error);
    } finally {
      setIsLoaded(true);
    }
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
