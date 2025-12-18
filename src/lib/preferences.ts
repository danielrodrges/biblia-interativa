// Utilitários para gerenciar preferências do usuário

import { UserPreferences } from './types';

const STORAGE_KEY = 'biblia-multilingue-preferences';

export const defaultPreferences: UserPreferences = {
  nativeLanguage: null,
  learningLanguage: null,
  nativeVersion: null,
  learningVersion: null,
  fontSize: 'medium',
  readingMode: 'single',
  lastReading: null,
  onboardingCompleted: false,
  // Nova propriedade para idioma e versão preferida
  preferredLanguage: null,
  preferredBibleVersion: null,
};

export function getPreferences(): UserPreferences {
  if (typeof window === 'undefined') return defaultPreferences;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Erro ao carregar preferências:', error);
  }
  
  return defaultPreferences;
}

export function savePreferences(preferences: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Erro ao salvar preferências:', error);
  }
}

export function clearPreferences(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar preferências:', error);
  }
}

export function getFontSizeClass(size: 'small' | 'medium' | 'large'): string {
  switch (size) {
    case 'small':
      return 'text-base';
    case 'medium':
      return 'text-lg';
    case 'large':
      return 'text-xl';
    default:
      return 'text-lg';
  }
}

/**
 * Retorna o idioma preferido do usuário
 */
export function getPreferredLanguage(): string | null {
  const prefs = getPreferences();
  return prefs.preferredLanguage || null;
}

/**
 * Retorna a versão da Bíblia preferida do usuário
 */
export function getPreferredBibleVersion(): string | null {
  const prefs = getPreferences();
  return prefs.preferredBibleVersion || null;
}

/**
 * Verifica se o usuário já configurou suas preferências
 */
export function hasUserPreferences(): boolean {
  const prefs = getPreferences();
  return !!(prefs.preferredLanguage && prefs.preferredBibleVersion);
}
