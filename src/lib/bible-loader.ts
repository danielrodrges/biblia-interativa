/**
 * Serviço unificado para carregar dados da Bíblia
 * Integra Supabase (primário), GitHub (offline) e Scripture API (online)
 */

import { createClient } from '@supabase/supabase-js';
import { fetchChapterFromGitHub, fetchVerseFromGitHub, GitHubBibleVersion } from './github-bible';
import { fetchChapter as fetchChapterFromAPI, fetchVerse as fetchVerseFromAPI } from './scripture-api';
import { BibleChapter, BibleVerse } from './types';
import { bibleCache } from './bible-cache';

// Criar cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validar variáveis de ambiente
if (typeof window !== 'undefined') {
  console.log('📡 Supabase Config:', {
    url: supabaseUrl ? '✅ Configurado' : '❌ Faltando',
    key: supabaseAnonKey ? '✅ Configurado' : '❌ Faltando',
    urlValue: supabaseUrl,
  });
}

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  book: string;
  bookName: string;
  chapter: number;
  version: string;
  verses: BibleVerse[];
}

// Mapeamento de versões para fonte de dados
const VERSION_SOURCES = {
  // Supabase (primário - dados populados)
  'NVI': 'supabase' as const,
  'ARA': 'supabase' as const,
  'ACF': 'supabase' as const,
  
  // GitHub (offline, grátis - fallback)
  // 'NVI': 'github' as const,
  // 'ACF': 'github' as const,
  // 'AA': 'github' as const,
  
  // Scripture API (online, requer chave)
  'BLT': 'api' as const,
  'KJV': 'api' as const,
  'NIV': 'api' as const,
  'RVR60': 'api' as const,
};

// Mapeamento de IDs de versões do GitHub (fallback)
const GITHUB_VERSION_MAP: Record<string, GitHubBibleVersion> = {
  'NVI': 'nvi',
  'ACF': 'acf',
  'ARA': 'aa',  // GitHub usa 'aa' para Almeida Revisada
};

