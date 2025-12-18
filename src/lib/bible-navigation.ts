/**
 * Serviço de navegação entre livros e capítulos da Bíblia
 */

export interface BookInfo {
  code: string;
  name: string;
  testament: 'old' | 'new';
  chapters: number;
}

// Lista completa dos livros da Bíblia com número de capítulos
export const BIBLE_BOOKS: BookInfo[] = [
  // Antigo Testamento
  { code: 'GEN', name: 'Gênesis', testament: 'old', chapters: 50 },
  { code: 'EXO', name: 'Êxodo', testament: 'old', chapters: 40 },
  { code: 'LEV', name: 'Levítico', testament: 'old', chapters: 27 },
  { code: 'NUM', name: 'Números', testament: 'old', chapters: 36 },
  { code: 'DEU', name: 'Deuteronômio', testament: 'old', chapters: 34 },
  { code: 'JOS', name: 'Josué', testament: 'old', chapters: 24 },
  { code: 'JDG', name: 'Juízes', testament: 'old', chapters: 21 },
  { code: 'RUT', name: 'Rute', testament: 'old', chapters: 4 },
  { code: '1SA', name: '1 Samuel', testament: 'old', chapters: 31 },
  { code: '2SA', name: '2 Samuel', testament: 'old', chapters: 24 },
  { code: '1KI', name: '1 Reis', testament: 'old', chapters: 22 },
  { code: '2KI', name: '2 Reis', testament: 'old', chapters: 25 },
  { code: '1CH', name: '1 Crônicas', testament: 'old', chapters: 29 },
  { code: '2CH', name: '2 Crônicas', testament: 'old', chapters: 36 },
  { code: 'EZR', name: 'Esdras', testament: 'old', chapters: 10 },
  { code: 'NEH', name: 'Neemias', testament: 'old', chapters: 13 },
  { code: 'EST', name: 'Ester', testament: 'old', chapters: 10 },
  { code: 'JOB', name: 'Jó', testament: 'old', chapters: 42 },
  { code: 'PSA', name: 'Salmos', testament: 'old', chapters: 150 },
  { code: 'PRO', name: 'Provérbios', testament: 'old', chapters: 31 },
  { code: 'ECC', name: 'Eclesiastes', testament: 'old', chapters: 12 },
  { code: 'SNG', name: 'Cânticos', testament: 'old', chapters: 8 },
  { code: 'ISA', name: 'Isaías', testament: 'old', chapters: 66 },
  { code: 'JER', name: 'Jeremias', testament: 'old', chapters: 52 },
  { code: 'LAM', name: 'Lamentações', testament: 'old', chapters: 5 },
  { code: 'EZK', name: 'Ezequiel', testament: 'old', chapters: 48 },
  { code: 'DAN', name: 'Daniel', testament: 'old', chapters: 12 },
  { code: 'HOS', name: 'Oséias', testament: 'old', chapters: 14 },
  { code: 'JOL', name: 'Joel', testament: 'old', chapters: 3 },
  { code: 'AMO', name: 'Amós', testament: 'old', chapters: 9 },
  { code: 'OBA', name: 'Obadias', testament: 'old', chapters: 1 },
  { code: 'JON', name: 'Jonas', testament: 'old', chapters: 4 },
  { code: 'MIC', name: 'Miquéias', testament: 'old', chapters: 7 },
  { code: 'NAM', name: 'Naum', testament: 'old', chapters: 3 },
  { code: 'HAB', name: 'Habacuque', testament: 'old', chapters: 3 },
  { code: 'ZEP', name: 'Sofonias', testament: 'old', chapters: 3 },
  { code: 'HAG', name: 'Ageu', testament: 'old', chapters: 2 },
  { code: 'ZEC', name: 'Zacarias', testament: 'old', chapters: 14 },
  { code: 'MAL', name: 'Malaquias', testament: 'old', chapters: 4 },
  
  // Novo Testamento
  { code: 'MAT', name: 'Mateus', testament: 'new', chapters: 28 },
  { code: 'MRK', name: 'Marcos', testament: 'new', chapters: 16 },
  { code: 'LUK', name: 'Lucas', testament: 'new', chapters: 24 },
  { code: 'JHN', name: 'João', testament: 'new', chapters: 21 },
  { code: 'ACT', name: 'Atos', testament: 'new', chapters: 28 },
  { code: 'ROM', name: 'Romanos', testament: 'new', chapters: 16 },
  { code: '1CO', name: '1 Coríntios', testament: 'new', chapters: 16 },
  { code: '2CO', name: '2 Coríntios', testament: 'new', chapters: 13 },
  { code: 'GAL', name: 'Gálatas', testament: 'new', chapters: 6 },
  { code: 'EPH', name: 'Efésios', testament: 'new', chapters: 6 },
  { code: 'PHP', name: 'Filipenses', testament: 'new', chapters: 4 },
  { code: 'COL', name: 'Colossenses', testament: 'new', chapters: 4 },
  { code: '1TH', name: '1 Tessalonicenses', testament: 'new', chapters: 5 },
  { code: '2TH', name: '2 Tessalonicenses', testament: 'new', chapters: 3 },
  { code: '1TI', name: '1 Timóteo', testament: 'new', chapters: 6 },
  { code: '2TI', name: '2 Timóteo', testament: 'new', chapters: 4 },
  { code: 'TIT', name: 'Tito', testament: 'new', chapters: 3 },
  { code: 'PHM', name: 'Filemom', testament: 'new', chapters: 1 },
  { code: 'HEB', name: 'Hebreus', testament: 'new', chapters: 13 },
  { code: 'JAS', name: 'Tiago', testament: 'new', chapters: 5 },
  { code: '1PE', name: '1 Pedro', testament: 'new', chapters: 5 },
  { code: '2PE', name: '2 Pedro', testament: 'new', chapters: 3 },
  { code: '1JN', name: '1 João', testament: 'new', chapters: 5 },
  { code: '2JN', name: '2 João', testament: 'new', chapters: 1 },
  { code: '3JN', name: '3 João', testament: 'new', chapters: 1 },
  { code: 'JUD', name: 'Judas', testament: 'new', chapters: 1 },
  { code: 'REV', name: 'Apocalipse', testament: 'new', chapters: 22 },
];

