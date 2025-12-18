// Gestão de versões bíblicas disponíveis

import { BibleVersionData } from './types';

/**
 * Versões bíblicas oficiais disponíveis no aplicativo
 * Organizadas por idioma
 */
export const availableBibleVersions: BibleVersionData[] = [
  // ========== PORTUGUÊS (Top 5 do Brasil) ==========
  {
    version_id: 'NVI',
    version_name: 'Nova Versão Internacional',
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    description: 'Tradução moderna, equilibrada entre literalidade e clareza',
    year: 2000,
    source_reference: 'Sociedade Bíblica Internacional',
    is_available: true,
  },
  {
    version_id: 'ARA',
    version_name: 'Almeida Revista e Atualizada',
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    description: 'Versão clássica e amplamente utilizada em igrejas evangélicas',
    year: 1993,
    source_reference: 'Sociedade Bíblica do Brasil',
    is_available: true,
  },
  {
    version_id: 'ARC',
    version_name: 'Almeida Revista e Corrigida',
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    description: 'Tradução tradicional com linguagem mais formal',
    year: 1995,
    source_reference: 'Sociedade Bíblica do Brasil',
    is_available: true,
  },
  {
    version_id: 'NTLH',
    version_name: 'Nova Tradução na Linguagem de Hoje',
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    description: 'Linguagem simples e acessível para todos os públicos',
    year: 2000,
    source_reference: 'Sociedade Bíblica do Brasil',
    is_available: true,
  },
  {
    version_id: 'NAA',
    version_name: 'Nova Almeida Atualizada',
    language_code: 'pt-BR',
    language_name: 'Português do Brasil',
    description: 'Atualização moderna da tradição Almeida com linguagem contemporânea',
    year: 2017,
    source_reference: 'Sociedade Bíblica do Brasil',
    is_available: true,
  },

  // ========== INGLÊS ==========
  {
    version_id: 'KJV',
    version_name: 'King James Version',
    language_code: 'en-US',
    language_name: 'English (United States)',
    description: 'Classic English translation',
    year: 1611,
    source_reference: 'Church of England',
    is_available: true,
  },
  {
    version_id: 'NIV',
    version_name: 'New International Version',
    language_code: 'en-US',
    language_name: 'English (United States)',
    description: 'Modern and accurate translation',
    year: 1978,
    source_reference: 'Biblica',
    is_available: true,
  },
  {
    version_id: 'ESV',
    version_name: 'English Standard Version',
    language_code: 'en-US',
    language_name: 'English (United States)',
    description: 'Literal and readable translation',
    year: 2001,
    source_reference: 'Crossway',
    is_available: true,
  },
  {
    version_id: 'NLT',
    version_name: 'New Living Translation',
    language_code: 'en-US',
    language_name: 'English (United States)',
    description: 'Dynamic equivalence translation',
    year: 1996,
    source_reference: 'Tyndale House',
    is_available: true,
  },
  {
    version_id: 'NKJV',
    version_name: 'New King James Version',
    language_code: 'en-US',
    language_name: 'English (United States)',
    description: 'Modern update of the KJV',
    year: 1982,
    source_reference: 'Thomas Nelson',
    is_available: true,
  },

  // ========== ESPANHOL ==========
  {
    version_id: 'RVR1960',
    version_name: 'Reina-Valera 1960',
    language_code: 'es-ES',
    language_name: 'Español',
    description: 'Versión clásica en español',
    year: 1960,
    source_reference: 'Sociedades Bíblicas Unidas',
    is_available: true,
  },
  {
    version_id: 'NVI-ES',
    version_name: 'Nueva Versión Internacional',
    language_code: 'es-ES',
    language_name: 'Español',
    description: 'Traducción moderna y precisa',
    year: 1999,
    source_reference: 'Sociedad Bíblica Internacional',
    is_available: true,
  },
  {
    version_id: 'RVR1995',
    version_name: 'Reina-Valera 1995',
    language_code: 'es-ES',
    language_name: 'Español',
    description: 'Actualización de la RVR',
    year: 1995,
    source_reference: 'Sociedades Bíblicas Unidas',
    is_available: true,
  },

  // ========== FRANCÊS ==========
  {
    version_id: 'LSG',
    version_name: 'Louis Segond 1910',
    language_code: 'fr-FR',
    language_name: 'Français',
    description: 'Version classique française',
    year: 1910,
    source_reference: 'Alliance Biblique Française',
    is_available: true,
  },
  {
    version_id: 'BDS',
    version_name: 'Bible du Semeur',
    language_code: 'fr-FR',
    language_name: 'Français',
    description: 'Traduction moderne et accessible',
    year: 1992,
    source_reference: 'Biblica',
    is_available: true,
  },

  // ========== ALEMÃO ==========
  {
    version_id: 'LUT',
    version_name: 'Lutherbibel 2017',
    language_code: 'de-DE',
    language_name: 'Deutsch',
    description: 'Klassische deutsche Übersetzung',
    year: 2017,
    source_reference: 'Deutsche Bibelgesellschaft',
    is_available: true,
  },

  // ========== ITALIANO ==========
  {
    version_id: 'NR2006',
    version_name: 'Nuova Riveduta 2006',
    language_code: 'it-IT',
    language_name: 'Italiano',
    description: 'Traduzione italiana moderna',
    year: 2006,
    source_reference: 'Società Biblica di Ginevra',
    is_available: true,
  },
];