// Mapeamento de códigos de livros
const BOOK_CODE_MAP: Record<string, { github: string; api: string; name: string }> = {
  // Antigo Testamento
  'GEN': { github: 'gn', api: 'GEN', name: 'Gênesis' },
  'EXO': { github: 'ex', api: 'EXO', name: 'Êxodo' },
  'LEV': { github: 'lv', api: 'LEV', name: 'Levítico' },
  'NUM': { github: 'nm', api: 'NUM', name: 'Números' },
  'DEU': { github: 'dt', api: 'DEU', name: 'Deuteronômio' },
  'JOS': { github: 'js', api: 'JOS', name: 'Josué' },
  'JDG': { github: 'jz', api: 'JDG', name: 'Juízes' },
  'RUT': { github: 'rt', api: 'RUT', name: 'Rute' },
  '1SA': { github: '1sm', api: '1SA', name: '1 Samuel' },
  '2SA': { github: '2sm', api: '2SA', name: '2 Samuel' },
  '1KI': { github: '1rs', api: '1KI', name: '1 Reis' },
  '2KI': { github: '2rs', api: '2KI', name: '2 Reis' },
  '1CH': { github: '1cr', api: '1CH', name: '1 Crônicas' },
  '2CH': { github: '2cr', api: '2CH', name: '2 Crônicas' },
  'EZR': { github: 'ed', api: 'EZR', name: 'Esdras' },
  'NEH': { github: 'ne', api: 'NEH', name: 'Neemias' },
  'EST': { github: 'et', api: 'EST', name: 'Ester' },
  'JOB': { github: 'job', api: 'JOB', name: 'Jó' },
  'PSA': { github: 'sl', api: 'PSA', name: 'Salmos' },
  'PRO': { github: 'pv', api: 'PRO', name: 'Provérbios' },
  'ECC': { github: 'ec', api: 'ECC', name: 'Eclesiastes' },
  'SNG': { github: 'ct', api: 'SNG', name: 'Cânticos' },
  'ISA': { github: 'is', api: 'ISA', name: 'Isaías' },
  'JER': { github: 'jr', api: 'JER', name: 'Jeremias' },
  'LAM': { github: 'lm', api: 'LAM', name: 'Lamentações' },
  'EZK': { github: 'ez', api: 'EZK', name: 'Ezequiel' },
  'DAN': { github: 'dn', api: 'DAN', name: 'Daniel' },
  'HOS': { github: 'os', api: 'HOS', name: 'Oséias' },
  'JOL': { github: 'jl', api: 'JOL', name: 'Joel' },
  'AMO': { github: 'am', api: 'AMO', name: 'Amós' },
  'OBA': { github: 'ob', api: 'OBA', name: 'Obadias' },
  'JON': { github: 'jn', api: 'JON', name: 'Jonas' },
  'MIC': { github: 'mq', api: 'MIC', name: 'Miquéias' },
  'NAM': { github: 'na', api: 'NAM', name: 'Naum' },
  'HAB': { github: 'hc', api: 'HAB', name: 'Habacuque' },
  'ZEP': { github: 'sf', api: 'ZEP', name: 'Sofonias' },
  'HAG': { github: 'ag', api: 'HAG', name: 'Ageu' },
  'ZEC': { github: 'zc', api: 'ZEC', name: 'Zacarias' },
  'MAL': { github: 'ml', api: 'MAL', name: 'Malaquias' },
  
  // Novo Testamento
  'MAT': { github: 'mt', api: 'MAT', name: 'Mateus' },
  'MRK': { github: 'mc', api: 'MRK', name: 'Marcos' },
  'LUK': { github: 'lc', api: 'LUK', name: 'Lucas' },
  'JHN': { github: 'jo', api: 'JHN', name: 'João' },
  'ACT': { github: 'at', api: 'ACT', name: 'Atos' },
  'ROM': { github: 'rm', api: 'ROM', name: 'Romanos' },
  '1CO': { github: '1co', api: '1CO', name: '1 Coríntios' },
  '2CO': { github: '2co', api: '2CO', name: '2 Coríntios' },
  'GAL': { github: 'gl', api: 'GAL', name: 'Gálatas' },
  'EPH': { github: 'ef', api: 'EPH', name: 'Efésios' },
  'PHP': { github: 'fp', api: 'PHP', name: 'Filipenses' },
  'COL': { github: 'cl', api: 'COL', name: 'Colossenses' },
  '1TH': { github: '1ts', api: '1TH', name: '1 Tessalonicenses' },
  '2TH': { github: '2ts', api: '2TH', name: '2 Tessalonicenses' },
  '1TI': { github: '1tm', api: '1TI', name: '1 Timóteo' },
  '2TI': { github: '2tm', api: '2TI', name: '2 Timóteo' },
  'TIT': { github: 'tt', api: 'TIT', name: 'Tito' },
  'PHM': { github: 'fm', api: 'PHM', name: 'Filemom' },
  'HEB': { github: 'hb', api: 'HEB', name: 'Hebreus' },
  'JAS': { github: 'tg', api: 'JAS', name: 'Tiago' },
  '1PE': { github: '1pe', api: '1PE', name: '1 Pedro' },
  '2PE': { github: '2pe', api: '2PE', name: '2 Pedro' },
  '1JN': { github: '1jo', api: '1JN', name: '1 João' },
  '2JN': { github: '2jo', api: '2JN', name: '2 João' },
  '3JN': { github: '3jo', api: '3JN', name: '3 João' },
  'JUD': { github: 'jd', api: 'JUD', name: 'Judas' },
  'REV': { github: 'ap', api: 'REV', name: 'Apocalipse' },
};

/**
 * Carrega um capítulo completo da Bíblia
 * Prioridade: 1. Cache, 2. Supabase, 3. GitHub, 4. Scripture API
 */