/**
 * Obtém informações de um livro pelo código
 */
export function getBookByCode(code: string): BookInfo | null {
  return BIBLE_BOOKS.find(book => book.code === code) || null;
}

/**
 * Obtém o próximo capítulo (mesmo livro ou próximo livro)
 */
export function getNextChapter(bookCode: string, chapter: number): { book: string; chapter: number } | null {
  const currentBook = getBookByCode(bookCode);
  if (!currentBook) return null;

  // Se não é o último capítulo do livro, retorna próximo capítulo
  if (chapter < currentBook.chapters) {
    return { book: bookCode, chapter: chapter + 1 };
  }

  // Se é o último capítulo, vai para o próximo livro
  const currentIndex = BIBLE_BOOKS.findIndex(b => b.code === bookCode);
  if (currentIndex === -1 || currentIndex === BIBLE_BOOKS.length - 1) {
    return null; // Último livro da Bíblia
  }

  const nextBook = BIBLE_BOOKS[currentIndex + 1];
  return { book: nextBook.code, chapter: 1 };
}

/**
 * Obtém o capítulo anterior (mesmo livro ou livro anterior)
 */
export function getPreviousChapter(bookCode: string, chapter: number): { book: string; chapter: number } | null {
  const currentBook = getBookByCode(bookCode);
  if (!currentBook) return null;

  // Se não é o primeiro capítulo do livro, retorna capítulo anterior
  if (chapter > 1) {
    return { book: bookCode, chapter: chapter - 1 };
  }

  // Se é o primeiro capítulo, vai para o livro anterior
  const currentIndex = BIBLE_BOOKS.findIndex(b => b.code === bookCode);
  if (currentIndex <= 0) {
    return null; // Primeiro livro da Bíblia
  }

  const previousBook = BIBLE_BOOKS[currentIndex - 1];
  return { book: previousBook.code, chapter: previousBook.chapters };
}

/**
 * Verifica se um capítulo é válido para um livro
 */
export function isValidChapter(bookCode: string, chapter: number): boolean {
  const book = getBookByCode(bookCode);
  if (!book) return false;
  return chapter >= 1 && chapter <= book.chapters;
}

/**
 * Obtém todos os livros do Antigo Testamento
 */
export function getOldTestamentBooks(): BookInfo[] {
  return BIBLE_BOOKS.filter(book => book.testament === 'old');
}

/**
 * Obtém todos os livros do Novo Testamento
 */
export function getNewTestamentBooks(): BookInfo[] {
  return BIBLE_BOOKS.filter(book => book.testament === 'new');
}

/**
 * Obtém o número total de capítulos de um livro
 */
export function getTotalChapters(bookCode: string): number {
  const book = getBookByCode(bookCode);
  return book?.chapters || 0;
}