/**
 * Obtém versões disponíveis para um idioma específico
 */
export function getVersionsByLanguage(languageCode: string): BibleVersionData[] {
  return availableBibleVersions.filter(
    (version) => version.language_code === languageCode && version.is_available
  );
}

/**
 * Obtém uma versão específica pelo ID
 */
export function getVersionById(versionId: string): BibleVersionData | undefined {
  return availableBibleVersions.find((version) => version.version_id === versionId);
}

/**
 * Verifica se uma versão está disponível
 */
export function isVersionAvailable(versionId: string, languageCode: string): boolean {
  const version = availableBibleVersions.find(
    (v) => v.version_id === versionId && v.language_code === languageCode
  );
  return version?.is_available ?? false;
}

/**
 * Sugere uma versão alternativa caso a solicitada não esteja disponível
 */
export function suggestAlternativeVersion(
  languageCode: string,
  requestedVersionId?: string
): BibleVersionData | undefined {
  const versionsForLanguage = getVersionsByLanguage(languageCode);
  
  if (versionsForLanguage.length === 0) {
    return undefined;
  }

  // Se uma versão foi solicitada mas não está disponível, tenta encontrar similar
  if (requestedVersionId) {
    // Prioriza versões populares por idioma
    const popularVersions: { [key: string]: string[] } = {
      'pt-BR': ['NVI', 'ARA', 'ACF', 'NAA'],
      'en-US': ['NIV', 'ESV', 'NLT', 'KJV', 'NKJV'],
      'es-ES': ['NVI-ES', 'RVR1960', 'RVR1995'],
      'fr-FR': ['BDS', 'LSG'],
      'de-DE': ['LUT'],
      'it-IT': ['NR2006'],
    };

    const popular = popularVersions[languageCode] || [];
    for (const versionId of popular) {
      const version = versionsForLanguage.find((v) => v.version_id === versionId);
      if (version) {
        return version;
      }
    }
  }

  // Retorna a primeira versão disponível
  return versionsForLanguage[0];
}

/**
 * Obtém mensagem amigável quando versão não está disponível
 */
export function getVersionUnavailableMessage(
  languageCode: string,
  requestedVersionId: string,
  alternativeVersion?: BibleVersionData
): string {
  const languageNames: { [key: string]: string } = {
    'pt-BR': 'português',
    'en-US': 'inglês',
    'es-ES': 'espanhol',
    'fr-FR': 'francês',
    'de-DE': 'alemão',
    'it-IT': 'italiano',
  };

  const langName = languageNames[languageCode] || 'este idioma';
  
  if (alternativeVersion) {
    return `A versão ${requestedVersionId} não está disponível em ${langName}. Sugerimos usar a versão ${alternativeVersion.version_name} (${alternativeVersion.version_id}).`;
  }
  
  return `A versão ${requestedVersionId} não está disponível em ${langName}. Por favor, escolha outra versão.`;
}