export async function loadBibleChapter(
  bookCode: string,
  chapter: number,
  version: string
): Promise<BibleChapter | null> {
  const startTime = Date.now();
  
  try {
    console.log(`📖 [${Date.now()}] Iniciando loadBibleChapter: ${bookCode} ${chapter} (${version})`);
    
    // VERIFICAR CACHE PRIMEIRO
    const cached = bibleCache.get(bookCode, chapter, version);
    if (cached) {
      return cached;
    }
    
    const bookInfo = BOOK_CODE_MAP[bookCode];
    
    if (!bookInfo) {
      console.error(`❌ Código de livro desconhecido: ${bookCode}`);
      return null;
    }

    console.log(`📚 Livro encontrado: ${bookInfo.name}`);

    // PRIMEIRA TENTATIVA: Carregar do Supabase (RÁPIDO)
    if (supabase) {
      try {
        console.log(`🗄️ [${Date.now()}] Buscando no Supabase...`);
        
        const { data, error } = await supabase
          .from('bible_verses')
          .select('verse_number, text')
          .eq('book_id', bookCode)
          .eq('chapter', chapter)
          .eq('version_id', version)
          .order('verse_number', { ascending: true });

        const supabaseTime = Date.now() - startTime;
        
        if (!error && data && data.length > 0) {
          console.log(`✅ [${supabaseTime}ms] Supabase retornou ${data.length} versículos`);
          const result = {
            book: bookCode,
            bookName: bookInfo.name,
            chapter,
            version,
            verses: data.map((verse: any) => ({
              number: verse.verse_number,
              text: verse.text,
            })),
          };
          
          // Armazenar no cache
          bibleCache.set(bookCode, chapter, version, result);
          
          return result;
        } else if (error) {
          console.warn(`⚠️ Erro ao buscar no Supabase:`, error.message);
        } else {
          console.warn(`⚠️ Supabase vazio para ${bookCode} ${chapter} ${version}`);
        }
      } catch (supabaseError: any) {
        console.warn(`⚠️ Erro ao conectar no Supabase:`, supabaseError.message);
      }
    } else {
      console.warn('⚠️ Supabase não configurado, usando fallback...');
    }

    // SEGUNDA TENTATIVA: Carregar do GitHub (fallback - LENTO)
    console.log(`🔍 Tentando fallback...`);
    const source = VERSION_SOURCES[version as keyof typeof VERSION_SOURCES];
    
    if (source === 'github' || source === 'supabase') {
      const githubVersion = GITHUB_VERSION_MAP[version];
      if (!githubVersion) {
        console.error(`❌ Versão GitHub não mapeada: ${version}`);
        return null;
      }

      console.log(`🌐 Buscando do GitHub (fallback)...`);
      
      const githubData = await fetchChapterFromGitHub(
        githubVersion,
        bookInfo.github,
        chapter
      );

      if (!githubData || githubData.length === 0) {
        console.error(`❌ GitHub retornou dados vazios`);
        return null;
      }

      console.log(`✅ GitHub retornou ${githubData.length} versículos`);

      return {
        book: bookCode,
        bookName: bookInfo.name,
        chapter,
        version,
        verses: githubData.map((verse) => ({
          number: verse.verse,
          text: verse.text,
        })),
      };
    } else {
      // Carregar da Scripture API
      const apiVerses = await fetchChapterFromAPI(version, bookInfo.api, chapter);
      
      if (!apiVerses || apiVerses.length === 0) return null;

      return {
        book: bookCode,
        bookName: bookInfo.name,
        chapter,
        version,
        verses: apiVerses,
      };
    }
  } catch (error) {
    console.error('Erro ao carregar capítulo:', error);
    return null;
  }
}

/**
 * Carrega um versículo específico
 */
export async function loadBibleVerse(
  bookCode: string,
  chapter: number,
  verse: number,
  version: string
): Promise<BibleVerse | null> {
  try {
    const source = VERSION_SOURCES[version as keyof typeof VERSION_SOURCES];
    const bookInfo = BOOK_CODE_MAP[bookCode];
    
    if (!bookInfo) {
      console.error(`Código de livro desconhecido: ${bookCode}`);
      return null;
    }

    if (source === 'github') {
      const githubVersion = GITHUB_VERSION_MAP[version];
      if (!githubVersion) return null;

      const text = await fetchVerseFromGitHub(
        githubVersion,
        bookInfo.github,
        chapter,
        verse
      );

      if (!text) return null;

      return {
        number: verse,
        text,
      };
    } else {
      const verseText = await fetchVerseFromAPI(
        version,
        bookInfo.api,
        chapter,
        verse
      );

      if (!verseText) return null;

      return {
        number: verse,
        text: verseText,
      };
    }
  } catch (error) {
    console.error('Erro ao carregar versículo:', error);
    return null;
  }
}

/**
 * Obtém lista de todos os livros disponíveis
 */
export function getAvailableBooks(): Array<{ code: string; name: string }> {
  return Object.entries(BOOK_CODE_MAP).map(([code, info]) => ({
    code,
    name: info.name,
  }));
}

/**
 * Obtém informações de um livro pelo código
 */
export function getBookInfo(bookCode: string) {
  return BOOK_CODE_MAP[bookCode] || null;
}

/**
 * Verifica se uma versão está disponível
 */
export function isVersionAvailable(version: string): boolean {
  return version in VERSION_SOURCES;
}

/**
 * Obtém a fonte de dados de uma versão
 */
export function getVersionSource(version: string): 'github' | 'api' | null {
  return VERSION_SOURCES[version as keyof typeof VERSION_SOURCES] || null;
}
