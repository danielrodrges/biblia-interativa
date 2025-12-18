// Types para a aplicação Bíblia Multilíngue

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface BibleVersion {
  id: string;
  languageCode: string;
  name: string;
  abbreviation: string;
  isFavorite?: boolean;
}

export interface Book {
  id: string;
  name: string;
  chapters: number;
}

export interface Verse {
  number: number;
  text: string;
}

export interface Chapter {
  book: string;
  chapter: number;
  verses: Verse[];
}

export interface UserPreferences {
  nativeLanguage: Language | null;
  learningLanguage: Language | null;
  nativeVersion: BibleVersion | null;
  learningVersion: BibleVersion | null;
  fontSize: 'small' | 'medium' | 'large';
  readingMode: 'native' | 'learning' | 'both' | 'single';
  lastReading: {
    book: string;
    chapter: number;
  } | null;
  onboardingCompleted: boolean;
  // Nova estrutura simplificada
  preferredLanguage?: string | null;  // código do idioma: pt-BR, en-US, etc
  preferredBibleVersion?: string | null;  // ID da versão: NVI, KJV, etc
}

export interface VocabularyWord {
  native: string;
  learning: string;
  context: string;
}

export interface Exercise {
  id: string;
  type: 'vocabulary' | 'translation' | 'meditation';
  verse: {
    reference: string;
    nativeText: string;
    learningText: string;
  };
  words?: VocabularyWord[];
  meditation?: {
    native: string;
    learning: string;
  };
}

// ============================================
// NOVOS TIPOS PARA GESTÃO DE DADOS BÍBLICOS
// ============================================

/**
 * Estrutura padronizada de um versículo bíblico
 * Cada versículo tem identificador único: language_code + bible_version_id + book_id + chapter + verse
 */
export interface BibleVerseData {
  language_code: string;          // ex: pt-BR, en-US, es-ES
  language_name: string;           // ex: Português do Brasil, Inglês Americano
  bible_version_id: string;        // ex: ARA, NVI, KJV, NIV, RVR1960
  bible_version_name: string;      // nome completo da versão
  book_id: string;                 // número ou código do livro
  book_name: string;               // nome do livro na língua correspondente
  chapter: number;                 // número do capítulo
  verse: number;                   // número do versículo
  text: string;                    // texto completo do versículo
  source_reference?: string;       // de onde essa versão foi obtida (auditoria)
}

/**
 * Estrutura de uma versão bíblica completa
 */
export interface BibleVersionData {
  version_id: string;              // ex: NVI, KJV, ARA
  version_name: string;            // nome completo
  language_code: string;           // código do idioma
  language_name: string;           // nome do idioma
  description?: string;            // descrição da versão
  year?: number;                   // ano de publicação
  source_reference?: string;       // fonte oficial
  is_available: boolean;           // se está disponível no app
}

/**
 * Mapeamento de livros bíblicos por idioma
 */
export interface BibleBookMapping {
  book_id: string;                 // identificador único do livro
  book_number: number;             // número do livro (1-66)
  testament: 'old' | 'new';        // testamento
  total_chapters: number;          // total de capítulos
  names: {
    [language_code: string]: string; // nome do livro em cada idioma
  };
}

/**
 * Configuração de leitura bilíngue
 */
export interface BilingualReadingConfig {
  native_version: string;          // versão na língua nativa
  learning_version: string;        // versão na língua de aprendizado
  display_mode: 'side-by-side' | 'verse-by-verse' | 'native-only' | 'learning-only';
  sync_position: boolean;          // sincronizar posição entre idiomas
}

/**
 * Resultado de busca de versículo
 */
export interface VerseSearchResult {
  found: boolean;
  verse?: BibleVerseData;
  alternative_version?: string;    // sugestão de versão alternativa
  message?: string;                // mensagem amigável
}
