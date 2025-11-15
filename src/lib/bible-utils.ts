// Utilitários para gerenciamento de leitura bilíngue

import { BibleVerseData, BilingualReadingConfig, VerseSearchResult } from './types';
import { getVerse, getChapterVerses, getBilingualVerses } from './bible-data';
import { 
  getVersionById, 
  isVersionAvailable, 
  suggestAlternativeVersion,
  getVersionUnavailableMessage 
} from './bible-versions';
import { getBookInfo } from './bible-books';

/**
 * Busca um versículo com fallback para versão alternativa
 */
export function searchVerse(
  languageCode: string,
  versionId: string,
  bookId: string,
  chapter: number,
  verse: number
): VerseSearchResult {
  // Tenta buscar o versículo na versão solicitada
  const foundVerse = getVerse(languageCode, versionId, bookId, chapter, verse);

  if (foundVerse) {
    return {
      found: true,
      verse: foundVerse,
    };
  }

  // Se não encontrou, verifica se a versão está disponível
  if (!isVersionAvailable(versionId, languageCode)) {
    const alternativeVersion = suggestAlternativeVersion(languageCode, versionId);
    
    if (alternativeVersion) {
      // Tenta buscar na versão alternativa
      const alternativeVerse = getVerse(
        languageCode,
        alternativeVersion.version_id,
        bookId,
        chapter,
        verse
      );

      if (alternativeVerse) {
        return {
          found: true,
          verse: alternativeVerse,
          alternative_version: alternativeVersion.version_id,
          message: getVersionUnavailableMessage(
            languageCode,
            versionId,
            alternativeVersion
          ),
        };
      }
    }

    return {
      found: false,
      message: getVersionUnavailableMessage(languageCode, versionId),
    };
  }

  // Versão está disponível mas versículo não foi encontrado
  return {
    found: false,
    message: 'Versículo não encontrado. Verifique a referência.',
  };
}

/**
 * Obtém capítulo completo com sincronização bilíngue
 */
export function getBilingualChapter(
  config: BilingualReadingConfig,
  bookId: string,
  chapter: number
): {
  success: boolean;
  verses?: Array<{ native: BibleVerseData; learning: BibleVerseData }>;
  nativeOnly?: BibleVerseData[];
  learningOnly?: BibleVerseData[];
  message?: string;
} {
  // Valida o livro e capítulo
  const bookInfo = getBookInfo(bookId);
  if (!bookInfo) {
    return {
      success: false,
      message: 'Livro não encontrado.',
    };
  }

  if (chapter < 1 || chapter > bookInfo.total_chapters) {
    return {
      success: false,
      message: `Capítulo inválido. ${bookInfo.names['pt-BR']} tem ${bookInfo.total_chapters} capítulos.`,
    };
  }

  // Busca versículos conforme modo de leitura
  switch (config.display_mode) {
    case 'native-only': {
      const nativeResult = searchVersesByChapter(
        config.native_version,
        bookId,
        chapter
      );
      if (!nativeResult.success) {
        return nativeResult;
      }
      return {
        success: true,
        nativeOnly: nativeResult.verses,
      };
    }

    case 'learning-only': {
      const learningResult = searchVersesByChapter(
        config.learning_version,
        bookId,
        chapter
      );
      if (!learningResult.success) {
        return learningResult;
      }
      return {
        success: true,
        learningOnly: learningResult.verses,
      };
    }

    case 'side-by-side':
    case 'verse-by-verse': {
      // Busca versículos em ambos os idiomas
      const nativeVersion = getVersionById(config.native_version);
      const learningVersion = getVersionById(config.learning_version);

      if (!nativeVersion || !learningVersion) {
        return {
          success: false,
          message: 'Versão bíblica não encontrada.',
        };
      }

      const bilingualVerses = getBilingualVerses(
        nativeVersion.language_code,
        config.native_version,
        learningVersion.language_code,
        config.learning_version,
        bookId,
        chapter
      );

      if (bilingualVerses.length === 0) {
        return {
          success: false,
          message: 'Nenhum versículo encontrado para esta combinação de versões.',
        };
      }

      return {
        success: true,
        verses: bilingualVerses,
      };
    }

    default:
      return {
        success: false,
        message: 'Modo de leitura inválido.',
      };
  }
}

