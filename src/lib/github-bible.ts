// Serviço para importar dados bíblicos do repositório thiagobodruk/biblia
// GitHub: https://github.com/thiagobodruk/biblia

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/thiagobodruk/biblia/master/json';

// Mapeamento de versões disponíveis no repositório
export const GITHUB_BIBLE_VERSIONS = {
  'nvi': 'nvi.json',    // Nova Versão Internacional
  'acf': 'acf.json',    // Almeida Corrigida e Fiel
  'aa': 'aa.json',      // Almeida Revisada Imprensa Bíblica
} as const;

export type GitHubBibleVersion = keyof typeof GITHUB_BIBLE_VERSIONS;

// Estrutura dos dados do repositório
export interface GitHubBibleBook {
  abbrev: string;
  book: string;
  chapters: string[][]; // chapters[chapterIndex][verseIndex]
}

export interface GitHubBibleVerse {
  book: string;
  bookAbbrev: string;
  chapter: number;
  verse: number;
  text: string;
}

/**
 * Cache local dos dados da Bíblia para evitar múltiplas requisições
 */
const bibleCache = new Map<string, GitHubBibleBook[]>();

/**
 * Busca e faz cache de uma versão completa da Bíblia
 */
export async function fetchBibleVersion(version: GitHubBibleVersion): Promise<GitHubBibleBook[]> {
  // Verificar cache primeiro
  if (bibleCache.has(version)) {
    return bibleCache.get(version)!;
  }

  const fileName = GITHUB_BIBLE_VERSIONS[version];
  const url = `${GITHUB_RAW_BASE}/${fileName}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar ${version}: ${response.status}`);
    }

    const data: GitHubBibleBook[] = await response.json();
    
    // Salvar no cache
    bibleCache.set(version, data);
    
    console.log(`✅ Bíblia ${version.toUpperCase()} carregada com sucesso (${data.length} livros)`);
    return data;
  } catch (error) {
    console.error(`❌ Erro ao carregar Bíblia ${version}:`, error);
    throw error;
  }
}

/**
 * Busca um livro específico
 */
export async function fetchBook(
  version: GitHubBibleVersion,
  bookName: string
): Promise<GitHubBibleBook | null> {
  const bible = await fetchBibleVersion(version);
  
  const book = bible.find(b => 
    b.book.toLowerCase() === bookName.toLowerCase() ||
    b.abbrev.toLowerCase() === bookName.toLowerCase()
  );
  
  return book || null;
}

/**
 * Busca um capítulo específico
 */
export async function fetchChapterFromGitHub(
  version: GitHubBibleVersion,
  bookName: string,
  chapterNumber: number
): Promise<GitHubBibleVerse[]> {
  const book = await fetchBook(version, bookName);
  
  if (!book) {
    console.error(`Livro não encontrado: ${bookName}`);
    return [];
  }

  const chapterIndex = chapterNumber - 1; // Arrays são 0-based
  
  if (chapterIndex < 0 || chapterIndex >= book.chapters.length) {
    console.error(`Capítulo ${chapterNumber} não existe em ${book.book}`);
    return [];
  }

  const verses = book.chapters[chapterIndex];
  
  return verses.map((text, index) => ({
    book: book.book,
    bookAbbrev: book.abbrev,
    chapter: chapterNumber,
    verse: index + 1, // Versículos começam em 1
    text: text.trim(),
  }));
}

/**
 * Busca um versículo específico
 */
export async function fetchVerseFromGitHub(
  version: GitHubBibleVersion,
  bookName: string,
  chapterNumber: number,
  verseNumber: number
): Promise<string | null> {
  const chapter = await fetchChapterFromGitHub(version, bookName, chapterNumber);
  
  const verse = chapter.find(v => v.verse === verseNumber);
  return verse ? verse.text : null;
}

/**
 * Lista todos os livros disponíveis
 */
export async function listBooks(version: GitHubBibleVersion): Promise<Array<{name: string, abbrev: string, chapters: number}>> {
  const bible = await fetchBibleVersion(version);
  
  return bible.map(book => ({
    name: book.book,
    abbrev: book.abbrev,
    chapters: book.chapters.length,
  }));
}

/**
 * Busca versículos por palavra-chave
 */
export async function searchVerses(
  version: GitHubBibleVersion,
  keyword: string,
  maxResults: number = 50
): Promise<GitHubBibleVerse[]> {
  const bible = await fetchBibleVersion(version);
  const results: GitHubBibleVerse[] = [];
  const searchTerm = keyword.toLowerCase();

  for (const book of bible) {
    for (let chapterIndex = 0; chapterIndex < book.chapters.length; chapterIndex++) {
      const verses = book.chapters[chapterIndex];
      
      for (let verseIndex = 0; verseIndex < verses.length; verseIndex++) {
        const text = verses[verseIndex];
        
        if (text.toLowerCase().includes(searchTerm)) {
          results.push({
            book: book.book,
            bookAbbrev: book.abbrev,
            chapter: chapterIndex + 1,
            verse: verseIndex + 1,
            text: text.trim(),
          });
          
          if (results.length >= maxResults) {
            return results;
          }
        }
      }
    }
  }

  return results;
}

/**
 * Limpa o cache (útil para liberar memória)
 */
export function clearCache(): void {
  bibleCache.clear();
  console.log('🗑️ Cache da Bíblia limpo');
}

/**
 * Obtém estatísticas de uma versão
 */
export async function getBibleStats(version: GitHubBibleVersion): Promise<{
  books: number;
  chapters: number;
  verses: number;
}> {
  const bible = await fetchBibleVersion(version);
  
  let totalChapters = 0;
  let totalVerses = 0;
  
  bible.forEach(book => {
    totalChapters += book.chapters.length;
    book.chapters.forEach(chapter => {
      totalVerses += chapter.length;
    });
  });
  
  return {
    books: bible.length,
    chapters: totalChapters,
    verses: totalVerses,
  };
}
