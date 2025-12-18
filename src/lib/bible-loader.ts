/**
 * Serviço unificado para carregar dados da Bíblia
 * Integra GitHub (offline) e Scripture API (online)
 */

import { fetchChapterFromGitHub, fetchVerseFromGitHub, GitHubBibleVersion } from './github-bible';
import { fetchChapter as fetchChapterFromAPI, fetchVerse as fetchVerseFromAPI } from './scripture-api';

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
  // GitHub (offline, grátis)
  'NVI': 'github' as const,
  'ACF': 'github' as const,
  'AA': 'github' as const,
  
  // Scripture API (online, requer chave)
  'BLT': 'api' as const,
  'KJV': 'api' as const,
  'NIV': 'api' as const,
};

// Mapeamento de IDs de versões do GitHub
const GITHUB_VERSION_MAP: Record<string, GitHubBibleVersion> = {
  'NVI': 'nvi',
  'ACF': 'acf',
  'AA': 'aa',
};

// Mapeamento de códigos de livros
// GitHub usa abreviações em português, Scripture API usa códigos diferentes
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
 */
export async function loadBibleChapter(
  bookCode: string,
  chapter: number,
  version: string
): Promise<BibleChapter | null> {
  try {
    const source = VERSION_SOURCES[version as keyof typeof VERSION_SOURCES];
    const bookInfo = BOOK_CODE_MAP[bookCode];
    
    if (!bookInfo) {
      console.error(`Código de livro desconhecido: ${bookCode}`);
      return null;
    }

    if (source === 'github') {
      // Carregar do GitHub
      const githubVersion = GITHUB_VERSION_MAP[version];
      if (!githubVersion) {
        console.error(`Versão GitHub não mapeada: ${version}`);
        return null;
      }

      const githubData = await fetchChapterFromGitHub(
        githubVersion,
        bookInfo.github,
        chapter
      );

      if (!githubData) return null;

      return {
        book: bookCode,
        bookName: bookInfo.name,
        chapter,
        version,
        verses: githubData.verses.map((text, index) => ({
          number: index + 1,
          text,
        })),
      };
    } else {
      // Carregar da Scripture API
      const apiData = await fetchChapterFromAPI(version, bookInfo.api, chapter);
      
      if (!apiData) return null;

      return {
        book: bookCode,
        bookName: bookInfo.name,
        chapter,
        version,
        verses: apiData.verses.map((verse) => ({
          number: verse.number,
          text: verse.text,
        })),
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
      const apiVerse = await fetchVerseFromAPI(
        version,
        bookInfo.api,
        chapter,
        verse
      );

      if (!apiVerse) return null;

      return {
        number: apiVerse.number,
        text: apiVerse.text,
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