/**
 * Busca versículos de um capítulo com fallback
 */
function searchVersesByChapter(
  versionId: string,
  bookId: string,
  chapter: number
): {
  success: boolean;
  verses?: BibleVerseData[];
  message?: string;
} {
  const version = getVersionById(versionId);
  if (!version) {
    return {
      success: false,
      message: 'Versão bíblica não encontrada.',
    };
  }

  const verses = getChapterVerses(
    version.language_code,
    versionId,
    bookId,
    chapter
  );

  if (verses.length === 0) {
    // Tenta versão alternativa
    const alternativeVersion = suggestAlternativeVersion(
      version.language_code,
      versionId
    );

    if (alternativeVersion) {
      const alternativeVerses = getChapterVerses(
        alternativeVersion.language_code,
        alternativeVersion.version_id,
        bookId,
        chapter
      );

      if (alternativeVerses.length > 0) {
        return {
          success: true,
          verses: alternativeVerses,
          message: getVersionUnavailableMessage(
            version.language_code,
            versionId,
            alternativeVersion
          ),
        };
      }
    }

    return {
      success: false,
      message: 'Capítulo não encontrado.',
    };
  }

  return {
    success: true,
    verses,
  };
}

/**
 * Sincroniza posição de leitura entre idiomas
 */
export function syncReadingPosition(
  currentBookId: string,
  currentChapter: number,
  currentVerse: number,
  fromVersion: string,
  toVersion: string
): {
  bookId: string;
  chapter: number;
  verse: number;
  message?: string;
} {
  // Mantém a mesma referência (livro, capítulo, versículo)
  // apenas muda a versão/idioma
  return {
    bookId: currentBookId,
    chapter: currentChapter,
    verse: currentVerse,
    message: `Sincronizado para ${toVersion}`,
  };
}

/**
 * Valida se duas versões podem ser usadas juntas (bilíngue)
 */
export function canUseBilingual(
  nativeVersionId: string,
  learningVersionId: string
): {
  valid: boolean;
  message?: string;
} {
  const nativeVersion = getVersionById(nativeVersionId);
  const learningVersion = getVersionById(learningVersionId);

  if (!nativeVersion || !learningVersion) {
    return {
      valid: false,
      message: 'Uma ou ambas as versões não foram encontradas.',
    };
  }

  if (nativeVersion.language_code === learningVersion.language_code) {
    return {
      valid: false,
      message: 'As versões devem estar em idiomas diferentes para leitura bilíngue.',
    };
  }

  if (!nativeVersion.is_available || !learningVersion.is_available) {
    return {
      valid: false,
      message: 'Uma ou ambas as versões não estão disponíveis.',
    };
  }

  return {
    valid: true,
  };
}

/**
 * Formata referência bíblica
 */
export function formatReference(
  bookName: string,
  chapter: number,
  verse?: number
): string {
  if (verse) {
    return `${bookName} ${chapter}:${verse}`;
  }
  return `${bookName} ${chapter}`;
}

/**
 * Gera sugestões de leitura baseadas em preferências
 */
export function generateReadingSuggestions(
  nativeVersionId: string,
  learningVersionId: string
): Array<{
  bookId: string;
  chapter: number;
  title: string;
  description: string;
}> {
  return [
    {
      bookId: 'JOH',
      chapter: 3,
      title: 'O Amor de Deus',
      description: 'João 3:16-18 - O versículo mais conhecido da Bíblia',
    },
    {
      bookId: 'ROM',
      chapter: 8,
      title: 'Nada nos Separa',
      description: 'Romanos 8 - O amor incondicional de Deus',
    },
    {
      bookId: 'PHP',
      chapter: 4,
      title: 'Força em Cristo',
      description: 'Filipenses 4 - Paz e força através de Cristo',
    },
    {
      bookId: 'PSA',
      chapter: 23,
      title: 'O Senhor é Meu Pastor',
      description: 'Salmos 23 - Confiança e cuidado de Deus',
    },
  ];
}
