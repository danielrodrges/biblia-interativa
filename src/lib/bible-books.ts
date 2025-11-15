// Lista de livros da Bíblia com dados disponíveis no Supabase
export interface BibleBook {
  book_id: string;
  names: {
    'pt-BR': string;
    'en-US': string;
    'es-ES': string;
  };
  testament: 'old' | 'new';
  total_chapters: number;
}

// APENAS LIVROS COM DADOS COMPLETOS NO SUPABASE
export const bibleBooks: BibleBook[] = [
  // Novo Testamento - João (capítulos 1, 2 e 3 disponíveis)
  {
    book_id: 'JOH',
    names: {
      'pt-BR': 'João',
      'en-US': 'John',
      'es-ES': 'Juan',
    },
    testament: 'new',
    total_chapters: 3, // Apenas 3 capítulos disponíveis no momento
  },
];

/**
 * Obtém o nome do livro no idioma especificado
 */
export function getBookName(bookId: string, languageCode: string = 'pt-BR'): string {
  const book = bibleBooks.find(b => b.book_id === bookId);
  if (!book) return bookId;
  
  // Normalizar código de idioma
  const normalizedCode = languageCode.toLowerCase();
  
  if (normalizedCode.startsWith('pt')) {
    return book.names['pt-BR'];
  } else if (normalizedCode.startsWith('en')) {
    return book.names['en-US'];
  } else if (normalizedCode.startsWith('es')) {
    return book.names['es-ES'];
  }
  
  return book.names['pt-BR']; // Fallback para português
}

/**
 * Verifica se um capítulo é válido para um livro
 */
export function isValidChapter(bookId: string, chapter: number): boolean {
  const book = bibleBooks.find(b => b.book_id === bookId);
  if (!book) return false;
  return chapter >= 1 && chapter <= book.total_chapters;
}

/**
 * Obtém o próximo livro na sequência
 */
export function getNextBook(bookId: string): BibleBook | null {
  const currentIndex = bibleBooks.findIndex(b => b.book_id === bookId);
  if (currentIndex === -1 || currentIndex === bibleBooks.length - 1) return null;
  return bibleBooks[currentIndex + 1];
}

/**
 * Obtém o livro anterior na sequência
 */
export function getPreviousBook(bookId: string): BibleBook | null {
  const currentIndex = bibleBooks.findIndex(b => b.book_id === bookId);
  if (currentIndex <= 0) return null;
  return bibleBooks[currentIndex - 1];
}

/**
 * Obtém informações completas de um livro
 */
export function getBookInfo(bookId: string): BibleBook | null {
  return bibleBooks.find(b => b.book_id === bookId) || null;
}
