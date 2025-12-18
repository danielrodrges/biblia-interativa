// Integração com Scripture API (api.bible)
// Documentação: https://scripture.api.bible/

const API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY || '';
const API_ENDPOINT = process.env.NEXT_PUBLIC_BIBLE_API_ENDPOINT || 'https://api.scripture.api.bible/v1';

// Mapeamento de versões do app para IDs da Scripture API
// Apenas versões confirmadas e testadas
const BIBLE_VERSION_IDS: Record<string, string> = {
  // Português (Brasil)
  'NVI': '06125adad2d5898a-01',  // Nova Versão Internacional
  'BLT': 'd63894c8d9a7a503-01',  // Bíblia Livre Para Todos
  
  // Inglês
  'KJV': 'de4e12af7f28f599-01',  // King James Version
  'NIV': '06125adad2d5898a-01',  // New International Version
};

// Mapeamento de nomes de livros para IDs da API
const BOOK_IDS: Record<string, string> = {
  // Antigo Testamento
  'Gênesis': 'GEN',
  'Êxodo': 'EXO',
  'Levítico': 'LEV',
  'Números': 'NUM',
  'Deuteronômio': 'DEU',
  'Josué': 'JOS',
  'Juízes': 'JDG',
  'Rute': 'RUT',
  '1 Samuel': '1SA',
  '2 Samuel': '2SA',
  '1 Reis': '1KI',
  '2 Reis': '2KI',
  '1 Crônicas': '1CH',
  '2 Crônicas': '2CH',
  'Esdras': 'EZR',
  'Neemias': 'NEH',
  'Ester': 'EST',
  'Jó': 'JOB',
  'Salmos': 'PSA',
  'Provérbios': 'PRO',
  'Eclesiastes': 'ECC',
  'Cânticos': 'SNG',
  'Isaías': 'ISA',
  'Jeremias': 'JER',
  'Lamentações': 'LAM',
  'Ezequiel': 'EZK',
  'Daniel': 'DAN',
  'Oséias': 'HOS',
  'Joel': 'JOL',
  'Amós': 'AMO',
  'Obadias': 'OBA',
  'Jonas': 'JON',
  'Miquéias': 'MIC',
  'Naum': 'NAM',
  'Habacuque': 'HAB',
  'Sofonias': 'ZEP',
  'Ageu': 'HAG',
  'Zacarias': 'ZEC',
  'Malaquias': 'MAL',
  
  // Novo Testamento
  'Mateus': 'MAT',
  'Marcos': 'MRK',
  'Lucas': 'LUK',
  'João': 'JHN',
  'Atos': 'ACT',
  'Romanos': 'ROM',
  '1 Coríntios': '1CO',
  '2 Coríntios': '2CO',
  'Gálatas': 'GAL',
  'Efésios': 'EPH',
  'Filipenses': 'PHP',
  'Colossenses': 'COL',
  '1 Tessalonicenses': '1TH',
  '2 Tessalonicenses': '2TH',
  '1 Timóteo': '1TI',
  '2 Timóteo': '2TI',
  'Tito': 'TIT',
  'Filemom': 'PHM',
  'Hebreus': 'HEB',
  'Tiago': 'JAS',
  '1 Pedro': '1PE',
  '2 Pedro': '2PE',
  '1 João': '1JN',
  '2 João': '2JN',
  '3 João': '3JN',
  'Judas': 'JUD',
  'Apocalipse': 'REV',
};

interface ScriptureVerse {
  id: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright?: string;
}

interface ScriptureChapter {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  content: string;
  reference: string;
  verseCount: number;
  next?: { id: string; number: string };
  previous?: { id: string; number: string };
}

export interface BibleVerse {
  number: number;
  text: string;
}

/**
 * Verifica se a API está configurada
 */
export function isScriptureApiConfigured(): boolean {
  return !!(API_KEY && API_ENDPOINT && API_KEY.length > 10);
}

/**
 * Headers padrão para requisições à API
 */
function getHeaders(): HeadersInit {
  return {
    'api-key': API_KEY,
    'Content-Type': 'application/json',
  };
}

/**
 * Busca um versículo específico
 */
export async function fetchVerse(
  version: string,
  book: string,
  chapter: number,
  verse: number
): Promise<string | null> {
  if (!isScriptureApiConfigured()) {
    console.warn('Scripture API não configurada');
    return null;
  }

  try {
    const bibleId = BIBLE_VERSION_IDS[version];
    const bookId = BOOK_IDS[book];
    
    if (!bibleId || !bookId) {
      console.error('Versão ou livro não encontrado:', { version, book });
      return null;
    }

    const verseId = `${bookId}.${chapter}.${verse}`;
    const url = `${API_ENDPOINT}/bibles/${bibleId}/verses/${verseId}`;
    
    const response = await fetch(url, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Remove tags HTML do conteúdo
    const text = data.data?.content?.replace(/<[^>]*>/g, '') || '';
    return text.trim();
  } catch (error) {
    console.error('Erro ao buscar versículo:', error);
    return null;
  }
}

/**
 * Busca um capítulo completo
 */
export async function fetchChapter(
  version: string,
  book: string,
  chapter: number
): Promise<BibleVerse[]> {
  if (!isScriptureApiConfigured()) {
    console.warn('Scripture API não configurada');
    return [];
  }

  try {
    const bibleId = BIBLE_VERSION_IDS[version];
    const bookId = BOOK_IDS[book];
    
    if (!bibleId || !bookId) {
      console.error('Versão ou livro não encontrado:', { version, book });
      return [];
    }

    const chapterId = `${bookId}.${chapter}`;
    const url = `${API_ENDPOINT}/bibles/${bibleId}/chapters/${chapterId}`;
    
    const response = await fetch(url, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse do conteúdo HTML para extrair versículos
    const content = data.data?.content || '';
    const verses = parseChapterContent(content);
    
    return verses;
  } catch (error) {
    console.error('Erro ao buscar capítulo:', error);
    return [];
  }
}

/**
 * Parse do HTML retornado pela API para extrair versículos
 */
function parseChapterContent(htmlContent: string): BibleVerse[] {
  // Remove quebras de linha e espaços extras
  const cleaned = htmlContent.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  
  // Regex para encontrar versículos no formato da API
  // Exemplo: <span class="verse" data-number="1">Texto do versículo</span>
  const verseRegex = /<span[^>]*data-number="(\d+)"[^>]*>(.*?)<\/span>/gi;
  const verses: BibleVerse[] = [];
  
  let match;
  while ((match = verseRegex.exec(cleaned)) !== null) {
    const number = parseInt(match[1], 10);
    const text = match[2]
      .replace(/<[^>]*>/g, '') // Remove tags HTML
      .replace(/&nbsp;/g, ' ') // Remove &nbsp;
      .trim();
    
    if (text) {
      verses.push({ number, text });
    }
  }
  
  return verses;
}

/**
 * Lista versões disponíveis na API
 */
export async function listAvailableBibles(): Promise<any[]> {
  if (!isScriptureApiConfigured()) {
    console.warn('Scripture API não configurada');
    return [];
  }

  try {
    const url = `${API_ENDPOINT}/bibles`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Erro ao listar bíblias:', error);
    return [];
  }
}

/**
 * Busca livros disponíveis em uma versão
 */
export async function fetchBooks(version: string): Promise<any[]> {
  if (!isScriptureApiConfigured()) {
    return [];
  }

  try {
    const bibleId = BIBLE_VERSION_IDS[version];
    if (!bibleId) return [];

    const url = `${API_ENDPOINT}/bibles/${bibleId}/books`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return [];
  }
}
