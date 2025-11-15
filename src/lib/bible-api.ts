// Integração com Supabase para obter conteúdo bíblico completo
import { createClient } from '@supabase/supabase-js';
import { BibleVerseData } from './types';

// Inicializar cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: ReturnType<typeof createClient> | null = null;

// Criar cliente apenas no lado do cliente (browser)
if (typeof window !== 'undefined' && supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

/**
 * Normaliza código de idioma para busca flexível
 * Aceita tanto 'en-US' quanto 'en', 'pt-BR' quanto 'pt'
 */
function normalizeLanguageCode(code: string): string {
  const normalized = code.toLowerCase();
  // Retorna apenas o código base (ex: 'pt-BR' -> 'pt', 'en-US' -> 'en')
  if (normalized.includes('-')) {
    return normalized.split('-')[0];
  }
  return normalized;
}

/**
 * Busca um capítulo completo da Bíblia via Supabase
 */
export async function fetchChapterFromAPI(
  languageCode: string,
  versionId: string,
  bookId: string,
  chapter: number
): Promise<BibleVerseData[]> {
  // Verificar se está no browser e se o Supabase está configurado
  if (typeof window === 'undefined' || !supabase) {
    console.log('Supabase não disponível - usando dados locais');
    return [];
  }

  try {
    const lang = normalizeLanguageCode(languageCode);
    
    console.log('Buscando versículos:', { lang, versionId, bookId, chapter });
    
    const { data, error } = await supabase
      .from('bible_verses')
      .select('*')
      .eq('book', bookId)
      .eq('chapter', chapter)
      .eq('version', versionId)
      .ilike('language', `${lang}%`)
      .order('verse', { ascending: true });

    if (error) {
      console.error('Erro ao buscar do Supabase:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('Nenhum versículo encontrado no Supabase');
      return [];
    }

    console.log(`${data.length} versículos encontrados no Supabase`);

    // Remover duplicatas mantendo apenas o primeiro de cada versículo
    const uniqueVerses = new Map<number, any>();
    data.forEach((row: any) => {
      if (!uniqueVerses.has(row.verse)) {
        uniqueVerses.set(row.verse, row);
      }
    });

    // Mapear dados do Supabase para o formato esperado
    return Array.from(uniqueVerses.values()).map((row: any) => ({
      book: row.book,
      chapter: row.chapter,
      verse: row.verse,
      text: row.text,
      version: row.version,
      language: row.language
    }));
  } catch (error) {
    console.error('Erro ao buscar capítulo:', error);
    return [];
  }
}

/**
 * Busca versículos bilíngues de um capítulo
 */
export async function fetchBilingualChapter(
  nativeLanguage: string,
  nativeVersion: string,
  learningLanguage: string,
  learningVersion: string,
  bookId: string,
  chapter: number
): Promise<Array<{ native: BibleVerseData; learning: BibleVerseData }>> {
  if (typeof window === 'undefined' || !supabase) {
    console.log('Supabase não disponível - usando dados locais');
    return [];
  }

  try {
    console.log('Buscando capítulo bilíngue:', { 
      nativeLanguage, 
      nativeVersion, 
      learningLanguage, 
      learningVersion, 
      bookId, 
      chapter 
    });

    // Buscar versículos em ambos os idiomas
    const [nativeVerses, learningVerses] = await Promise.all([
      fetchChapterFromAPI(nativeLanguage, nativeVersion, bookId, chapter),
      fetchChapterFromAPI(learningLanguage, learningVersion, bookId, chapter)
    ]);

    console.log('Versículos nativos:', nativeVerses.length);
    console.log('Versículos de aprendizado:', learningVerses.length);

    if (nativeVerses.length === 0 || learningVerses.length === 0) {
      console.log('Um dos idiomas não tem versículos disponíveis');
      return [];
    }

    // Combinar versículos por número
    const bilingualVerses: Array<{ native: BibleVerseData; learning: BibleVerseData }> = [];
    
    for (const nativeVerse of nativeVerses) {
      const learningVerse = learningVerses.find(v => v.verse === nativeVerse.verse);
      if (learningVerse) {
        bilingualVerses.push({
          native: nativeVerse,
          learning: learningVerse
        });
      }
    }

    console.log('Versículos bilíngues combinados:', bilingualVerses.length);

    return bilingualVerses;
  } catch (error) {
    console.error('Erro ao buscar capítulo bilíngue:', error);
    return [];
  }
}

/**
 * Verifica se um capítulo específico está disponível no Supabase
 */
export async function checkChapterAvailability(
  languageCode: string,
  versionId: string,
  bookId: string,
  chapter: number
): Promise<{ available: boolean; verseCount: number; message: string }> {
  if (typeof window === 'undefined' || !supabase) {
    return {
      available: false,
      verseCount: 0,
      message: 'Supabase não configurado'
    };
  }

  try {
    const lang = normalizeLanguageCode(languageCode);
    
    const { data, error } = await supabase
      .from('bible_verses')
      .select('verse', { count: 'exact' })
      .eq('book', bookId)
      .eq('chapter', chapter)
      .eq('version', versionId)
      .ilike('language', `${lang}%`);

    if (error) {
      return {
        available: false,
        verseCount: 0,
        message: error.message
      };
    }

    const verseCount = data?.length || 0;

    return {
      available: verseCount > 0,
      verseCount,
      message: verseCount > 0 ? 'Capítulo disponível' : 'Capítulo não encontrado'
    };
  } catch (error) {
    return {
      available: false,
      verseCount: 0,
      message: 'Erro ao verificar disponibilidade'
    };
  }
}

/**
 * Helper para obter nome do idioma
 */
function getLanguageName(code: string): string {
  const normalized = code.toLowerCase();
  const languages: { [key: string]: string } = {
    'pt-br': 'Português',
    'pt': 'Português',
    'en-us': 'English',
    'en': 'English',
    'es-es': 'Español',
    'es': 'Español',
    'fr-fr': 'Français',
    'fr': 'Français',
    'de-de': 'Deutsch',
    'de': 'Deutsch',
    'it-it': 'Italiano',
    'it': 'Italiano',
  };
  return languages[normalized] || code;
}
